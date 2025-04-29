import { Progress, Typography } from '@material-tailwind/react';

export default function CalorieProgress({ value, progressBarText }) {

    return <Progress value={value} size="lg" color="secondary" className="mt-6 w-[460px]">
        <Progress.Bar className="grid place-items-center">
            <Typography type="small" className="w-max text-foreground mx-2">
                {progressBarText}
            </Typography>
        </Progress.Bar>
    </Progress>
}
