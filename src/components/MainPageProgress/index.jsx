import React from 'react';
import { CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { Breadcrumb } from "@material-tailwind/react";
import { IconFlame, IconWheat, IconMeat, IconDroplet } from '@tabler/icons-react';

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
                    <div>
                        <IconFlame size={80}/>

                    </div>
                </CircularProgressbarWithChildren>
            </div>
        </div>
        <div className=''>
            <Breadcrumb className="gap-0.5">
                <Breadcrumb.Link className="rounded bg-secondary px-2 py-1 text-secondary-foreground">
                    <IconWheat color={"rgb(255 175 36 / 1.0)"}/>
                    Kulhydrater
                    <br/>
                    <span className='font-bold'>14</span> / 20g
                </Breadcrumb.Link>
                <Breadcrumb.Separator>·</Breadcrumb.Separator>
                <Breadcrumb.Link className="rounded bg-secondary px-2 py-1 text-secondary-foreground">
                    <IconMeat color={"rgb(48 120 186 / 1.0)"}/>
                    Protein
                    <br/>
                    <span className='font-bold'>80</span> / 95g
                </Breadcrumb.Link>
                <Breadcrumb.Separator>·</Breadcrumb.Separator>
                <Breadcrumb.Link className="rounded bg-secondary px-2 py-1 text-secondary-foreground">
                    <div>
                        <IconDroplet color={"rgb(248 70 67 / 1.0)"}/>
                        Fedt
                    </div>
                    <div>
                    <br/>
                    <hr></hr>
                    <span className='font-bold'>67</span> / 120g
                    </div>
                </Breadcrumb.Link>
            </Breadcrumb>
        </div>
    </>
}
