import React from 'react';
import { CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';

export default function MainPageProgress() {
    // Render calorie count out of desired daily calorie count
    // Within, render weight loss in kgs out of desired weight loss
    return <>
        <div className="relative w-[300px] h-[300px] bg-gray-200 flex items-center justify-center">
            <div className="absolute">
                <CircularProgressbar value={66} styles={{
                    root: {
                        width: '100%',
                        height: '100%'
                    }
                }}/>
            </div>
            <div className="absolute">
                <CircularProgressbar value={66} styles={{
                    root: {
                        width: '80%',
                        height: '80%'
                    }
                }}/>
            </div>
            <div className="absolute">
                <CircularProgressbarWithChildren value={66} styles={{
                    root: {
                        width: '60%',
                        height: '60%'
                    }
                }}>
                    <div>Hello</div>
                </CircularProgressbarWithChildren>
            </div>
        </div>
    </>
}
