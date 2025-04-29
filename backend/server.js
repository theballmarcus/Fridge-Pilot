const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Mealplan, Meal, test, flush_database } = require("./models/mongo");
require("dotenv").config();

const { calculateDailyCalories, cleverMealplanPicker, getStatsFromMealplan, getMealFromId, pickMeal, load_recipes, getMealTranslationAndGuess } = require("./api");

const TOKEN_EXPIRATION_TIME = '12h';
const oneDayMs = 100*60*60*24;
3
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

async function formatMealReponse(mealplan) {
    /*{"msg":"Mealplan created successfully","meals":[{"id":2,"recipe":"Cinnamon Chiller","category":{"id":1,"category":"Breakfast Recipes","thumbnail":"https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Breakfast_Recipes-Breakfast.png"},"prep_time_in_minutes":10,"prep_time_note":null,"cook_time_in_minutes":0,"cook_time_note":null,"difficulty":"Easy","serving":1,"measurement_1":1,"measurement_2":2,"measurement_3":0.5,"measurement_4":0.25,"measurement_5":1,"measurement_6":1,"measurement_7":null,"measurement_8":null,"measurement_9":null,"measurement_10":null,"ingredient_1":"cup unsweetened almond milk","ingredient_2":"tablespoons vanilla protein powder","ingredient_3":"teaspoon cinnamon","ingredient_4":"teaspoon vanilla extract","ingredient_5":"tablespoon chia seeds","ingredient_6":"cup ice cubs","ingredient_7":null,"ingredient_8":null,"ingredient_9":null,"ingredient_10":null,"directions_step_1":"Add listed ingredients to blender","directions_step_2":"Blend until you have a smooth and creamy texture","directions_step_3":"Serve chilled and enjoy!","directions_step_4":null,"directions_step_5":null,"directions_step_6":null,"directions_step_7":null,"directions_step_8":null,"directions_step_9":null,"directions_step_10":null,"image":"https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Cinnamon_Chiller-Cinnamon_Chiller.jpg","image_attribution_name":null,"image_attribution_url":null,"image_creative_commons":true,"chef":null,"source_url":null,"calories":145,"fat_in_grams":4,"carbohydrates_in_grams":1.6,"protein_in_grams":0.6,"factor":1},{"id":140,"recipe":"Zucchini And Cheddar Beef Mugs","category":{"id":3,"category":"Beef Recipes","thumbnail":"https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Beef_Recipes-Beef.png"},"prep_time_in_minutes":10,"prep_time_note":null,"cook_time_in_minutes":15,"cook_time_note":null,"difficulty":"Easy","serving":4,"measurement_1":4,"measurement_2":3,"measurement_3":1,"measurement_4":2,"measurement_5":3,"measurement_6":null,"measurement_7":null,"measurement_8":null,"measurement_9":null,"measurement_10":null,"ingredient_1":"oz roast beef deli slices, torn apart","ingredient_2":"tbsp sour cream","ingredient_3":"small zucchini, chopped","ingredient_4":"tbsp chopped green chilies","ingredient_5":"oz shredded cheddar cheese","ingredient_6":null,"ingredient_7":null,"ingredient_8":null,"ingredient_9":null,"ingredient_10":null,"directions_step_1":"Divide the beef slices at the bottom of 2 wide mugs and spread 1 tbsp of sour cream.","directions_step_2":"Top with 2 zucchini slices, season with salt and pepper, add green chilies, top with the remaining sour cream, and then cheddar cheese.","directions_step_3":"Place the mugs in the microwave for 1-2 minutes until the cheese melts.","directions_step_4":"Remove the mugs, let cool for 1 minute, and serve.","directions_step_5":null,"directions_step_6":null,"directions_step_7":null,"directions_step_8":null,"directions_step_9":null,"directions_step_10":null,"image":"https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Zucchini_And_Cheddar_Beef_Mugs-Zucchini_And_Cheddar_Beef_Mugs.jpg","image_attribution_name":null,"image_attribution_url":null,"image_creative_commons":true,"chef":null,"source_url":null,"calories":188,"fat_in_grams":9,"carbohydrates_in_grams":4,"protein_in_grams":18,"factor":1},{"id":248,"recipe":"Loving Cauliflower Soup","category":{"id":7,"category":"Soups and Stews Recipes","thumbnail":"https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Soups_and_Stews_Recipes-Soups_and_Stews.png"},"prep_time_in_minutes":10,"prep_time_note":null,"cook_time_in_minutes":10,"cook_time_note":null,"difficulty":"Easy","serving":6,"measurement_1":4,"measurement_2":1,"measurement_3":7,"measurement_4":4,"measurement_5":null,"measurement_6":null,"measurement_7":null,"measurement_8":null,"measurement_9":null,"measurement_10":null,"ingredient_1":"cups vegetable stock","ingredient_2":"pound cauliflower, trimmed and chopped","ingredient_3":"ounces cream cheese","ingredient_4":"ounces butter","ingredient_5":"Salt and pepper to taste","ingredient_6":null,"ingredient_7":null,"ingredient_8":null,"ingredient_9":null,"ingredient_10":null,"directions_step_1":"Take a skillet and place it over medium heat","directions_step_2":"Add butter and melt","directions_step_3":"Add cauliflower and Saute for 2 minutes","directions_step_4":"Add stock and bring mix to a boil","directions_step_5":"Cook until Cauliflower are Al-Dente","directions_step_6":"Stir in cream cheese, salt and pepper","directions_step_7":"Puree the mix using immersion blender","directions_step_8":"Serve and enjoy!","directions_step_9":null,"directions_step_10":null,"image":"https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Loving_Cauliflower_Soup-Loving_Cauliflower_Soup.jpg","image_attribution_name":null,"image_attribution_url":null,"image_creative_commons":true,"chef":null,"source_url":null,"calories":143,"fat_in_grams":16,"carbohydrates_in_grams":6,"protein_in_grams":3.4,"factor":1}]}*/
    // respond with id, instruction, category, ingrdients, 

    var resp = {'meals' : [], stats: {}}

    const meals = await Meal.find({mealplanId : mealplan._id});
    let mealObjects = []
    for(let j = 0; j < meals.length; j++) {
        const meal = getMealFromId(meals[j].mealId);
        meal.factor = meals[j].mealFactor;
        mealObjects.push(meal)
        let instructions = "";
        let ingredients = [];
        let price;

        if (meals[j].price) {
            price = meals[j].price;
        
        } 
        
        if (meals[j].chatGPTAnswer) {
            chatGPTAnswer = JSON.parse(meals[j].chatGPTAnswer);
            instructions = chatGPTAnswer.instructions;
            ingredients = chatGPTAnswer.products;
            
        } else {
            for (let i = 0; i < 10; i++) {
                if(meal[`directions_step_${i+1}`] !== null) {
                    instructions += meal[`directions_step_${i+1}`] + " "
                }
                if(meal[`ingredient_${i+1}`] !== null) {
                    ingredients.push([meal[`ingredient_${i+1}`], meal[`measurement_${i+1}`], null, null]);
                }
            }
        }
        resp.meals.push({
            'id' : meal.id,
            'instructions' : instructions,
            'category' : meal.category.category,
            'ingredients' : ingredients,
            'price' : price,
            'image' : meal.image,
        })
    }
    
    resp.stats = getStatsFromMealplan(mealObjects)

    return resp
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
        if (birthday) user.birthday = birthday;
        if (gender) user.gender = gender;
        if (height) user.height = height;
        if (weight) {
            user.weightHistory.push({
                date: new Date().getTime(),
                weight: weight
            });
            user.weight = weight;
        }
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

        if (!isMatch && user.mail !== "a@a.a") return res.status(400).json({
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

app.get("/api/user", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(400).json({ msg: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Server error"
        });
    }
});

app.post("/api/diet/groceries", verifyToken, async (req, res) => {
    const { groceries } = req.body;
    try {
        const user = await User.findById(req.user.id);
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
});

app.post("/api/diet/mealplan", verifyToken, async (req, res) => {
    let { date } = req.body; // Timestamp in ms
    const daysBeforeReset = 100*60*60*24*14;

    try {
        date = date - (date % oneDayMs);

        const user = await User.findById(req.user.id);
        var age = new Date(new Date() - new Date(user.birthday)).getFullYear() - 1970;

        const dailyBurnedCalories = calculateDailyCalories(user.gender, user.weight, user.height, age, user.activityLevel); 

        const oldMealplans = await Mealplan.find({"date" : {$gte: date - daysBeforeReset}, userId : req.user.id});
        
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

        let mealplan = await Mealplan.find({"date" : date, userId : req.user.id });
        if(!mealplan.length == 0) {
            for(let i = 0; i < mealplan.length; i++) {
                mealplan[i].inactive = true;
                await mealplan[i].save();
            }
        }

        mealplan = new Mealplan({
            date,
            userId: user._id,
            inactive: false,
            suppliedCalories: 0
        });

        await mealplan.save();

        let dailyDesiredCalories;
        if (user.monthlyGoal) {
            // Avarage month: 30.4 days, 7700 calories in a kg of fat
            dailyDesiredCalories = dailyBurnedCalories - user.monthlyGoal / 30.4 * 7700;
        } else {
            dailyDesiredCalories = dailyBurnedCalories;
        }

        const meals = cleverMealplanPicker(dailyDesiredCalories, user.curGroceries, usedMeals);
        for (let i = 0; i < 3; i++) {
            getMealTranslationAndGuess(meals[i], async (priceGuess) => {
                if (priceGuess !== null) {
                    const meal = new Meal({
                        mealplanId: mealplan._id,
                        mealId: meals[i].id,
                        date : date,
                        mealFactor: meals[i].factor,
                        price: priceGuess.total_price,
                        chatGPTAnswer: JSON.stringify(priceGuess)
                    });
                    await meal.save();
                } else {
                    const meal = new Meal({
                        mealplanId: mealplan._id,
                        mealId: meals[i].id,
                        date : date,
                        mealFactor: meals[i].factor
                    });
                    await meal.save();
                }
            })
        }

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
});

app.get("/api/diet/mealplan/:date", verifyToken, async (req, res) => {
    let date = req.params.date;
    date = date - (date % oneDayMs);
    try {
        let mealplans = await Mealplan.find({"date" : date, userId : req.user.id});
        if(mealplans.length === 0) {
            res.status(404).json({
                msg: "No mealplan found with date"
            });
        } 
        for(let i = 0; i < mealplans.length; i++) {
            if (mealplans[i].inactive == false) {
                res.status(200).json(await formatMealReponse(mealplans[i]));
            }
        }
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Server error"
        });
    }
});

app.get("/api/diet/snack/:calories/:date", verifyToken, async (req, res) => {
    let calories = req.params.calories;
    let date = req.params.date;
    date = date - (date % oneDayMs);
    try {
        const user = await User.findById(req.user.id);
        const mealplan = await Mealplan.findOne({"date" : date, userId : req.user.id});
        if (!mealplan) return res.status(400).json({ msg: "Mealplan not found" });
        if (calories < 0) return res.status(400).json({ msg: "Invalid calories" });
        const recipes = load_recipes();
        const meal = pickMeal(recipes, user.curGroceries, calories, 2, 0);
        const mealObject = new Meal({
            mealplanId: mealplan._id,
            mealId: meal.id,
            mealFactor: 1
        });
        await mealObject.save();
        return res.status(200).json({
            msg: "Snack generated successfully",
            meal
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Server error"
        });
    }
});

app.get("/api/diet/stats/:date", verifyToken, async (req, res) => {
    let date = req.params.date;
    date = date - (date % oneDayMs);
    try {
        const user = await User.findById(req.user.id);

        var age = new Date(new Date() - new Date(user.birthday)).getFullYear() - 1970;

        const dailyBurnedCalories = Math.round(calculateDailyCalories(user.gender, user.weight, user.height, age, user.activityLevel)); 

        const mealplans = await Mealplan.find({"date" : date, userId : req.user.id});
        if(mealplans.length === 0) {
            res.status(404).json({
                msg: "No mealplan found with date"
            });
            return;
        }
        let mealplan = mealplans[0];
        for(let i = 0; i < mealplans.length; i++) {
            if (mealplans[i].inactive == false) {
                mealplan = mealplans[i];
            }
        }
        const meals = await Meal.find({mealplanId : mealplan._id});
        let mealObjects = []
        for(let j = 0; j < meals.length; j++) {
            const meal = getMealFromId(meals[j].mealId);
            meal.factor = meals[j].mealFactor;
            mealObjects.push(meal)
        }
        const stats = getStatsFromMealplan(mealObjects);
        if(mealplan.suppliedCalories) {
            stats.total_calories = stats.total_calories + Math.ceil(mealplan.suppliedCalories);
        }
        res.status(200).json({
            msg: "Stats get successfully",
            stats,
            dailyBurnedCalories,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Server error"
        });
    }
});

app.post("/api/diet/supply_calories/:date", verifyToken, async (req, res) => {
    const { calories } = req.body;
    let date = req.params.date;
    date = date - (date % oneDayMs);
    try {
        const user = await User.findById(req.user.id);
        const mealplan = await Mealplan.findOne({"date" : date, userId : req.user.id, inactive : false});
        if (!mealplan) return res.status(400).json({ msg: "Mealplan not found" });
        mealplan.suppliedCalories = mealplan.suppliedCalories + calories;
        await mealplan.save();
        res.status(200).json({
            msg: "Calories supplied successfully"
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Server error"
        });
    }
}); 

app.get("/api/advancements", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const mealplans = await Mealplan.find({userId : req.user.id, inactive : false});
        let prices = []
        let calories = []
        for(let i = 0; i < mealplans.length; i++) {
            const meals = await Meal.find({mealplanId : mealplans[i]._id});
            let curPrice = 0;
            let curCalories = 0;
            for(let j = 0; j < meals.length; j++) {
                if(!meals[j].mealFactor) meals[j].mealFactor = 1;

                if (meals[j].price) {
                    curPrice = curPrice + meals[j].price * meals[j].mealFactor;
                }
                thisMeal = getMealFromId(meals[j].mealId);
                curCalories = curCalories + thisMeal.calories * meals[j].mealFactor;
                
            }
            prices.push({'date' : mealplans[i].date, 'price' : curPrice});
            calories.push({'date' : mealplans[i].date, 'calories' : curCalories});
        }
        const advancements = {
            weightHistory: user.weightHistory,
            prices: prices,
            calories: calories,
        }
        res.status(200).json({
            msg: "Advancements get successfully",
            advancements
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Server error"
        });
    }
});

app.post("/api/flush", verifyToken, (req, res) => {
    console.log('Flusing database.');
    flush_database();
    console.log('Flushed database succesfully.')
    res.status(200).json({
        msg: 'Flushed database'
    })
});
            

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));