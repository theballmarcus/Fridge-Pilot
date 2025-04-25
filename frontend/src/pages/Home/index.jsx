import MainPageProgress from '../../components/MainPageProgress';
import KetoGuidelines from '../../components/KetoGuidelines';
import { Tabs } from "@material-tailwind/react";
import { IconActivityHeartbeat } from '@tabler/icons-react';
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
        HISTORY: 'history'
    };

    const page = window.location.hash.replace('#', '');
    const defaultValue = Object.values(pages)
        .find(pageId => pageId === page)
        ?? pages.DAILY_PROGRESS;

    return (
        <>
            <Tabs defaultValue={defaultValue} className='mt-6'>
                <Tabs.List className="w-full">
                    <NavigationButton href={'#' + pages.DAILY_PROGRESS} className="w-full" value={pages.DAILY_PROGRESS}>
                        Dagens fremskridt
                    </NavigationButton>
                    <NavigationButton href={'#' + pages.MEAL_PLAN} className="w-full" value={pages.MEAL_PLAN}>
                        Måltidsplan
                    </NavigationButton>
                    <NavigationButton href={'#' + pages.HISTORY} className="w-full" value={pages.HISTORY}>
                        <IconActivityHeartbeat></IconActivityHeartbeat>
                        Historisk data
                    </NavigationButton>
                    <Tabs.TriggerIndicator />
                </Tabs.List>
                <Tabs.Panel value={pages.DAILY_PROGRESS}>
                    <div className="flex flex-row items-center justify-center h-screen">
                        <div className="mx-8"><MainPageProgress></MainPageProgress></div>
                        <div><KetoGuidelines></KetoGuidelines></div>
                    </div>
                </Tabs.Panel>
                <Tabs.Panel value={pages.MEAL_PLAN}>
                    Because it&apos;s about motivating the doers. Because I&apos;m here to
                    follow my dreams and inspire other people to follow their dreams, too.
                </Tabs.Panel>
                <Tabs.Panel value={pages.HISTORY}>
                    We&apos;re not always in the position that we want to be at. We&apos;re
                    constantly growing. We&apos;re constantly making mistakes. We&apos;re
                    constantly trying to express ourselves and actualize our dreams.
                </Tabs.Panel>
            </Tabs>
        </>
    )
}
