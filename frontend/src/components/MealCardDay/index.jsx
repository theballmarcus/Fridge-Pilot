import { useEffect, useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { IconGrillFork, IconShoppingCart, IconFlame, IconWheat, IconMeat, IconDroplet } from '@tabler/icons-react';
import axios from 'axios';
import { useThemeColors } from '../../hooks/useThemeColors.jsx';
import { useAuth } from '../../context/AuthProvider/index.jsx';

export default function MealCardDay(date) {
    const { getToken } = useAuth();
    const { firstColor, secondaryColor, tertiaryColor, quaternaryColor } = useThemeColors();
    const [theseMeals, setTheseMeals] = useState([]);

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
                    reject(error)
                });
            } else {
                reject(new Error('No token found'));
            }
        })
    }

    function postMealplan(date) {
        return new Promise((resolve, reject) => {
            const token = getToken();
            if (token) {
                axios.post(`http://localhost:8080/api/diet/mealplan`, {
                    date: date.date
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    resolve(response);

                }).catch(error => {
                    reject(error)
                });
            } else {
                reject(new Error('No token found'));
            }
        })
    }

    useEffect(() => {
        retrieveMealplan(date.date).then((response) => {
            console.log('Mealplan:', response);
            setTheseMeals(response.data.meals);

        }).catch((error) => {
            if (error.status === 404) {
                postMealplan(date).then((response) => {
                    console.log('Mealplan created:', response);
                    setTheseMeals(response.data.meals);

                }).catch((error) => {
                    console.error('Error:', error);
                });

                console.error('No mealplan found for this date');
            }
        });
    }, []);

    return (
        <>
            {theseMeals.length < 1 ? (
                <div className="flex h-full w-full items-center justify-center">
                    <Typography type="h5" color="error">
                        Ingen måltider fundet
                    </Typography>
                </div>
            ) : (
                <div className="flex flex-col h-full w-full items-center justify-center">
                    {theseMeals.map((meal, index) => (
                        (meal.mealTime <= 3 && <Card key={index} className="m-2 flex h-full w-full max-w-[48rem] flex-row">
                            <div className="flex h-[300px] w-2/5">
                                <Card.Header className="h-full w-auto m-0 rounded-r-none">
                                    <img
                                        src={meal.image}
                                        alt="card-image"
                                        className="h-full w-auto object-cover object-center"
                                    />  </Card.Header>
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
                                    <Button className="flex w-fit items-center gap-2">
                                        <IconGrillFork />
                                        Se opskrift
                                    </Button>
                                    <Button className="flex w-fit items-center gap-2 ml-2">
                                        <IconShoppingCart />
                                        Se pris og ingredienser
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>)
                    ))}
                </div>
            )}
        </>
    );
}
