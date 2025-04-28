import React from 'react';
import { CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { Typography, Breadcrumb } from "@material-tailwind/react";
import { IconFlame, IconWheat, IconMeat, IconDroplet } from '@tabler/icons-react';
import axios from 'axios';

export default function MainPageProgress() {
    const [calories, setCalories] = React.useState(0);
    const [protein, setProtein] = React.useState(0);
    const [fat, setFat] = React.useState(0);
    const [carbs, setCarbs] = React.useState(0);
    const [dailyCalories, setDailyCalories] = React.useState(0);
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
        }
        fetchData();
    }, []);

    
    // Render calorie count out of desired daily calorie count
    // Within, render weight loss in kgs out of desired weight loss
    return <>
        <div className="flex flex-col items-center justify-center">
            <Typography type="h2">Dagens fremskridt</Typography>
            <hr className="w-full my-6 border-surface"/>
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                <div className="absolute size-[300px]">
                    <CircularProgressbar value={carbs} strokeWidth="5" styles={{
                        path: {
                            stroke: 'rgb(248 70 67 / 1.0)'
                        }
                    }} />
                </div>
                <div className="absolute size-[258px]">
                    <CircularProgressbar value={protein} strokeWidth="6" styles={{
                        path: {
                            stroke: 'rgb(48 120 186 / 1.0)'
                        }
                    }} />
                </div>
                <div className="absolute size-[216px]">
                    <CircularProgressbarWithChildren strokeWidth="7" value={fat} styles={{
                        path: {
                            stroke: 'rgb(255 175 36 / 1.0)'
                        }
                    }}>
                        <div className="flex justify-center items-center">
                            <IconFlame size={50} />
                            <Typography type="h5">{ calories }</Typography><span>/{dailyCalories}</span>
                        </div>
                        <span>Kalorier i dag</span>
                    </CircularProgressbarWithChildren>
                </div>
            </div>
            <div>
                <Breadcrumb className="gap-0.5 mt-10">
                    <Breadcrumb.Link className="flex justify-center rounded-lg border border-surface px-2 py-1 text-secondary-foreground">
                        <div className="grid grid-rows-2 grid-cols-[auto_auto] items-center p-2">
                            <div className="w-fit col-span-1 row-span-1">
                                <IconWheat color={"rgb(248 70 67 / 1.0)"} />
                            </div>
                            <div className="w-fit col-span-1 row-span-1">
                                <Typography type="h6">Kulhydrater</Typography>
                            </div>
                            <div className="w-fit col-span-2 row-span-1">
                                <span className='font-bold'>14</span> / 20g
                            </div>
                        </div>
                    </Breadcrumb.Link>
                    <Breadcrumb.Separator>·</Breadcrumb.Separator>
                    <Breadcrumb.Link className="flex justify-center rounded-lg border border-surface px-2 py-1 text-secondary-foreground">
                        <div className="grid grid-rows-2 grid-cols-[auto_auto] items-center p-2">
                            <div className="w-fit col-span-1 row-span-1">
                                <IconMeat color={"rgb(48 120 186 / 1.0)"} />
                            </div>
                            <div className="w-fit col-span-1 row-span-1">
                                <Typography type="h6">Protein</Typography>
                            </div>
                            <div className="w-fit col-span-2 row-span-1">
                                <span className='font-bold'>80</span> / 95g
                            </div>
                        </div>
                    </Breadcrumb.Link>
                    <Breadcrumb.Separator>·</Breadcrumb.Separator>
                    <Breadcrumb.Link className="flex justify-center rounded-lg border border-surface px-2 py-1 text-secondary-foreground">
                        <div className="grid grid-rows-2 grid-cols-[auto_auto] items-center p-2">
                            <div className="w-fit col-span-1 row-span-1">
                                <IconDroplet color={"rgb(255 175 36 / 1.0)"} />
                            </div>
                            <div className="w-fit col-span-1 row-span-1">
                                <Typography type="h6">Fedt</Typography>
                            </div>
                            <div className="w-fit col-span-2 row-span-1">
                                <span className='font-bold'>67</span> / 120g
                            </div>
                        </div>
                    </Breadcrumb.Link>
                </Breadcrumb>
            </div>
            <div className="w-full mt-6">
                <hr className="border-surface" />
            </div>
        </div>
    </>
}
