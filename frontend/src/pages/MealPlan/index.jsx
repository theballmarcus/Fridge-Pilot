import React from 'react';
import MealCard from '../../components/MealCard';

export default function MealPlanPage() {
    const date = Date.now();
    const oneDayMs = 100*60*60*24;
    
    return <>
        <MealCard date={date}></MealCard>
        <MealCard date={date+oneDayMs}></MealCard>
        <MealCard date={date+oneDayMs*2}></MealCard>

    </>
}
