import { Input, Typography, IconButton, Button } from "@material-tailwind/react";
import { IconPlus, IconMinus } from '@tabler/icons-react';

export default function CalorieAddRemove({ value, disabled, onChange, onSubmit }) {
    const maxCalorie = 2 ** 31; // kcal
    const minCalorie = -(2 ** 31); // kcal
    const isValueSet = value !== null;
    value ??= 0;

    const handleCalorieChange = (newValue) => {
        const clampedValue = Math.min(Math.max(newValue, minCalorie), maxCalorie);
        onChange(clampedValue);
    };

    return (
        <div className="items-center w-[500px] flex flex-row justify-between mt-2 mx-auto">
            <Typography type="span" className="text-foreground">Tilføj/fjern kalorier udenfor kosten</Typography>
            <div className="flex flex-row">
                <div className="relative w-[150px]">
                    <Input
                        type="number"
                        value={isValueSet ? value : ''}
                        disabled={disabled}
                        onChange={(e) => handleCalorieChange(Number(e.target.value))}
                        min={minCalorie}
                        max={maxCalorie}
                        className="border-gray-300 text-gray-700 placeholder:text-primary placeholder:opacity-100 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Typography className='absolute right-16 top-3 h-5 w-5 text-gray-700 text-xs'>kcal</Typography>
                    <div className="absolute right-1 top-1 flex gap-0.5">
                        <IconButton
                            size="s"
                            variant="ghost"
                            className="rounded"
                            onClick={() => handleCalorieChange(value - 10)}
                            disabled={value <= minCalorie || disabled}
                        >
                            <IconMinus />
                        </IconButton>
                        <IconButton
                            size="s"
                            variant="ghost"
                            className="rounded"
                            onClick={() => handleCalorieChange(value + 10)}
                            disabled={value >= maxCalorie || disabled}
                        >
                            <IconPlus />
                        </IconButton>
                    </div>
                </div>
                <Button className="ml-2 cursor-pointer" disabled={value === 0 || disabled} variant="outline" onClick={() => onSubmit(value)}>{value < 0 ? 'Fjern kcal' : 'Tilføj kcal'}</Button>
            </div>
        </div>
    );
}
