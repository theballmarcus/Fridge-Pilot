/*
curl --request GET 
	--url 'https://keto-diet.p.rapidapi.com/?protein_in_grams__lt=15&protein_in_grams__gt=5' 
	--header 'x-rapidapi-host: keto-diet.p.rapidapi.com' 
	--header 'x-rapidapi-key: API_KEY=REMOVED'
*/

/*[
  {
    "id": 1,
    "category": "Breakfast Recipes",
    "thumbnail": "https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Breakfast_Recipes-Breakfast.png"
  },
  {
    "id": 2,
    "category": "Appetizer and Snacks Recipes",
    "thumbnail": "https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Appetizer_and_Snacks_Recipes-Appetizer_and_Snacks.png"
  },
  {
    "id": 3,
    "category": "Beef Recipes",
    "thumbnail": "https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Beef_Recipes-Beef.png"
  },
  {
    "id": 4,
    "category": "Pork And Other Red Meat",
    "thumbnail": "https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Pork_And_Other_Red_Meat-Pork_And_Other_Red_Meat.png"
  },
  {
    "id": 5,
    "category": "Poultry Recipes",
    "thumbnail": "https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Poultry_Recipes-Poultry.png"
  },
  {
    "id": 6,
    "category": "Fish and Seafood Recipes",
    "thumbnail": "https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Fish_and_Seafood_Recipes-Fish_and_Seafood_.png"
  },
  {
    "id": 7,
    "category": "Soups and Stews Recipes",
    "thumbnail": "https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Soups_and_Stews_Recipes-Soups_and_Stews.png"
  },
  {
    "id": 8,
    "category": "Desserts Recipes",
    "thumbnail": "https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Desserts_Recipes-Desserts.png"
  },
  {
    "id": 9,
    "category": "Vegan and Vegetarian Recipes",
    "thumbnail": "https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Vegan_and_Vegetarian_Recipes-Vegan_and_Vegetarian.png"
  },
  {
    "id": 10,
    "category": "Keto Kitchen Staples And Dips Recipes",
    "thumbnail": "https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Keto_Kitchen_Staples_And_Dips_Recipes-Keto_Kitchen_Staples_And_Dips_.png"
  },
  {
    "id": 11,
    "category": "Drinks And Smoothies",
    "thumbnail": "https://s3.us-west-004.backblazeb2.com/encurate/static/keto/1/Drinks_And_Smoothies-Drinks_And_Smoothies.png"
  }
]*/

const http = require('https');
const fs = require('fs');
require("dotenv").config();
const { OpenAI, OpenAIApi } = require('openai');
const axios = require('axios');

function getRandom(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
}  

function findMealCaloryFactor(meal, desiredCalories) {
    const factor = Math.floor(desiredCalories / meal.calories)
    return factor
}

function load_recipes() {
    const recipes = JSON.parse(fs.readFileSync('recipe_data/all_recipes.json', 'utf8'));
    return recipes;
}

function getAllRecipes() {
    const options = {
        method: 'GET',
        hostname: 'keto-diet.p.rapidapi.com',
        port: null,
        path: '/',
        headers: {
            'x-rapidapi-key': 'API_KEY=REMOVED',
            'x-rapidapi-host': 'keto-diet.p.rapidapi.com'
        }
    };

    const req = http.request(options, function (res) {
        const chunks = [];

        res.on('data', function (chunk) {
            chunks.push(chunk);
        });

        res.on('end', function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
            // Write to file
            fs.writeFile('recipe_data/all_recipes.json', body.toString(), (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log('Response saved to response.json');
                }
            });
        });
    });

    req.end();
}

function scoreRecipe(recipe, groceries, old_recipes, max_calories) {
    let score = 10;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < groceries.length; j++) {
            if (recipe[`ingredient_${i + 1}`] !== null && recipe[`ingredient_${i + 1}`].includes(groceries[j])) {
                score = score + 2;
            }
        }
    }
    if (Object.keys(old_recipes).includes(recipe.id.toString())) { // If it has been eaten in the last 14 days, make the score lower.
        score = score / (1.8 * old_recipes[recipe.id]);
    }
    // Remove score if the recipe has too little calories
    if (max_calories != -1) {
        factor = findMealCaloryFactor(recipe, max_calories);
        c = recipe.calories * factor;
        score = score * (c / max_calories);
    }
    return score;
}

