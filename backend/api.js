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

function getRandom(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
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

function pickRandomRecipe() {
    const recipes = load_recipes();
    const randomIndex = Math.floor(Math.random() * recipes.length);
    return recipes[randomIndex];
}

function pickMeal(recipes, groceries, max_calories, catogory) {
    /*
    This function picks a meal based on the user's groceries and calorie limit.
    It filters the recipes based on the groceries available and the calorie limit.
    It returns a recipe that fits the criteria.
    returns a recipe object.
    */
    function scoreRecipe(recipe, groceries) {
        let score = 0;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < groceries.length; j++) {
                if (recipe[`ingredient_${i + 1}`] !== null && recipe[`ingredient_${i + 1}`].includes(groceries[j])) {
                    score++;
                }
            }
        }
        return score;
    }

    let meal_candidates = [];
    const meals = recipes.filter(recipe => recipe.category.id === catogory && recipe.difficulty === "Easy");
    for(let i = 0; i < meals.length; i++) {
        if (meals[i].calories <= max_calories) {
            meal_candidates.push(meals[i]);
        }
    }
    let breakfast_scores = [];
    for (let i = 0; i < meal_candidates.length; i++) {
        breakfast_scores.push(scoreRecipe(meal_candidates[i], groceries));
    }
    let meal_max_score = Math.max(...breakfast_scores);
    let max_score_index = breakfast_scores.indexOf(meal_max_score);

    return meal_candidates[max_score_index];
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
    const dinner_category = getRandom(3,7);

    const recipes = load_recipes();
    const breakfast = pickMeal(recipes, groceries, calories_morning, 1);
    const lunch = pickMeal(recipes, groceries, calories_lunch, lunch_category);
    const dinner = pickMeal(recipes, groceries, calories_dinner, dinner_category);

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
        total_calories += mealplan[i].calories;
        total_protein += mealplan[i].protein_in_grams;
        total_fat += mealplan[i].fat_in_grams;
        total_carbs += mealplan[i].carbohydrates_in_grams;
    }

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

    if (!activityFactors[activityLevel]) {
        throw new Error("Invalid activity level");
    }

    const bmr = gender === 0
        ? (10 * weight) + (6.25 * height) - (5 * age ) + 5
        : 10 * weight + 6.25 * height - (5 * age) - 161;

    return bmr * activityFactors[activityLevel - 1];
}

console.log(pickRandomRecipe());

const myGroceries = ["eggs", "milk", "chicken", "broccoli", "spinach"];
const max_calories = 1600;
const mealplan = cleverMealplanPicker(max_calories, myGroceries);
console.log("Mealplan: ", mealplan);
const stats = getStatsFromMealplan(mealplan, myGroceries);
console.log("Stats: ", stats);

module.exports = {
    getAllRecipes,
    cleverMealplanPicker,
    calculateDailyCalories
};
