import KetoGuidelines from '../../components/KetoGuidelines';
import MainPageProgress from '../../components/MainPageProgress';
import CalorieBuffer from '../../components/CalorieBuffer';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Today() {
    const { getToken } = useAuth();
    const [shouldRefetch, setShouldRefetch] = useState(false);

    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);
    const [carbs, setCarbs] = useState(0);

    const [dailyCalories, setDailyCalories] = useState(0);
    const [dailyProtein, setDailyProtein] = useState(0);
    const [dailyFat, setDailyFat] = useState(0);
    const [dailyCarbs, setDailyCarbs] = useState(0);


    const refreshData = () => {
        setShouldRefetch(!shouldRefetch);
    };

    const fetchStats = async () => {
        const token = getToken();

        const date = Date.now();
        try {
            const response = await axios.get(`${API_BASE_URL}/api/diet/stats/${date}`, {
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
        const token = getToken();

        const date = Date.now();
        let statsResponse = await fetchStats();
        if (statsResponse.status === 200) {
            console.log('Stats fetched successfully');

            return statsResponse.data;
        } else {
            const mealplanResponse = await axios.post(`${API_BASE_URL}/api/diet/mealplan`, {
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
        const token = getToken();

        if (token) {
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
        }

    }, [shouldRefetch]);

    return <>
        <div className="flex flex-row items-start justify-between">
            <div><KetoGuidelines /></div>
            <div className="w-max"><MainPageProgress calories={calories} protein={protein} fat={fat} carbs={carbs} dailyCalories={dailyCalories} dailyProtein={dailyProtein} dailyFat={dailyFat} dailyCarbs={dailyCarbs} refreshData={refreshData} /></div>
            <div><CalorieBuffer currentCalories={calories} maxCalories={dailyCalories} onAdd={refreshData} /></div>
        </div>
    </>
}
