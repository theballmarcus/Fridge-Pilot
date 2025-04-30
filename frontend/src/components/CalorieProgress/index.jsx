import { Progress, Typography } from '@material-tailwind/react';

export default function CalorieProgress({ value, progressBarText, overMax }) {
    return <Progress value={value} size="lg" color={overMax ? 'error' : 'secondary'} className="mt-6 w-[460px]">
        <Progress.Bar className="grid place-items-center">
            <Typography type="small" className={`w-max text-foreground mx-2 ${overMax ? 'font-bold text-gray-950' : 'font-normal'}`}>
                {progressBarText}
            </Typography>
        </Progress.Bar>
    </Progress>
}
