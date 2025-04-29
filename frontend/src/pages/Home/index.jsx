import Today from '../Today';
import MealPlan from '../MealPlan';
import History from '../History';
import { Tabs } from '@material-tailwind/react';
import { IconProgressCheck, IconCalendarWeek, IconFridge, IconActivityHeartbeat } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationButton = ({ href, children, ...props }) => {
    const navigate = useNavigate();

    const handleClick = (e) => {
        props.onClick?.(e);
        navigate(href);
    };

    return (
        <Tabs.Trigger {...props} onClick={handleClick} className="w-full">
            {children}
        </Tabs.Trigger>
    );
};

const PAGES = {
    DAILY_PROGRESS: {
        id: 'dailyprogress',
        icon: <IconProgressCheck />,
        label: 'Dagens fremskridt',
        content: <Today />
    },
    MEAL_PLAN: {
        id: 'mealplan',
        icon: <IconCalendarWeek />,
        label: 'Måltidsplan',
        content: <MealPlan/>
    },
    FRIDGE: {
        id: 'fridge',
        icon: <IconFridge />,
        label: 'Mit køleskab',
        content: 'Her kan du føje ting til dit digitale køleskab'
    },
    HISTORY: {
        id: 'history',
        icon: <IconActivityHeartbeat />,
        label: 'Historik',
        content: <History />
    }
};

export default function HomePage() {
    const { hash } = useLocation();

    const currentPage = hash.replace('#', '');
    const defaultValue = Object.values(PAGES).find(page => page.id === currentPage)?.id
        || PAGES.DAILY_PROGRESS.id;

    return (
        <main className="grow">
            <Tabs defaultValue={defaultValue} className="mt-6">
                <Tabs.List className="w-full" id="header">
                    {Object.values(PAGES).map(({ id, icon, label }) => (
                        <NavigationButton
                            key={id}
                            href={`#${id}`}
                            value={id}
                        >
                            {icon}
                            {label}
                        </NavigationButton>
                    ))}
                    <Tabs.TriggerIndicator />
                </Tabs.List>

                {Object.values(PAGES).map(({ id, content }) => (
                    <Tabs.Panel key={id} value={id}>
                        {content}
                    </Tabs.Panel>
                ))}
            </Tabs>
        </main>
    );
}