function pickMeal(recipes, groceries, max_calories, catogory, old_recipes) {
    /*
    This function picks a meal based on the user's groceries and calorie limit.
    It filters the recipes based on the groceries available and the calorie limit.
    It returns a recipe that fits the criteria.
    returns a recipe object.
    */
    let mealCandidates = [];
    const meals = recipes.filter(recipe => recipe.category.id === catogory && recipe.difficulty === "Easy");
    for(let i = 0; i < meals.length; i++) {
        if (meals[i].calories <= max_calories) {
            mealCandidates.push(meals[i]);
        }
    }
    let allScores = [];
    for (let i = 0; i < mealCandidates.length; i++) {
        allScores.push(scoreRecipe(mealCandidates[i], groceries, old_recipes, max_calories));
    }
    console.log("allScores", allScores)
    let mealMaxScore = Math.max(...allScores);
    console.log("mealMaxScore", mealMaxScore)
    let maxScoreIndex = allScores.indexOf(mealMaxScore);
    mealCandidates[maxScoreIndex].factor = findMealCaloryFactor(mealCandidates[maxScoreIndex], max_calories)
    return mealCandidates[maxScoreIndex];
}

function cleverMealplanPicker(max_calories, groceries, old_recipes) { 
    /*
    This function picks 3 meals for the day based on the user's groceries and calorie limit.
    It filters the recipes based on the groceries available and the calorie limit.
    It returns a list of recipes that fit the criteria.

    returns an array of recipes. Ex: [breakfast, lunch, dinner]
    */
    const calories_morning = max_calories / 100 * 25;
    const calories_lunch = max_calories / 100 * 40;
    const calories_dinner = max_calories / 100 * 35;

    const lunch_category = getRandom(3,7);
    let dinner_category = getRandom(3,7);
    while (lunch_category === dinner_category) {
        dinner_category = getRandom(3,7);
    }

    const recipes = load_recipes();
    const breakfast = pickMeal(recipes, groceries, calories_morning, 1, old_recipes);
    if (Object.keys(old_recipes).includes(breakfast.id.toString())) {
        old_recipes[breakfast.id] = old_recipes[breakfast.id] + 1
    } else {
        old_recipes[breakfast.id] = 1
    }
    const lunch = pickMeal(recipes, groceries, calories_lunch, lunch_category, old_recipes);
    if (Object.keys(old_recipes).includes(lunch.id.toString())) {
        old_recipes[lunch.id] = old_recipes[lunch.id] + 1
    } else {
        old_recipes[lunch.id] = 1
    }
    const dinner = pickMeal(recipes, groceries, calories_dinner, dinner_category, old_recipes);
    return [breakfast, lunch, dinner];
}

function getStatsFromMealplan(mealplan, groceries) {
    /* Returns the total calories, protein, fat, carbs from the mealplan and what needs to be bought */
    let total_calories = 0;
    let total_protein = 0;
    let total_fat = 0;
    let total_carbs = 0;

    let groceries_needed = [];


    for (let i = 0; i < mealplan.length; i++) {
        if(!mealplan[i].factor) mealplan[i].factor = 1;
        total_calories += mealplan[i].calories * mealplan[i].factor;
        total_protein += mealplan[i].protein_in_grams * mealplan[i].factor;
        total_fat += mealplan[i].fat_in_grams * mealplan[i].factor;
        total_carbs += mealplan[i].carbohydrates_in_grams * mealplan[i].factor;
    }
    total_calories = Math.round(total_calories)
    console.log("Total calories: ", total_calories)
    return {
        total_calories,
        total_protein,
        total_fat,
        total_carbs,
        groceries_needed
    };
}

function calculateDailyCalories(gender, weight, height, age, activityLevel, ) {
    const activityFactors = [1.2, 1.375, 1.55, 1.725, 1.9];
    if (!activityFactors[activityLevel - 1]) {
        throw new Error("Invalid activity level");
    }

    const bmr = gender === 0
        ? (10 * weight) + (6.25 * height) - (5 * age ) + 5
        : 10 * weight + 6.25 * height - (5 * age) - 161;

    return bmr * activityFactors[activityLevel - 1];
}

function getMealFromId(id) {
    const recipes = load_recipes();
    for(let i = 0; i < recipes.length; i++) {
        if(recipes[i].id == id) {
            return recipes[i]
        }
    }
}

