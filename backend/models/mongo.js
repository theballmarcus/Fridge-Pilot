const mongoose = require('mongoose');

const oneDayMs = 100*60*60*24;

const userSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    curGroceries: [String],
    birthday: Number,       // timestamp
    gender: Boolean,        // 0 for mand, 1 for kvinde
    height: Number,
    weight: Number,
    activityLevel: Number,  // 1-5
    monthlyGoal: Number,    // kg. pr måned
    weightHistory: [{
        date: Number,
        weight: Number
    }],
});

const mealplanSchema = new mongoose.Schema({
    date: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    suppliedCalories: Number,
    inactive: Boolean
});

const mealSchema = new mongoose.Schema({
    mealplanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mealplan',
        required: true
    },
    mealId: {
        type: Number,
        required: true
    },
    price: Number,
    mealFactor: Number,          // One meal might be too little calories, this factor is multiplied for calories
    chatGPTAnswer: String,
});

const User = mongoose.model('User', userSchema);
const Mealplan = mongoose.model('Mealplan', mealplanSchema);
const Meal = mongoose.model('Meal', mealSchema);

async function test() {
    try {
        const user = await User.create({
            mail: 'a@a.a',
            password: '1',
            curGroceries: ['Rice', 'Chicken'],
            age: 30,
            gender: 0,
            height: 180,
            weight: 90,
            activityLevel: 2,
            monthlyGoal: 5,
            weightHistory: [
                { date: Date.now() - (Date.now() % oneDayMs), weight: 90 },
                { date: Date.now() - (Date.now() % oneDayMs) - 1000 * 60 * 60 * 24 * 30, weight: 92 },
                { date: Date.now() - (Date.now() % oneDayMs) - 1000 * 60 * 60 * 24 * 90, weight: 95 },
                { date: Date.now() - (Date.now() % oneDayMs) - 1000 * 60 * 60 * 24 * 60, weight: 100 },
                { date: Date.now() - (Date.now() % oneDayMs) - 1000 * 60 * 60 * 24 * 120, weight: 105 },
                { date: Date.now() - (Date.now() % oneDayMs) - 1000 * 60 * 60 * 24 * 150, weight: 110 },
                { date: Date.now() - (Date.now() % oneDayMs) - 1000 * 60 * 60 * 24 * 180, weight: 120 },
                { date: Date.now() - (Date.now() % oneDayMs) - 1000 * 60 * 60 * 24 * 210, weight: 125 },
                { date: Date.now() - (Date.now() % oneDayMs) - 1000 * 60 * 60 * 24 * 240, weight: 130 },
                { date: Date.now() - (Date.now() % oneDayMs) - 1000 * 60 * 60 * 24 * 270, weight: 135 }
            ]
        });

        for (let i = 0; i < 12; i++) {
            const mealplan = await Mealplan.create({
                date: Date.now() - (Date.now() % oneDayMs) - (i * 1000 * 60 * 60 * 24 * 30),
                userId: user._id,
                inactive: Math.random() > 0.5,
                suppliedCalories: Math.round(Math.random() * 500),
            });
    
            await Meal.create({
                mealplanId: mealplan._id,
                mealId: Math.round(Math.random() * 400),
                price: Math.round(Math.random() * 100),
            });
    
            await Meal.create({
                mealplanId: mealplan._id,
                mealId: Math.round(Math.random() * 400),
                price: Math.round(Math.random() * 100),
            });
    
            await Meal.create({
                mealplanId: mealplan._id,
                mealId: Math.round(Math.random() * 400),
                price: Math.round(Math.random() * 100),
            });
        }

        console.log('User created successfully:', user);
    }
    catch (error) {
        // console.error('Error creating user:', error);
    }
}

async function flush_database() {
    await User.deleteMany({});
    await Mealplan.deleteMany({});
    await Meal.deleteMany({});
}

module.exports = {
    User,
    Mealplan,
    Meal,
    test,
    flush_database
};