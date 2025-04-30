import { Fragment, useState, useEffect } from 'react';
import { List, Card, Typography } from '@material-tailwind/react';
import header from '../../assets/cheatmeal-header.jpg';
import axios from 'axios';
import { getToken } from '../../utils/Session.jsx';

export default function CalorieBuffer({ currentCalories, maxCalories }) {
    const [cheatMeals, setCheatMeals] = useState([]);

    console.log('Current calories: ', currentCalories);
    console.log('Max calories: ', maxCalories);

    async function postSnack(snackId) {
        const token = getToken();
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
        const fetchCheatMeals = async () => {
            const token = getToken();
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

        if (maxCalories !== 0 && currentCalories !== 0) {
            fetchCheatMeals();
        }
    }, [currentCalories, maxCalories]);

    return (
        <Card className="max-w-xs">
            <Card.Header as="img" src={header} alt="Foto af bestik med skriften keto diet" />
            <Card.Body>
                <Typography type="h6">Cheat Meals</Typography>
                { maxCalories - currentCalories === 0 && <Typography>Du har nået dit kalorieindtag for i dag. Du kan ikke tilføje flere snacks.</Typography>}
                { maxCalories - currentCalories < 0 && <Typography>Du har overskredet dit kalorieindtag for i dag med <b>{currentCalories - maxCalories} kalorier</b>. Du kan ikke tilføje flere snacks.</Typography>}
                { maxCalories - currentCalories > 0 && <Typography>I dag har du et kalorieunderskud på <b>{maxCalories - currentCalories} kcal</b>! Du har buffer til ekstra snacks i dag. Tryk på en snack for at tilføje en snack!</Typography>}
                <List>
                    {/* FIXME: snack can be null */}
                    {cheatMeals.map((snack, index) => (
                        <Fragment key={index}>
                            {snack !== null && <List.Item onClick={() => postSnack(snack.id)} className="cursor-pointer hover:bg-gray-100">
                                <List.ItemStart>
                                    <img src={snack.image} alt={snack.recipe} className="w-8 h-8 rounded-full object-cover" />
                                </List.ItemStart>
                                {snack.recipe}: {snack.calories} kcal
                            </List.Item>}
                        </Fragment>
                    ))}
                </List>
            </Card.Body>
        </Card>
    );
}
