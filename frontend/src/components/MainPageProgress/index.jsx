import { useState, useEffect } from 'react';
import { CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { Typography, Breadcrumb } from '@material-tailwind/react';
import { IconFlame, IconWheat, IconMeat, IconDroplet } from '@tabler/icons-react';
import CalorieProgress from '../../components/CalorieProgress';
import ChangeUserWeight from '../../components/ChangeUserWeight';
import CalorieAddRemove from '../../components/CalorieAddRemove';
import axios from 'axios';
import { getToken } from '../../utils/Session.jsx';
import { useThemeColors } from '../../hooks/useThemeColors.jsx';

const addOrRemoveCalories = async (calorieCount) => {
    console.log('Changing calories: ', calorieCount);

    const token = getToken();
    const date = Date.now();
    return await axios.post(`http://localhost:8080/api/diet/supply_calories/${date}`, {
        calories: calorieCount
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(result => {
        if (result.statusText !== 'OK') console.error(result.data.msg);
    });
}

const changeUserWeight = async (newWeight) => {
    console.log('New weight set: ', newWeight)

    const token = getToken();
    return await axios.post('http://localhost:8080/api/auth/register_details', {
        weight: newWeight
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        console.log(response);
    }).catch(error => {
        console.error('Error:', error);
    });
}

export default function MainPageProgress() {
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);
    const [carbs, setCarbs] = useState(0);

    const [dailyCalories, setDailyCalories] = useState(0);
    const [dailyProtein, setDailyProtein] = useState(0);
    const [dailyFat, setDailyFat] = useState(0);
    const [dailyCarbs, setDailyCarbs] = useState(0);

    const [addRemoveCalories, setAddRemoveCalories] = useState(0);
    const [newUserWeight, setNewUserWeight] = useState(0);
    const [caloriesChanging, setCaloriesChanging] = useState(false);
    const [weightChanging, setWeightChanging] = useState(false);

    useEffect(() => {
        const token = getToken();

        const fetchUserWeight = () => {
            return axios.get('http://localhost:8080/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                if (response.status === 200) {
                    console.log('User fetched successfully');

                    return response.data.weight;
                }

                return null;
            }).catch(error => {
                console.error('Error:', error);
            });
        }

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

        fetchUserWeight().then(weight => setNewUserWeight(weight))
    }, [caloriesChanging, weightChanging]);

    const { firstColor, secondaryColor, tertiaryColor } = useThemeColors();

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
                            stroke: firstColor
                        }
                    }} />
                </div>
                <div className="absolute size-[258px]">
                    <CircularProgressbar value={protein / dailyProtein * 100} strokeWidth="6" styles={{
                        path: {
                            stroke: secondaryColor
                        }
                    }} />
                </div>
                <div className="absolute size-[216px]">
                    <CircularProgressbarWithChildren strokeWidth="7" value={fat / dailyFat * 100} styles={{
                        path: {
                            stroke: tertiaryColor
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
                <CalorieProgress value={ (calories/dailyCalories) * 100 } progressBarText={ `${calories}/${dailyCalories} kalorier (${Math.round((calories/dailyCalories) * 100)}%)`}/>
                <ChangeUserWeight value={newUserWeight} disabled={weightChanging} onChange={setNewUserWeight} onSubmit={() => {
                    setWeightChanging(true);
                    changeUserWeight(newUserWeight).then(() => setWeightChanging(false))
                }} />
                <CalorieAddRemove value={addRemoveCalories} disabled={caloriesChanging} onChange={setAddRemoveCalories} onSubmit={() => {
                    setCaloriesChanging(true);
                    addOrRemoveCalories(addRemoveCalories).then(() => setCaloriesChanging(false));
                }} />
                <Breadcrumb className="gap-0.5 mt-6">
                    <Breadcrumb.Link className="flex justify-center rounded-lg border border-surface px-2 py-1 text-secondary-foreground hover:text-secondary-foreground">
                        <div className="grid grid-rows-2 grid-cols-[auto_auto] items-center p-2">
                            <div className="w-fit col-span-1 row-span-1">
                                <IconWheat color={firstColor} />
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
                    <Breadcrumb.Link className="flex justify-center rounded-lg border border-surface px-2 py-1 text-secondary-foreground hover:text-secondary-foreground">
                        <div className="grid grid-rows-2 grid-cols-[auto_auto] items-center p-2">
                            <div className="w-fit col-span-1 row-span-1">
                                <IconMeat color={secondaryColor} />
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
                    <Breadcrumb.Link className="flex justify-center rounded-lg border border-surface px-2 py-1 text-secondary-foreground hover:text-secondary-foreground">
                        <div className="grid grid-rows-2 grid-cols-[auto_auto] items-center p-2">
                            <div className="w-fit col-span-1 row-span-1">
                                <IconDroplet color={tertiaryColor} />
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