function getNSnacks(calories, nAmount, old_recipes) {
    /*
    This function picks nAmount meals for the day based on the user's groceries and calorie limit.
    It filters the recipes based on the groceries available and the calorie limit.
    It returns a list of recipes that fit the criteria.

    returns an array of recipes. Ex: [breakfast, lunch, dinner]
    */
   console.log(calories, nAmount, old_recipes)
    const recipes = load_recipes();
    let mealCandidates = [];
    for(let i = 0; i < recipes.length; i++) {
        if((recipes[i].category.id === 2 || recipes[i].category.id === 8) && recipes[i].calories <= calories) {
            mealCandidates.push(recipes[i]);
        }
    }
    let allScores = [];
    for (let i = 0; i < mealCandidates.length; i++) {
        allScores.push(scoreRecipe(mealCandidates[i], [], old_recipes, -1));
    }
    // Return nAmount of the highest scoring recipes
    let bestSnacks = [];
    for(let i = 0; i < nAmount; i++) {
        let mealMaxScore = Math.max(...allScores);
        let maxScoreIndex = allScores.indexOf(mealMaxScore);
        bestSnacks.push(mealCandidates[maxScoreIndex]);
        allScores[maxScoreIndex] = -1; // Remove the recipe from the list
    }
    return bestSnacks;
}

let openai = null;
if(process.env.OPENAI_ENABLED === 'true') {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, 
    });
}

/* CHATGPT */
async function getMealTranslationAndGuess(meal, curGroceries, callback) {
    try {
        let products = '';
        let instructions = '';
        const ingredientKeys = Object.keys(meal).filter(key => key.startsWith('ingredient_') && meal[key] !== null);

        // Ingredients are 1-indexed
        for (let i = 1; i < ingredientKeys.length + 1; i++) {
            const ingredient = meal['ingredient_' + i];
            const measurement = meal['measurement_' + i];
            products += `${ meal[measurement] || '' }${ meal[measurement] !== null ? ' ' : '' }${ingredient}\n`;
        }

        const directionKeys = Object.keys(meal).filter(key => key.startsWith('directions_step_') && meal[key] !== null);
        for (const key of directionKeys) {
            instructions += meal[key] + '\n';
        }

        console.log(meal)

        if(openai !== null) {
            const prompt = `Inputs:
{INGREDIENTS_FOR_RECIPE}
 ${ products }

{USER_AVALIABLE_INGREDIENTS} (danish)
${ curGroceries.join('\n') }

{RECIPE_COOKING_STEPS}
${ instructions }

{DISH_NAME}
${ meal.recipe }

Task:
1. For each recipe ingredient:
  a. Translate to Danish -> {NAME}
  b. Convert quantity to metric shorthand (g, ml). If missing infer int from name. Int must > 0.
  c. Estimate price in DKK (int). Use 0 if in {USER_AVAILABLE_INGREDIENTS}
  d. Mark {NOT_AVALIABLE}=true if not in {USER_AVAILABLE_INGREDIENTS}. (very strict match, no substitutions)
2. Return each product as [NAME (string), QUANTITY (int), UNIT (string), PRICE (int), BUY (bool)]
3. Translate {RECIPE_COOKING_STEPS} to Danish, join with \\n
4. Translate {DISH_NAME} to Danish, capitalize first letter

Output ONLY JSON format:
{
  "products: [
    [<NAME>, <QUANITITY>, <UNIT>, <PRICE>, <BUY>],
    ...
  ],
  "instructions": "<DANISH_STEPS>";
  "dish_name": "<DANISH_NAME>"
}`

            console.log(prompt);
            const gptResponse = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1000,
            });
            
            message = gptResponse.choices[0].message.content.trim();                
            console.log(gptResponse.choices[0].message.content)
            if (message.startsWith('```json')) {
                message = message.slice(7, -3);
            }
            parsed = JSON.parse(message);

            let total_price = 0;
            for (let i = 0; i < parsed.products.length; i++) {
                if (parsed.products[i][3] != null) {
                    total_price += parseFloat(parsed['products'][i][3]);
                }
            }
            parsed['total_price'] = total_price;
            callback(parsed); 
        }
    } catch (error) {
        console.error('Error in getMealTranslationAndGuess:', error);
        callback(null);
    }
}

module.exports = {
    cleverMealplanPicker,
    calculateDailyCalories,
    getStatsFromMealplan,
    getMealFromId,
    pickMeal,
    load_recipes,
    getMealTranslationAndGuess,
    getNSnacks
};
