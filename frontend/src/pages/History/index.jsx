import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Card, Typography } from '@material-tailwind/react';
import { IconShoppingCart, IconWeight, IconChartPie, IconFlame } from '@tabler/icons-react';
import axios from 'axios';
import { useThemeColors } from '../../hooks/useThemeColors.jsx';
import { useAuth } from '../../context/AuthProvider/index.jsx';

function LineChartCard({ title, description, data, categories, unit, children: icon }) {
    const { firstColor: chartColor } = useThemeColors();

    const chartConfig = {
        type: 'line',
        height: 240,
        series: [
            {
                name: title,
                data: data,
            },
        ],
        options: {
            chart: {
                toolbar: {
                    show: false,
                },
            },
            title: {
                show: '',
            },
            dataLabels: {
                enabled: false,
            },
            colors: [chartColor],
            stroke: {
                curve: 'smooth',
                lineCap: 'round',
            },
            markers: {
                size: 0,
            },
            xaxis: {
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                tickAmount: 10, // Show only 5 labels
                labels: {
                    style: {
                        fontSize: '12px',
                        fontFamily: 'inherit',
                        fontWeight: 400,
                    },
                },
                categories: categories,
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: '12px',
                        fontFamily: 'inherit',
                        fontWeight: 400,
                    },
                    formatter: function (value) {
                        return value + unit;
                    },
                },
            },
            grid: {
                show: true,
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 5,
                    right: 20,
                },
            },
            fill: {
                opacity: 0.8,
            },
            tooltip: {
                theme: 'light',
                y: {
                    formatter: function (value) {
                        return value + unit;
                    },
                },
            },
        },
    };

    return (
        <Card className="mb-6">
            <Card.Header className="m-0 flex flex-wrap items-center gap-4 p-4">
                <Card
                    color="primary"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-primary-foreground md:h-12 md:w-12"
                >
                    {icon}
                </Card>
                <div>
                    <Typography type="h6">{title}</Typography>
                    <Typography className="mt-1 max-w-sm text-foreground">
                        {description}
                    </Typography>
                </div>
            </Card.Header>
            <Card.Body>
                <Chart {...chartConfig} />
            </Card.Body>
        </Card>
    );
}

function NutritionPieChart() {
    const { getToken } = useAuth();
    const [nutritionalValues, setNutritionalValues] = useState([0, 0,0 ]);

    useEffect(() => {
        const token = getToken();
        if(!token) return;
        const date = Date.now();
        axios.get(`http://localhost:8080/api/diet/stats/${date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                if (response.status !== 200) throw new Error('Error fetching diet in nutritional pie chart');
                console.log('Diet stats response: ', response);

                const { total_carbs, total_protein, total_fat } = response.data.stats;
                setNutritionalValues([total_carbs, total_protein, total_fat]);
            })
    }, [])

    const { firstColor: carbohydrateColor, secondaryColor: proteinColor, tertiaryColor: fatColor } = useThemeColors();

    const chartConfig = {
        type: 'pie',
        height: 240,
        width: '100%',
        series: nutritionalValues,
        options: {
            responsive: [
                {
                    breakpoint: 600,
                    options: {
                        chart: {
                            width: '100%',
                        },
                    },
                },
            ],
            chart: {
                toolbar: {
                    show: false,
                },
            },
            title: {
                show: '',
            },
            dataLabels: {
                enabled: true,
                formatter: function (val, opts) {
                    return opts.w.config.series[opts.seriesIndex] + 'g';
                },
            },
            legend: {
                position: 'bottom',
            },
            labels: ['Kulhydrat', 'Protein', 'Fedt'],
            colors: [carbohydrateColor, proteinColor, fatColor]
        },
    };

    return (
        <Card>
            <Card.Header className="m-0 flex flex-wrap items-center gap-4 p-4">
                <Card
                    color="primary"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-primary-foreground md:h-12 md:w-12"
                >
                    <IconChartPie className="h-6 w-6 md:h-8 md:w-8" />
                </Card>
                <div>
                    <Typography type="h6">Fordeling af makroer</Typography>
                    <Typography className="mt-1 max-w-sm text-foreground">
                        Fordeling af dit daglige fedt-, protein- og kulhydratindtag
                    </Typography>
                </div>
            </Card.Header>
            <Card.Body className="grid place-items-center">
                <Chart key={JSON.stringify(chartConfig)} {...chartConfig} />
            </Card.Body>
        </Card>
    );
}

export default function History() {
    const { getToken } = useAuth();
    const [weightTimes, setWeightTimes] = useState([]);
    const [weightData, setWeightData] = useState([]);
    const [priceTimes, setPriceTimes] = useState([]);
    const [priceData, setPriceData] = useState([]);
    const [caloriesTimes, setCaloriesTimes] = useState([]);
    const [caloriesData, setCaloriesData] = useState([]);

    // Get advancements:
    // Weigh-ins, daily prices, daily calorie intake
    useEffect(() => {
        const token = getToken();
        if(!token) return;
        axios.get('http://localhost:8080/api/advancements', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            console.log('Response:', response.data);
            const _weightTimes = [];
            const _weightData = [];
            const _priceTimes = [];
            const _priceData = [];
            const _caloriesTimes = [];
            const _caloriesData = [];

            // Sort the arrays by date
            response.data.advancements.weightHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
            response.data.advancements.prices.sort((a, b) => new Date(a.date) - new Date(b.date));
            response.data.advancements.calories.sort((a, b) => new Date(a.date) - new Date(b.date));

            for (const weighIn of response.data.advancements.weightHistory) {
                _weightTimes.push(new Date(weighIn.date).toLocaleDateString('da-DK'));
                _weightData.push(weighIn.weight);
            }
            for (const price of response.data.advancements.prices) {
                _priceTimes.push(new Date(price.date).toLocaleDateString('da-DK'));
                _priceData.push(price.price);
            }
            for (const calories of response.data.advancements.calories) {
                _caloriesTimes.push(new Date(calories.date).toLocaleDateString('da-DK'));
                _caloriesData.push(calories.calories);
            }

            setWeightTimes(_weightTimes);
            setWeightData(_weightData);
            setPriceTimes(_priceTimes);
            setPriceData(_priceData);
            setCaloriesTimes(_caloriesTimes);
            setCaloriesData(_caloriesData);
        }).catch(error => {
            console.error('Error:', error);
        });
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-6">
                <LineChartCard
                    title="Vægtudvikling"
                    description="Følg dine vægtændringer over tid"
                    data={weightData}
                    categories={weightTimes}
                    unit="kg"
                ><IconWeight /></LineChartCard>

                <LineChartCard
                    title="Daglig kalorieindtag"
                    description="Kalorier indtaget hver dag"
                    data={caloriesData}
                    categories={caloriesTimes}
                    unit=" kalorier"
                ><IconFlame /></LineChartCard>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
                <LineChartCard
                    title="Daglig udgift"
                    description="Penge brugt på mad hver dag"
                    data={priceData}
                    categories={priceTimes}
                    unit="DKK"
                ><IconShoppingCart /></LineChartCard>

                <NutritionPieChart />
            </div>
        </div>
    );
}
