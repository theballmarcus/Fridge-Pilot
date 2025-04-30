import { Input, Typography, IconButton, Button } from "@material-tailwind/react";
import { IconPlus, IconMinus } from '@tabler/icons-react';

export default function ChangeUserWeight({ value, disabled, onChange, onSubmit }) {
    const maxWeight = 300; // kg
    const minWeight = 0; // kg

    if (typeof value !== 'number') throw new Error('User weight is unset in ChangeUserWeight component');

    const handleCalorieChange = (newValue) => {
        const clampedValue = Math.min(Math.max(newValue, minWeight), maxWeight);
        const floatFixedValue = Math.round(clampedValue * 10) / 10
        onChange(floatFixedValue);
    };

    return (
        <div className="items-center w-[500px] flex flex-row justify-between mt-4 mx-auto">
            <Typography type="span" className="text-foreground">Log din daglige vægt</Typography>
            <div className="flex flex-row">
                <div className="relative w-[150px]">
                    <Input
                        type="number"
                        value={value}
                        disabled={disabled}
                        onChange={(e) => handleCalorieChange(Number(e.target.value))}
                        min={minWeight}
                        max={maxWeight}
                        className="border-gray-300 text-gray-700 placeholder:text-primary placeholder:opacity-100 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Typography className='absolute right-14 top-3 h-5 w-5 text-gray-700 text-xs'>kg</Typography>
                    <div className="absolute right-1 top-1 flex gap-0.5">
                        <IconButton
                            size="s"
                            variant="ghost"
                            className="rounded"
                            onClick={() => handleCalorieChange(value - 0.1)}
                            disabled={value <= minWeight || disabled}
                        >
                            <IconMinus />
                        </IconButton>
                        <IconButton
                            size="s"
                            variant="ghost"
                            className="rounded"
                            onClick={() => handleCalorieChange(value + 0.1)}
                            disabled={value >= maxWeight || disabled}
                        >
                            <IconPlus />
                        </IconButton>
                    </div>
                </div>
                <Button className="ml-2 cursor-pointer" disabled={value === 0 || disabled} variant="outline" onClick={() => onSubmit(value)}>Sæt ny vægt</Button>
            </div>
        </div>
    );
}
