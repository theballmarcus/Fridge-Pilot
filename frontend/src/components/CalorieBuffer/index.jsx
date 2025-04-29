import { List, Card, Typography } from "@material-tailwind/react";
import { IconBrandPeanut, IconMilk, IconCheese, IconEggs } from '@tabler/icons-react';
import header from '../../assets/cheatmeal-header.jpg';
import { useState, useEffect } from 'react';

export default function CalorieBuffer({currentCalories, maxCalories}) {
    const [cheatMeals, setCheatMeals] = useState([]);

    const token = localStorage.getItem('token');

    console.log('Current calories: ', currentCalories);
    console.log('Max calories: ', maxCalories);

    const fetchCheatMeals = async () => {
        console.log(maxCalories - currentCalories);
        const response = await fetch(`http://localhost:8080/api/diet/snacks/${maxCalories - currentCalories}/4`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.status === 200) {
            const data = await response.json();
            console.log(data.snacks)
            setCheatMeals(data.snacks);
        } else {
            console.error('Error fetching cheat meals:', response.statusText);
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
                <Typography>I dag har du et kalorieunderskud på <i>{ maxCalories - currentCalories }</i> kcal! Du har buffer til ekstra snacks i dag.</Typography>
                <List>
                    {cheatMeals.map((snack, index) => (
                        <List.Item key={index}>
                            <List.ItemStart>
                                <img src={snack.image} alt={snack.recipe} className="w-8 h-8 rounded-full" />
                            </List.ItemStart>
                            {snack.recipe}: {snack.calories} kcal
                        </List.Item>
                    ))}
                </List>
            </Card.Body>
        </Card>
    );
}
