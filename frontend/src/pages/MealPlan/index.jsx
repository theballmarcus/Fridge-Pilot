import React from 'react';
import MealCardDay from '../../components/MealCardDay';

export default function MealPlanPage() {
    const date = Date.now();
    const oneDayMs = 1000 * 60 * 60 * 24;
    
    return <>
        <MealCardDay date={date}></MealCardDay>
        <MealCardDay date={date+oneDayMs}></MealCardDay>
        <MealCardDay date={date+oneDayMs*2}></MealCardDay>

    </>
}
