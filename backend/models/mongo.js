const mongoose = require('mongoose');

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
            mail: 'test@example.com',
            password: 'secure123',
            curGroceries: ['Rice', 'Chicken'],
            age: 30,
            gender: 0,
            height: 180,
            weight: 75,
            activityLevel: 2,
            monthlyGoal: 2
        });

        const mealplan = await Mealplan.create({
            date: Date.now(),
            userId: user._id
        });
    
        await Meal.create({
            mealplanId: mealplan._id,
            mealId: 1
        });
    
        await Meal.create({
            mealplanId: mealplan._id,
            mealId: 2
        });
    
        await Meal.create({
            mealplanId: mealplan._id,
            mealId: 3
        });

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