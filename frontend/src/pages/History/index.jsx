import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Card, Typography } from '@material-tailwind/react';
import { IconShoppingCart, IconWeight, IconChartPie } from '@tabler/icons-react';
import axios from 'axios';
import { useThemeColors } from '../../hooks/useThemeColors.jsx';
import { getToken } from '../../utils/Session.jsx';

function LineChartCard({ title, description, data, categories, unit, children: icon }) {
    const { firstColor: chartColor, secondaryColor: textColor, tertiaryColor: lineColor } = useThemeColors();

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
                        colors: textColor,
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
                        colors: textColor,
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
                borderColor: lineColor,
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
    const { firstColor: carbohydrateColor, secondaryColor: proteinColor, tertiaryColor: fatColor } = useThemeColors();

    const chartConfig = {
        type: 'pie',
        height: 240,
        width: '100%',
        series: [65, 25, 10],
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
                <Chart {...chartConfig} />
            </Card.Body>
        </Card>
    );
}

export default function History() {
    const [weightTimes, setWeightTimes] = useState([]);
    const [weightData, setWeightData] = useState([]);

    useEffect(() => {
        const token = getToken();

        axios.get('http://localhost:8080/api/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            const _weightTimes = [];
            const _weightData = [];
            for (const weighIn of response.data.weightHistory) {
                _weightTimes.push(new Date(weighIn.date).toLocaleDateString('da-DK'));
                _weightData.push(weighIn.weight);
            }
            setWeightTimes(_weightTimes);
            setWeightData(_weightData);
        }).catch(error => {
            console.error('Error:', error);
        });
    }, []);
    const dates = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul"];
    const spendingData = [12, 15, 20, 18, 22, 25, 17];

    return (
        <div className="flex flex-col gap-6">
            <LineChartCard
                title="Vægtudvikling"
                description="Følg dine vægtændringer over tid"
                data={weightData}
                categories={weightTimes}
                unit="kg"
            ><IconWeight /></LineChartCard>
            <LineChartCard
                title="Daglig udgift"
                description="Penge brugt på mad hver dag"
                data={spendingData}
                categories={dates}
                unit="DKK"
            ><IconShoppingCart /></LineChartCard>
            <NutritionPieChart />
        </div>
    );
}
