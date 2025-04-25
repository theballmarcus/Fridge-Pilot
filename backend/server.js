const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Mealplan, Meal, test, flush_database } = require("./models/mongo");
require("dotenv").config();

const { calculateDailyCalories, cleverMealplanPicker, getStatsFromMealplan } = require("./api");

const TOKEN_EXPIRATION_TIME = '12h'; // 1 hour
const oneDayMs = 100*60*60*24;

const app = express();

app.use(cors());
app.use(express.json());

function verifyToken(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1]; 

    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 
        next(); 
    } catch (err) {
        return res.status(401).json({ msg: "Token is not valid" });
    }
}

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("MongoDB connected")
        test();
    }).catch(err => console.log("Mongo error: ", err));

app.post("/api/auth/register", async (req, res) => {
    const {
        mail,
        password
    } = req.body;

    try {
        const userExist = await User.findOne({
            mail
        });
        if (userExist) return res.status(400).json({
            msg: "User already exists"
        });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            mail,
            password: hash
        });
        await newUser.save();

        const token = jwt.sign({
            id: newUser._id
        }, process.env.JWT_SECRET, {
            expiresIn: TOKEN_EXPIRATION_TIME
        });

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                mail: newUser.mail
            },
            msg: "User registered successfully"
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Server error"
        });
    }
});

app.post("/api/auth/register_details", verifyToken, async (req, res) => {
    const { birthday, gender, height, weight, activityLevel, monthlyGoal } = req.body;
// birthday, gender, height, weight, activity level, monthlyGoal (weight loss, maintenance, muscle gain)
/*
birthday: Number        (timestamp (ms))
height: Number          (cm)
weight: Number          (kg)
activityLevel: Number   (1-5)
monthlyGoal: Number     (kg of fat pr. month)

*/
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(400).json({ msg: "User not found" });
        if (birthday) user.birthday = birthday;
        if (gender) user.gender = gender;
        if (height) user.height = height;
        if (weight) user.weight = weight;
        if (activityLevel) {
            if (activityLevel >= 1 && activityLevel <= 5) {
                user.activityLevel = activityLevel
            }
        };
        if (monthlyGoal) user.monthlyGoal = monthlyGoal;

        await user.save();
        res.status(200).json({
            msg: "User details updated successfully"
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Server error"
        });
    }
});

app.post("/api/auth/login", async (req, res) => {
    const {
        mail,
        password
    } = req.body;
    try {
        const user = await User.findOne({
            mail
        });
        if (!user) return res.status(400).json({
            msg: "Invalid mail"
        });
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({
            msg: "Invalid credentials"
        });

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: TOKEN_EXPIRATION_TIME
        });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                mail: user.mail
            }
        });
    } catch (err) {
        res.status(500).json({
            msg: "Server error"
        });
    }
});

app.post("/api/diet/groceries", verifyToken, async (req, res) => {
    const { groceries } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(400).json({ msg: "User not found" });
        user.curGroceries = groceries;
        await user.save();
        res.status(200).json({
            msg: "Groceries updated successfully"
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Server error"
        });
    }
}); // Provide a list of groceries in fridge

app.post("/api/diet/mealplan", verifyToken, async (req, res) => {
    let { date } = req.body; // Timestamp in ms
    const daysBeforeReset = 100*60*60*24*14;

    try {
        date = date - (date % oneDayMs);

        const user = await User.findById(req.user.id);
        if (!user) return res.status(400).json({ msg: "User not found" });
        var age = new Date(new Date() - new Date(user.birthday)).getFullYear() - 1970;
        const dailyBurnedCalories = calculateDailyCalories(user.gender, user.weight, user.height, age, user.activityLevel); 

        const oldMealplans = await Mealplan.find({"date" : {$gte: date - daysBeforeReset}});
        
        let usedMeals = {}
        for(let i = 0; i < oldMealplans.length; i++) {
            const meals = await Meal.find({mealplanId : oldMealplans[i]._id});
            for(let j = 0; j < meals.length; j++) {
                if (Object.keys(usedMeals).includes(meals[j].mealId.toString())) {
                    usedMeals[meals[j].mealId] = usedMeals[meals[j].mealId] + 1
                } else {
                    usedMeals[meals[j].mealId] = 1
                }
            }
        }

        let mealplan = await Mealplan.find({"date" : date });
        if(mealplan.length == 0) {
            mealplan = new Mealplan({
                date,
                userId: user._id
            });
            await mealplan.save();
        } else {
            mealplan = mealplan[0]
        }


        let dailyDesiredCalories;
        if (user.monthlyGoal) {
            dailyDesiredCalories = dailyBurnedCalories - user.monthlyGoal / 30.4 * 7700;
        } else {
            dailyDesiredCalories = dailyBurnedCalories;
        }

        // Avarage month: 30.4 days, 7700 calories in a kg of fat
        const meals = cleverMealplanPicker(600, user.curGroceries, usedMeals);
        for (let i = 0; i < 3; i++) {
            const meal = new Meal({
                mealplanId: mealplan._id,
                mealId: meals[i].id,
                date : date,
                factor: meals[i].factor
            });
            await meal.save();
        }

        console.log(getStatsFromMealplan(meals))
        res.status(200).json({
            msg: "Mealplan created successfully",
            meals
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Server error"
        });
    }
}); // Generates a mealplan + grocery list of need to buy + recipes

app.get("/api/diet/mealplan/:date", verifyToken, async (req, res) => {
    let date = req.params.date;
    date = date - (date % oneDayMs);

    try {
        let mealplan = Mealplan.find({"date" : date });
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Server error"
        });
    }
    res.status(200).json({
        msg: "Mealplan created successfully",
    });
})

// app.post("/api/diet/snack")

// app.post("/api/diet/recipes"); // Get the generated recipes

// app.get("/api/stats/cur_intake"); // Get the daily status of a user

// app.get("/api/stats/total_intake"); // Get the daily status of a user

app.post("/api/flush", verifyToken, (req, res) => {
    console.log('Flusing database.');
    flush_database();
    console.log('Flushed database succesfully.')
    res.status(200).json({
        msg: 'Flushed database'
    })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));