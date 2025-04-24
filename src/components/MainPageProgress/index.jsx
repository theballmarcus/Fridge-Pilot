import React from 'react';
import { CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { Breadcrumb } from "@material-tailwind/react";

export default function MainPageProgress() {
    // Render calorie count out of desired daily calorie count
    // Within, render weight loss in kgs out of desired weight loss
    return <>
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
            <div className="absolute size-[300px]">
                <CircularProgressbar value={66} strokeWidth="5" styles={{
                    path: {
                        stroke: `rgb(255 175 36 / 1.0)`
                    }
                }} />
            </div>
            <div className="absolute size-[258px]">
                <CircularProgressbar value={66} strokeWidth="6" styles={{
                    path: {
                        stroke: `rgb(48 120 186 / 1.0)`
                    }
                }} />
            </div>
            <div className="absolute size-[216px]">
                <CircularProgressbarWithChildren strokeWidth="7" value={66} styles={{
                    path: {
                        stroke: `rgb(248 70 67 / 1.0)`
                    }
                }}>
                    <div>Hello</div>
                </CircularProgressbarWithChildren>
            </div>
        </div>
        <div className=''>
            <Breadcrumb className="gap-0.5">
                <Breadcrumb.Link
                    href="#"
                    className="rounded bg-secondary px-2 py-1 text-secondary-foreground"
                >
                    Kulhydrater
                </Breadcrumb.Link>
                <Breadcrumb.Separator>·</Breadcrumb.Separator>
                <Breadcrumb.Link
                    href="#"
                    className="rounded bg-secondary px-2 py-1 text-secondary-foreground"
                >
                    Protein
                </Breadcrumb.Link>
                <Breadcrumb.Separator>·</Breadcrumb.Separator>
                <Breadcrumb.Link
                    href="#"
                    className="rounded bg-secondary px-2 py-1 text-secondary-foreground"
                >
                    Fedt
                </Breadcrumb.Link>
            </Breadcrumb>
        </div>
    </>
}
