const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Mealplan, Meal, test } = require("./models/mongo");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("MongoDB connected")
        test();
    }).catch(err => console.log("Mongo error: ", err));

app.post("/api/auth/register", async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        const userExist = await User.findOne({
            email
        });
        if (userExist) return res.status(400).json({
            msg: "User already exists"
        });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hash
        });
        await newUser.save();

        res.status(201).json({
            msg: "User registered successfully"
        });
        
    } catch (err) {
        res.status(500).json({
            msg: "Server error"
        });
    }
});

// app.post("/api/auth/register_details", async (req, res) => {
//     const { age, gender, height, weight, activityLevel, goal } = req.body;
// // Age, gender, height, weight, activity level, goal (weight loss, maintenance, muscle gain)

app.post("/api/auth/login", async (req, res) => {
    const {
        email,
        password
    } = req.body;
    try {
        const user = await User.findOne({
            email
        });
        if (!user) return res.status(400).json({
            msg: "Invalid credentials"
        });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({
            msg: "Invalid credentials"
        });

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({
            msg: "Server error"
        });
    }
});

// app.post("/api/gpt/groceries"); // Provide a list of groceries in fridge

// app.post("/api/gpt/mealplan"); // Generates a mealplan + grocery list of need to buy + recipes

// app.post("/api/gpt/recipes"); // Get the generated recipes


// app.get("/api/stats/cur_intake"); // Get the daily status of a user

// app.get("/api/stats/total_intake"); // Get the daily status of a user


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));