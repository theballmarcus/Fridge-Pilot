import { useEffect, useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { IconGrillFork } from '@tabler/icons-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider/index.jsx';

export default function MealCardDay(date) {
    const { getToken } = useAuth();
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

    function getRelativeDateWithFormat(date) {
        const today = new Date();
        const inputDate = new Date(date);

        today.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);

        const diffInDays = Math.floor((inputDate - today) / (1000 * 60 * 60 * 24));

        const formattedDate = inputDate.toLocaleDateString("da-DK", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        // Determine meal card label
        switch (diffInDays) {
            case 0:
                return `I dag (${formattedDate})`;
            case 1:
                return `I morgen (${formattedDate})`;
            case 2:
                return `I overmorgen (${formattedDate})`;
            default:
                // Fallback date
                return formattedDate;
        }
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
                    <Typography type="h5" className="text-foreground">
                        Ingen måltider fundet for denne dato
                    </Typography>
                </div>
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <Typography type="h5">{getRelativeDateWithFormat(date.date)}</Typography>
                    {theseMeals.map((meal, index) => (
                        <Card key={index} className="m-2 flex h-full w-full max-w-[48rem] flex-row">
                            <Card.Header className="m-0 h-full w-2/5 shrink-0 rounded-r-none">
                                <img
                                    src={meal.image}
                                    alt="card-image"
                                    className="h-full w-full object-cover"
                                />
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Typography
                                    type="small"
                                    className="mb-4 font-bold uppercase text-foreground"
                                >
                                    {meal.mealTime === 1 ? 'Morgenmad' : meal.mealTime === 2 ? 'Frokost' : meal.mealTime === 3 ? 'Aftensmad' : 'Snack'}
                                </Typography>
                                <Typography type="h5" className="mb-2">
                                    {meal.recipe}
                                </Typography>
                                <Typography className="mb-8 text-foreground">
                                    {meal.calories} kcal
                                    {meal.fat} g fedt
                                    {meal.carbs} g kulhydrater
                                    {meal.protein} g protein
                                    {meal.prepTime} min prep tid
                                    {meal.price} kr
                                    Her skal vi vise kcal, kulhydrater, protein, fedt med deres farvekodning og ikon
                                    <br />
                                    Vi skal også vise tid i alt, indkøbstid, pris og manglende ingredienser
                                </Typography>
                                <Button className="mb-2 flex w-fit items-center gap-2">
                                    <IconGrillFork />
                                    Se opskrift
                                </Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}
