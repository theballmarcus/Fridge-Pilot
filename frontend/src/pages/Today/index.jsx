import KetoGuidelines from '../../components/KetoGuidelines';
import MainPageProgress from '../../components/MainPageProgress';
import CalorieBuffer from '../../components/CalorieBuffer';
import { useEffect, useState } from 'react';
import { getToken } from '../../utils/Session.jsx';
import axios from 'axios';

export default function Today() {
    const [shouldRefetch, setShouldRefetch] = useState(false);

    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);
    const [carbs, setCarbs] = useState(0);

    const [dailyCalories, setDailyCalories] = useState(0);
    const [dailyProtein, setDailyProtein] = useState(0);
    const [dailyFat, setDailyFat] = useState(0);
    const [dailyCarbs, setDailyCarbs] = useState(0);

    const token = getToken();

    const refreshData = () => {
        setShouldRefetch(!shouldRefetch);
    };

    const fetchStats = async () => {
        const date = Date.now();
        try {
            const response = await axios.get(`http://localhost:8080/api/diet/stats/${date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            return error;
        }
    }

    const fetchData = async () => {
        const date = Date.now();
        let statsResponse = await fetchStats();
        if (statsResponse.status === 200) {
            console.log('Stats fetched successfully');

            return statsResponse.data;
        } else {
            // Generate new meal plan and fetch stats
            const mealplanResponse = await axios.post(`http://localhost:8080/api/diet/mealplan`, {
                date: date
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (mealplanResponse.status === 200) {
                console.log('Mealplan generated successfully');
                statsResponse = await fetchStats();
            }

            return statsResponse.data;
        }
    }


    useEffect(() => {
        fetchData().then(data => {
            console.log(data);

            setCalories(data.stats.total_calories);
            setProtein(data.stats.total_protein);
            setFat(data.stats.total_fat);
            setCarbs(data.stats.total_carbs);

            setDailyCalories(data.dailyBurnedCalories);
            setDailyCarbs(Math.round(data.dailyBurnedCalories * 0.05 / 4));
            setDailyProtein(Math.round(data.dailyBurnedCalories * 0.2 / 4));
            setDailyFat(Math.round(data.dailyBurnedCalories * 0.75 / 9));
        });

    }, [shouldRefetch]);

    return <>
        <div className="flex flex-row items-start justify-between">
            <div><KetoGuidelines /></div>
            <div className="w-max"><MainPageProgress calories={calories} protein={protein} fat={fat} carbs={carbs} dailyCalories={dailyCalories} dailyProtein={dailyProtein} dailyFat={dailyFat} dailyCarbs={dailyCarbs} refreshData={refreshData} /></div>
            <div><CalorieBuffer currentCalories={calories} maxCalories={dailyCalories} /></div>
        </div>
    </>
}
