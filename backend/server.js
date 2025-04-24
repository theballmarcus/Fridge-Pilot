const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Mealplan, Meal, test } = require("./models/mongo");
require("dotenv").config();

const { calculateDailyCalories } = require("./api");

const TOKEN_EXPIRATION_TIME = '12h'; // 1 hour

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
    const { age, gender, height, weight, activityLevel, monthlyGoal } = req.body;
// Age, gender, height, weight, activity level, monthlyGoal (weight loss, maintenance, muscle gain)
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(400).json({ msg: "User not found" });
        if (age) user.age = age;
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
        console.log(password, user.password)
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
    const { date } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(400).json({ msg: "User not found" });
        const dailyCalories = calculateDailyCalories(user);
        const mealplan = new Mealplan({
            date,
            userId: user._id
        });
        await mealplan.save();
        const meals = [];
        for (let i = 0; i < 3; i++) {
            const meal = new Meal({
                mealplanId: mealplan._id,
                mealId: i + 1
            });
            meals.push(meal);
            await meal.save();
        }
        res.status(200).json({
            msg: "Mealplan created successfully",
            mealplan,
            meals
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Server error"
        });
    }
}); // Generates a mealplan + grocery list of need to buy + recipes

// app.post("/api/diet/recipes"); // Get the generated recipes


// app.get("/api/stats/cur_intake"); // Get the daily status of a user

// app.get("/api/stats/total_intake"); // Get the daily status of a user


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));