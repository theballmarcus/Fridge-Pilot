import * as React from "react";
import Chart from 'react-apexcharts';
import { Card, Typography } from "@material-tailwind/react";
import { useTheme } from "next-themes";
import { IconCurrencyKroneDanish, IconWeight, IconChartPie } from "@tabler/icons-react";

function rgbToHex(rgb) {
    return (
        "#" +
        rgb
            .map((x) => {
                const hex = parseInt(x, 10).toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            })
            .join("")
    );
}

function LineChartCard({ title, description, data, categories, unit, children }) {
    const { theme } = useTheme();
    const [vars, setVars] = React.useState(null);

    React.useEffect(() => {
        const cssVarValue = window.getComputedStyle(document.documentElement);
        setVars(cssVarValue);
    }, [theme]);

    const chartColor = vars
        ? rgbToHex(vars.getPropertyValue("--color-primary").split(" "))
        : "";
    const textColor = vars
        ? rgbToHex(vars.getPropertyValue("--color-foreground").split(" "))
        : "";
    const lineColor = vars
        ? rgbToHex(vars.getPropertyValue("--color-surface").split(" "))
        : "";

    const chartConfig = {
        type: "line",
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
                show: "",
            },
            dataLabels: {
                enabled: false,
            },
            colors: [chartColor],
            stroke: {
                curve: "smooth",
                lineCap: "round",
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
                labels: {
                    style: {
                        colors: textColor,
                        fontSize: "12px",
                        fontFamily: "inherit",
                        fontWeight: 400,
                    },
                },
                categories: categories,
            },
            yaxis: {
                labels: {
                    style: {
                        colors: textColor,
                        fontSize: "12px",
                        fontFamily: "inherit",
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
                theme: theme === "dark" ? "dark" : "light",
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
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-md text-primary-foreground md:h-20 md:w-20"
                >
                    {children}
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
    const { theme } = useTheme();
    const [colors, setColors] = React.useState(["#3B82F6", "#06B6D4", "#10B981"]); // Default colors (blue, cyan, emerald)

    React.useEffect(() => {
        // Get computed styles after component mounts to ensure CSS variables are available
        const cssVarValue = window.getComputedStyle(document.documentElement);

        const colorPrimary = rgbToHex(cssVarValue.getPropertyValue("--color-primary").split(" ")) || "#3B82F6";
        const colorInfo = rgbToHex(cssVarValue.getPropertyValue("--color-info").split(" ")) || "#06B6D4";
        const colorSuccess = rgbToHex(cssVarValue.getPropertyValue("--color-success").split(" ")) || "#10B981";

        setColors([colorPrimary, colorInfo, colorSuccess]);
    }, [theme]);

    const chartConfig = {
        type: "pie",
        height: 240,
        width: "100%",
        series: [65, 25, 10],
        options: {
            responsive: [
                {
                    breakpoint: 600,
                    options: {
                        chart: {
                            width: "100%",
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
                show: "",
            },
            dataLabels: {
                enabled: true,
                formatter: function (val, opts) {
                    return opts.w.config.series[opts.seriesIndex] + "g";
                },
            },
            legend: {
                position: "bottom",
            },
            labels: ["Kulhydrat", "Fedt", "Protein"],
            colors: colors
        },
    };

    return (
        <Card>
            <Card.Header className="m-0 flex flex-wrap items-center gap-4 p-4">
                <Card
                    color="primary"
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-md text-primary-foreground md:h-20 md:w-20"
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
                {colors.length > 0 && <Chart {...chartConfig} />}
            </Card.Body>
        </Card>
    );
}

export default function History() {
    // Sample data - replace with actual data from your application
    const dates = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul"];

    const weightData = [160, 158, 156, 154, 153, 152, 151];
    const spendingData = [12, 15, 20, 18, 22, 25, 17];

    return (
        <div className="flex flex-col gap-6">
            <LineChartCard
                title="Vægtudvikling"
                description="Følg dine vægtændringer over tid"
                data={weightData}
                categories={dates}
                unit="kg"
            ><IconWeight /></LineChartCard>
            <LineChartCard
                title="Daglig udgift"
                description="Penge brugt på mad hver dag"
                data={spendingData}
                categories={dates}
                unit="DKK"
            ><IconCurrencyKroneDanish /></LineChartCard>
            <NutritionPieChart />
        </div>
    );
}
