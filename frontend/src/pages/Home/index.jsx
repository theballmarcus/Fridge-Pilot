import Today from '../Today';
import History from '../History';
import { Tabs } from "@material-tailwind/react";
import { IconProgressCheck, IconCalendarWeek, IconFridge, IconActivityHeartbeat } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

function NavigationButton({ href, ...props }) {
    const navigate = useNavigate();

    const handleClick = (e) => {
        if (props.onClick) {
            props.onClick(e);
        }
        navigate(href);
    };

    return <Tabs.Trigger {...props} onClick={handleClick} />;
}

export default function HomePage() {
    const pages = {
        DAILY_PROGRESS: 'dailyprogress',
        MEAL_PLAN: 'mealplan',
        FRIDGE: 'fridge',
        HISTORY: 'history'
    };

    const page = window.location.hash.replace('#', '');
    const defaultValue = Object.values(pages)
        .find(pageId => pageId === page)
        ?? pages.DAILY_PROGRESS;

    return (
        <>
            <main className="grow">
                <Tabs defaultValue={defaultValue} className='mt-6'>
                    <Tabs.List className="w-full" id="header">
                        <NavigationButton href={'#' + pages.DAILY_PROGRESS} className="w-full" value={pages.DAILY_PROGRESS}>
                            <IconProgressCheck></IconProgressCheck>
                            Dagens fremskridt
                        </NavigationButton>
                        <NavigationButton href={'#' + pages.MEAL_PLAN} className="w-full" value={pages.MEAL_PLAN}>
                            <IconCalendarWeek></IconCalendarWeek>
                            Måltidsplan
                        </NavigationButton>
                        <NavigationButton href={'#' + pages.FRIDGE} className="w-full" value={pages.FRIDGE}>
                            <IconFridge></IconFridge>
                            Mit køleskab
                        </NavigationButton>
                        <NavigationButton href={'#' + pages.HISTORY} className="w-full" value={pages.HISTORY}>
                            <IconActivityHeartbeat></IconActivityHeartbeat>
                            Historik
                        </NavigationButton>
                        <Tabs.TriggerIndicator />
                    </Tabs.List>
                    <Tabs.Panel value={pages.DAILY_PROGRESS}>
                        <Today/>
                    </Tabs.Panel>
                    <Tabs.Panel value={pages.MEAL_PLAN}>
                        Her kan du se de næste dages madplan
                    </Tabs.Panel>
                    <Tabs.Panel value={pages.FRIDGE}>
                        Her kan du føje ting til dit digitale køleskab
                    </Tabs.Panel>
                    <Tabs.Panel value={pages.HISTORY}>
                        <History/>
                    </Tabs.Panel>
                </Tabs>
            </main>
        </>
    )
}
