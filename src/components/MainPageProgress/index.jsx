import React from 'react';
import { CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';

export default function MainPageProgress() {
    // Render calorie count out of desired daily calorie count
    // Within, render weight loss in kgs out of desired weight loss
    return <>
        <div className="relative w-[300px] h-[300px] bg-gray-200 flex items-center justify-center">
            <div className="absolute">
                <CircularProgressbar value={66} strokeWidth="5" styles={{
                    root: {
                        width: '100%',
                        height: '100%'
                    },
                    path:{
                        stroke: `rgb(255 175 36 / 1.0)`
                    }
                }}/>
            </div>
            <div className="absolute">
                <CircularProgressbar value={66} strokeWidth="6" styles={{
                    root: {
                        width: '86%',
                        height: '86%'
                    },
                    path:{
                        stroke: `rgb(48 120 186 / 1.0)`
                    }
                }}/>
            </div>
            <div className="absolute">
                <CircularProgressbarWithChildren strokeWidth="7" value={66} styles={{
                    root: {
                        width: '72%',
                        height: '72%'
                    },
                    path:{
                        stroke: `rgb(248 70 67 / 1.0)`
                    }
                }}>
                    <div>Hello</div>
                </CircularProgressbarWithChildren>
            </div>
        </div>
    </>
}
