import { useEffect, useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { IconPhoto, IconGrillFork, IconShoppingCart, IconFlame, IconWheat, IconMeat, IconDroplet } from '@tabler/icons-react';
import axios from 'axios';
import { useThemeColors } from '../../hooks/useThemeColors.jsx';
import Recipe from '../Recipe';
import { useAuth } from '../../context/AuthProvider/index.jsx';

function SkeletonText({ type, as, variant, className, textClassName }) {
    if (!type) throw new Error('No type set for SkeletonText')
    as ??= 'div';
    variant ??= 'paragraph';
    className ??= '';
    textClassName ??= '';

    return <div className={"max-w-full animated-pulse " + className}>
        <Typography
            type={type}
            as={as}
            variant={variant}
            className={`mb-2 h-2 w-72 rounded-full bg-gray-300 ${textClassName}`}
        >&nbsp;</Typography>
    </div>
}

function SkeletonCard() {
    return <Card className="m-2 flex h-full w-full max-w-[48rem] flex-row">
        {/* Image Skeleton - Now matches your image's w-2/5 width */}
        <div className="flex h-[300px] min-w-[40%] w-2/5 animate-pulse">
            <div className="h-full w-full bg-gray-300 rounded-r-none overflow-hidden flex items-center justify-center">
                <IconPhoto className="h-24 w-24 text-gray-400" />
            </div>
        </div>

        <Card.Body className="p-4">
            <SkeletonText type="small" className="mb-4" />
            <SkeletonText type="h5" className="mb-2" />
            <hr className="my-2 border-surface" />

            <div className="w-[400px] grid grid-cols-2 grid-rows-2 gap-4 h-[80px]">
                <div className="flex items-center justify-center">
                    <IconFlame className="text-gray-300" stroke="3" />
                    <SkeletonText type="h6" className="w-full" textClassName="w-full" />
                </div>
                <div className="flex items-center justify-center">
                    <IconWheat className="text-gray-300" stroke="3" />
                    <SkeletonText type="h6" className="w-full" textClassName="w-full" />
                </div>
                <div className="flex items-center justify-center">
                    <IconMeat className="text-gray-300" stroke="3" />
                    <SkeletonText type="h6" className="w-full" textClassName="w-full" />
                </div>
                <div className="flex items-center justify-center">
                    <IconDroplet className="text-gray-300" stroke="3" />
                    <SkeletonText type="h6" className="w-full" textClassName="w-full" />
                </div>
            </div>

            <hr className="my-2 border-surface" />
            <div className="flex flex-row justify-between mx-8">
                <SkeletonText type="paragraph" className="w-[150px]" textClassName="w-[150px]" />
                <SkeletonText type="paragraph" className="w-[150px]" textClassName="w-[150px]" />
            </div>
        </Card.Body>
    </Card>
}

function MealCard({ meal }) {
    const { firstColor, secondaryColor, tertiaryColor, quaternaryColor } = useThemeColors();
    const [recipeOpen, setRecipeOpen] = useState(false);

    return <>
        <Card className="m-2 flex h-full w-full max-w-[48rem] flex-row">
            <div className="flex h-[300px] w-2/5">
                <Card.Header className="h-full w-auto m-0 rounded-r-none">
                    <img
                        src={meal.image}
                        alt="card-image"
                        className="h-full w-auto object-cover object-center"
                    />
                </Card.Header>
            </div>
            <Card.Body className="p-4">
                <Typography
                    type="small"
                    className="mb-4 font-bold uppercase text-foreground"
                >
                    {meal.mealTime === 1 ? 'Morgenmad' : meal.mealTime === 2 ? 'Frokost' : meal.mealTime === 3 ? 'Aftensmad' : 'ANDET'}
                </Typography>
                <Typography type="h5" className="mb-2">
                    {meal.recipe}
                </Typography>
                <hr className="my-2 border-surface" />
                <div className="w-full grid grid-cols-2 grid-rows-2 gap-4 h-[80px]">
                    <div className="flex items-center justify-center">
                        <IconFlame color={quaternaryColor} />
                        <Typography type="h6">{meal.calories} kcal</Typography>
                    </div>
                    <div className="flex items-center justify-center">
                        <IconWheat color={firstColor} />
                        <Typography type="h6">{meal.carbs} kulhydrater</Typography>
                    </div>
                    <div className="flex items-center justify-center">
                        <IconMeat color={secondaryColor} />
                        <Typography type="h6">{meal.protein} protein</Typography>
                    </div>
                    <div className="flex items-center justify-center">
                        <IconDroplet color={tertiaryColor} />
                        <Typography type="h6">{meal.fat} fedt</Typography>
                    </div>
                </div>
                <hr className="my-2 border-surface" />
                <div className="flex flex-row justify-between mx-8">
                    <Typography><b>Tid i alt</b>: {meal.totalTime} min</Typography>
                    <Typography><b>Arbejdstid</b>: {meal.prepTime} min</Typography>
                </div>
                <hr className="my-2 border-surface" />
                <div className="flex flex-row">
                    <Button className="flex w-fit items-center gap-2" onClick={() => setRecipeOpen(true)}>
                        <IconGrillFork />
                        Se opskrift
                    </Button>
                    <Button className="flex w-fit items-center gap-2 ml-2">
                        <IconShoppingCart />
                        Se pris og ingredienser
                    </Button>
                </div>
            </Card.Body>
        </Card>
        <Recipe open={recipeOpen} meal={meal} onVisibilityChange={setRecipeOpen}/>
    </>
}

export default function MealCardDay({ date }) {
    const { getToken } = useAuth();
    const [theseMeals, setTheseMeals] = useState([]);
    const [mealsLoaded, setMealsLoaded] = useState(false);

    useEffect(() => {
        function retrieveMealplan(date) {
            const token = getToken();

            return new Promise((resolve, reject) => {
                if (token) {
                    axios.get(`http://localhost:8080/api/diet/mealplan/${date}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then(response => {
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    reject(new Error('No token found'));
                }
            });
        }

        function postNewMealplan(date) {
            return new Promise((resolve, reject) => {
                const token = getToken();
                if (token) {
                    axios.post(`http://localhost:8080/api/diet/mealplan`, {
                        date: date
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then(response => {
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    reject(new Error('No token found'));
                }
            });
        }

        async function waitForMealplanReady(mealplanId) {
            const token = getToken();

            const checkStatus = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/diet/mealplan/isDone/${mealplanId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    return response.data.isDone === true;
                } catch (err) {
                    console.error("Error checking isDone:", err);
                    return false;
                }
            };

            const interval = 1500;
            return new Promise((resolve) => {
                const poll = async () => {
                    const isDone = await checkStatus();
                    if (isDone) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        resolve(true);
                    } else {
                        setTimeout(poll, interval);
                    }
                };
                poll();
            });
        }

        retrieveMealplan(date)
            .then((response) => {
                setTheseMeals(response.data.meals || []);
                setMealsLoaded(true);
            })
            .catch((error) => {
                console.log('Getting initial mealPlan failed', error);
                setMealsLoaded(false);

                if (error.response?.status === 404) {
                    postNewMealplan(date)
                        .then(async (response) => {
                            await waitForMealplanReady(response.data.mealplanId)
                            const updatedData = await retrieveMealplan(date);
                            setTheseMeals(updatedData.data.meals || []);
                        })
                        .catch((error) => {
                            console.error('Error generating mealplan:', error);
                        }).finally(() => {
                            setMealsLoaded(true);
                        })
                } else {
                    console.error('Some error retrieving mealplan:', error);
                }
            });
    }, [date, getToken]);

    return (
        <>
            {!mealsLoaded ? (
                // Show 3 skeleton cards while initially loading/generating
                <div className="flex flex-col h-full w-full items-center justify-center">
                    {[{}, {}, {}].map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            ) : theseMeals.length > 0 ? (
                // Show actual meals when we have them
                <div className="flex flex-col h-full w-full items-center justify-center">
                    {theseMeals.map((meal, index) => (
                        meal.mealTime <= 3 && <MealCard meal={meal} key={index} />
                    ))}
                </div>
            ) : (
                // Show "no meals" message if we finished loading but got no meals
                <div className="flex h-full w-full items-center justify-center">
                    <Typography type="h5" color="error">
                        Ingen måltider fundet
                    </Typography>
                </div>
            )}
        </>
    );
}
