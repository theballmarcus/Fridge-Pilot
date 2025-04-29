import React from 'react';
import MealCard from '../../components/MealCard';
import { getToken } from '../../utils/Session.jsx';
import axios from 'axios';

export default function MealPlanPage() {
    const [mealToday, setMealToday] = React.useState([]);
    const [mealTomorrow, setMealTomorrow] = React.useState([]);
    const [mealDayAfterTomorrow, setMealDayAfterTomorrow] = React.useState([]);

    function retrieveMealplan(date) {
        return new Promise((resolve, reject) => {
            const token = getToken();
            if(token) {
                axios.get(`http://localhost:8080/api/diet/mealplan/${date}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    resolve(response.data);
        
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
            if(token) {
                axios.post(`http://localhost:8080/api/diet/mealplan`, {
                    date: date
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    resolve(response.data);
        
                }).catch(error => {
                    reject(error)
                });
            } else {
                reject(new Error('No token found'));
            }
        })
    }

    React.useEffect(() => {
        const date = Date.now();
        const oneDayMs = 100*60*60*24;

        // Get next 3 days of meals
        for (let i = 0; i < 3; i++) {
            retrieveMealplan(date + oneDayMs*i).then((response) => {
                console.log('Mealplan:', response);
                if(i === 0) {
                    setMealToday(response);
                } else if(i === 1) {
                    setMealTomorrow(response);
                } else if(i === 2) {
                    setMealDayAfterTomorrow(response);
                }
                
            }).catch((error) => {
                if(error.status === 404) {
                    postMealplan(date + oneDayMs*i).then((response) => {
                        console.log('Mealplan created:', response);
                        if(i === 0) {
                            setMealToday(response);
                        } else if(i === 1) {
                            setMealTomorrow(response);
                        } else if(i === 2) {
                            setMealDayAfterTomorrow(response);
                        }
                    }).catch((error) => {
                        console.error('Error:', error);
                    });

                    console.error('No mealplan found for this date');
                }
            });
        }
    }, []);

    return <>
        <MealCard></MealCard>
    </>
}
