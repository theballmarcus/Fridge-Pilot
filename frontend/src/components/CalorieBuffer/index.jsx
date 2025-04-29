import { List, Card, Typography } from "@material-tailwind/react";
import { IconBrandPeanut, IconMilk, IconCheese, IconEggs } from '@tabler/icons-react';
import header from '../../assets/cheatmeal-header.jpg';
import { useState, useEffect } from 'react';
import axios from "axios";

export default function CalorieBuffer({currentCalories, maxCalories}) {
    const [cheatMeals, setCheatMeals] = useState([]);

    const token = localStorage.getItem('token');

    console.log('Current calories: ', currentCalories);
    console.log('Max calories: ', maxCalories);

    const fetchCheatMeals = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/diet/snacks/${maxCalories - currentCalories}/4`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log('Cheat meals fetched successfully');
            console.log(response.data);
            setCheatMeals(response.data.snacks);
        } catch (error) {
            console.error('Error fetching cheat meals:', error);
            return;
        }
    }

    async function postSnack(snackId) {
        try {
            const response = await axios.post(`http://localhost:8080/api/diet/snacks`, {
                snackId: snackId,
                date: Date.now()
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log('Snack posted successfully');
            console.log(response.data);
        } catch (error) {
            console.error('Error posting snack:', error);
            return;
        }
    }

    useEffect(() => {
        if (maxCalories !== 0 && currentCalories !== 0) {
            fetchCheatMeals();
        }
    }, [currentCalories, maxCalories]);
    
    return (
        <Card className="max-w-xs">
            <Card.Header as="img" src={header} alt="Foto af bestik med skriften keto diet" />
            <Card.Body>
                <Typography type="h6">Cheat Meals</Typography>
                <Typography>I dag har du et kalorieunderskud på <b>{ maxCalories - currentCalories } kcal</b>! Du har buffer til ekstra snacks i dag.</Typography>
                <List>
                    {cheatMeals.map((snack, index) => (
                        <List.Item key={index} onClick={() => postSnack(snack.id)} className="cursor-pointer hover:bg-gray-100">
                            <List.ItemStart>
                                <img src={snack.image} alt={snack.recipe} className="w-8 h-8 rounded-full object-cover" />
                            </List.ItemStart>
                            {snack.recipe}: {snack.calories} kcal
                        </List.Item>
                    ))}
                </List>
            </Card.Body>
        </Card>
    );
}
