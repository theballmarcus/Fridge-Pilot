import { Tabs, Typography } from "@material-tailwind/react";
import MealCardDay from '../../components/MealCardDay';

function getRelativeDateWithFormat(date) {
    const today = new Date();
    const inputDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    const diffInDays = Math.floor((inputDate - today) / (1000 * 60 * 60 * 24));

    const formattedDate = inputDate.toLocaleDateString("da-DK", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    // Determine meal card label
    switch (diffInDays) {
        case 0:
            return `I dag (${formattedDate})`;
        case 1:
            return `I morgen (${formattedDate})`;
        case 2:
            return `I overmorgen (${formattedDate})`;
        default:
            // Fallback date
            return formattedDate;
    }
}

export default function MealPlanPage() {
    const date = Date.now();
    const oneDayMs = 1000 * 60 * 60 * 24;

    return <Tabs defaultValue="today">
        <Tabs.List className="w-full rounded-none border-b border-secondary-dark bg-transparent py-0">
            <Tabs.Trigger className="w-full" value="today">
                I dag
            </Tabs.Trigger>
            <Tabs.Trigger className="w-full" value="tomorrow">
                I morgen
            </Tabs.Trigger>
            <Tabs.Trigger className="w-full" value="dayaftertomorrow">
                I overmorgen
            </Tabs.Trigger>
            <Tabs.TriggerIndicator className="rounded-none border-b-2 border-primary bg-transparent shadow-none" />
        </Tabs.List>
        <Tabs.Panel value="today">
            <Typography type="h3">{getRelativeDateWithFormat(date)}</Typography>
            <hr className="my-4 border-surface" />
            <MealCardDay date={date}></MealCardDay>
        </Tabs.Panel>
        <Tabs.Panel value="tomorrow">
            <Typography type="h3">{getRelativeDateWithFormat(date + oneDayMs * 1)}</Typography>
            <hr className="my-4 border-surface" />
            <MealCardDay date={date + oneDayMs * 1}></MealCardDay>
        </Tabs.Panel>
        <Tabs.Panel value="dayaftertomorrow">
            <Typography type="h3">{getRelativeDateWithFormat(date + oneDayMs * 2)}</Typography>
            <hr className="my-4 border-surface"/>
            <MealCardDay date={date + oneDayMs * 2}></MealCardDay>
        </Tabs.Panel>
    </Tabs>;
}
