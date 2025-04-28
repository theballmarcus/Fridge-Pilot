import React from 'react';
import { CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { Typography, Breadcrumb } from "@material-tailwind/react";
import { IconFlame, IconWheat, IconMeat, IconDroplet } from '@tabler/icons-react';
import ChangeUserWeight from '../../components/ChangeUserWeight';
import CalorieAddRemove from '../../components/CalorieAddRemove';
import axios from 'axios';
import { useTheme } from "next-themes";

function addOrRemoveCalories(calorieCount) {
    console.log('Calories: ', calorieCount);
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found in local storage');
        return;
    }
    const date = Date.now();
    const postCalories = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/api/diet/supply_calories/${date}`, {
                calories: calorieCount
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            return error;
        }
    }
    postCalories()
}

function changeUserWeight(newWeight) {
    console.log('New weight set: ', newWeight)

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found in local storage');
        return;
    }

    axios.post('http://localhost:8080/api/auth/register_details', {
        weight: newWeight
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        console.log(response)
    }).catch(error => {
        console.error('Error:', error);
    });
}

export default function MainPageProgress() {
    const [calories, setCalories] = React.useState(0);
    const [protein, setProtein] = React.useState(0);
    const [fat, setFat] = React.useState(0);
    const [carbs, setCarbs] = React.useState(0);
    const [dailyCalories, setDailyCalories] = React.useState(0);
    const [addRemoveCalories, setAddRemoveCalories] = React.useState(0);

    // FIXME: set component weight to user weight
    const [userWeight, setUserWeight] = React.useState(0);

    const [dailyProtein, setDailyProtein] = React.useState(0);
    const [dailyFat, setDailyFat] = React.useState(0);
    const [dailyCarbs, setDailyCarbs] = React.useState(0);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in local storage');
            return;
        }

        axios.get('http://localhost:8080/api/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                console.log('User fetched successfully');

                setUserWeight(response.data.weight);
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }, []);

    React.useEffect(() => {
        const date = Date.now();
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in local storage');
            return;
        }

        const fetchStats = async () => {
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
            let statsResponse = await fetchStats();
            if (statsResponse.status === 200) {
                console.log('Stats fetched successfully');

            } else if (statsResponse.status === 404) {
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
            }
            console.log(statsResponse.data);
            setCalories(statsResponse.data.stats.total_calories);
            setProtein(statsResponse.data.stats.total_protein);
            setFat(statsResponse.data.stats.total_fat);
            setCarbs(statsResponse.data.stats.total_carbs);

            setDailyCalories(statsResponse.data.dailyBurnedCalories);
            setDailyCarbs(Math.round(statsResponse.data.dailyBurnedCalories * 0.05 / 4));
            setDailyProtein(Math.round(statsResponse.data.dailyBurnedCalories * 0.2 / 4));
            setDailyFat(Math.round(statsResponse.data.dailyBurnedCalories * 0.75 / 9));
        }

        fetchData();
    }, []);

    const { theme } = useTheme();
    const [vars, setVars] = React.useState(null);

    React.useEffect(() => {
        const cssVarValue = window.getComputedStyle(document.documentElement);
        setVars(cssVarValue);
    }, [theme]);

    const colorPrimary = vars ? vars.getPropertyValue("--color-primary") : '';
    const colorInfo = vars ? vars.getPropertyValue("--color-info") : '';
    const colorSuccess = vars ? vars.getPropertyValue("--color-success") : '';

    // Render calorie count out of desired daily calorie count
    // Within, render weight loss in kgs out of desired weight loss
    return <>
        <div className="flex flex-col items-center justify-center">
            <Typography type="h2" className="mt-4">Dagens fremskridt</Typography>
            <hr className="w-full my-6 border-surface" />
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                <div className="absolute size-[300px]">
                    <CircularProgressbar value={carbs / dailyCarbs * 100} strokeWidth="5" styles={{
                        path: {
                            stroke: `rgb(${colorPrimary} / 1.0)`
                        }
                    }} />
                </div>
                <div className="absolute size-[258px]">
                    <CircularProgressbar value={protein / dailyProtein * 100} strokeWidth="6" styles={{
                        path: {
                            stroke: `rgb(${colorInfo} / 1.0)`
                        }
                    }} />
                </div>
                <div className="absolute size-[216px]">
                    <CircularProgressbarWithChildren strokeWidth="7" value={fat / dailyFat * 100} styles={{
                        path: {
                            stroke: `rgb(${colorSuccess} / 1.0)`
                        }
                    }}>
                        <div className="flex justify-center items-center">
                            <IconFlame size={50} />
                            <Typography type="h5">{calories}</Typography><span>/{dailyCalories}</span>
                        </div>
                        <span>Kalorier i dag</span>
                    </CircularProgressbarWithChildren>
                </div>
            </div>
            <div className="w-[600px] flex flex-col justify-center items-center">
                <ChangeUserWeight value={userWeight} onChange={setUserWeight} onSubmit={changeUserWeight} />
                <CalorieAddRemove value={addRemoveCalories} onChange={setAddRemoveCalories} onSubmit={addOrRemoveCalories} />
                <Breadcrumb className="gap-0.5 mt-6">
                    <Breadcrumb.Link className="flex justify-center rounded-lg border border-surface px-2 py-1 text-secondary-foreground">
                        <div className="grid grid-rows-2 grid-cols-[auto_auto] items-center p-2">
                            <div className="w-fit col-span-1 row-span-1">
                                <IconWheat color={`rgb(${colorPrimary} / 1.0)`} />
                            </div>
                            <div className="w-fit col-span-1 row-span-1">
                                <Typography type="h6">Kulhydrater</Typography>
                            </div>
                            <div className="w-fit col-span-2 row-span-1">
                                <span className='font-bold'>{carbs}</span> / {dailyCarbs}g
                            </div>
                        </div>
                    </Breadcrumb.Link>
                    <Breadcrumb.Separator>·</Breadcrumb.Separator>
                    <Breadcrumb.Link className="flex justify-center rounded-lg border border-surface px-2 py-1 text-secondary-foreground">
                        <div className="grid grid-rows-2 grid-cols-[auto_auto] items-center p-2">
                            <div className="w-fit col-span-1 row-span-1">
                                <IconMeat color={`rgb(${colorInfo} / 1.0)`} />
                            </div>
                            <div className="w-fit col-span-1 row-span-1">
                                <Typography type="h6">Protein</Typography>
                            </div>
                            <div className="w-fit col-span-2 row-span-1">
                                <span className='font-bold'>{protein}</span> / {dailyProtein}g
                            </div>
                        </div>
                    </Breadcrumb.Link>
                    <Breadcrumb.Separator>·</Breadcrumb.Separator>
                    <Breadcrumb.Link className="flex justify-center rounded-lg border border-surface px-2 py-1 text-secondary-foreground">
                        <div className="grid grid-rows-2 grid-cols-[auto_auto] items-center p-2">
                            <div className="w-fit col-span-1 row-span-1">
                                <IconDroplet color={`rgb(${colorSuccess} / 1.0)`} />
                            </div>
                            <div className="w-fit col-span-1 row-span-1">
                                <Typography type="h6">Fedt</Typography>
                            </div>
                            <div className="w-fit col-span-2 row-span-1">
                                <span className='font-bold'>{fat}</span> / {dailyFat}g
                            </div>
                        </div>
                    </Breadcrumb.Link>
                </Breadcrumb>
            </div>
        </div>
    </>
}
