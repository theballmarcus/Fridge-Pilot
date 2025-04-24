import React from 'react';
import { CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { Typography, Progress, Breadcrumb } from "@material-tailwind/react";
import { IconFlame, IconWheat, IconMeat, IconDroplet } from '@tabler/icons-react';

export default function MainPageProgress() {
    // Render calorie count out of desired daily calorie count
    // Within, render weight loss in kgs out of desired weight loss
    return <>
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
            <div className="absolute size-[300px]">
                <CircularProgressbar value={Math.random()*100} strokeWidth="5" styles={{
                    path: {
                        stroke: `rgb(255 175 36 / 1.0)`
                    }
                }} />
            </div>
            <div className="absolute size-[258px]">
                <CircularProgressbar value={Math.random()*100} strokeWidth="6" styles={{
                    path: {
                        stroke: `rgb(48 120 186 / 1.0)`
                    }
                }} />
            </div>
            <div className="absolute size-[216px]">
                <CircularProgressbarWithChildren strokeWidth="7" value={Math.random()*100} styles={{
                    path: {
                        stroke: `rgb(248 70 67 / 1.0)`
                    }
                }}>
                    <div className="flex justify-center items-center">
                        <IconFlame size={50} />
                        <Typography type="h5">953</Typography><span>/1200</span>
                    </div>
                    <span>Kalorier i dag</span>
                </CircularProgressbarWithChildren>
            </div>
        </div>
        <div>
            <Breadcrumb className="gap-0.5 mt-10">
                <Breadcrumb.Link className="rounded bg-secondary px-2 py-1 text-secondary-foreground">
                    <div className="grid grid-rows-2 grid-cols-[auto_auto] items-center">
                        <div className="w-fit col-span-1 row-span-1">
                            <IconWheat color={"rgb(255 175 36 / 1.0)"} />
                        </div>
                        <div className="w-fit col-span-1 row-span-1">
                            <Typography type="h6">Kulhydrater</Typography>
                        </div>
                        <div className="w-fit col-span-2 row-span-1">
                            <span className='font-bold'>14</span> / 20g
                        </div>
                    </div>
                </Breadcrumb.Link>
                <Breadcrumb.Separator>·</Breadcrumb.Separator>
                <Breadcrumb.Link className="rounded bg-secondary px-2 py-1 text-secondary-foreground">
                    <div className="grid grid-rows-2 grid-cols-[auto_auto] items-center">
                        <div className="w-fit col-span-1 row-span-1">
                            <IconMeat color={"rgb(48 120 186 / 1.0)"} />
                        </div>
                        <div className="w-fit col-span-1 row-span-1">
                            <Typography type="h6">Protein</Typography>
                        </div>
                        <div className="w-fit col-span-2 row-span-1">
                            <span className='font-bold'>80</span> / 95g
                        </div>
                    </div>
                </Breadcrumb.Link>
                <Breadcrumb.Separator>·</Breadcrumb.Separator>
                <Breadcrumb.Link className="rounded bg-secondary px-2 py-1 text-secondary-foreground">
                    <div className="grid grid-rows-2 grid-cols-[auto_auto] items-center">
                        <div className="w-fit col-span-1 row-span-1">
                            <IconDroplet color={"rgb(248 70 67 / 1.0)"} />
                        </div>
                        <div className="w-fit col-span-1 row-span-1">
                            <Typography type="h6">Fedt</Typography>
                        </div>
                        <div className="w-fit col-span-2 row-span-1">
                            <span className='font-bold'>67</span> / 120g
                        </div>
                    </div>
                </Breadcrumb.Link>
            </Breadcrumb>
        </div>
        <div className="w-[500px]">
            <hr className="my-4 my-4 border-gray-400"/>
            <Typography type="h3" className="mb-6">Mit fremskridt</Typography>
            <Progress size="lg" value={9/30*100}>
                <Progress.Bar className="grid place-items-center">
                    <Typography type="small" color="secondary">
                        <b>9</b> / 30 kg tabt
                    </Typography>
                </Progress.Bar>
            </Progress>
        </div>
    </>
}
