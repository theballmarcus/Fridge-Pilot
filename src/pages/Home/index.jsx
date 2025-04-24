import { Button } from "@material-tailwind/react";
import MainPageProgress from '../../components/MainPageProgress/index.jsx';

export default function HomePage() {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <MainPageProgress></MainPageProgress>
                <Button color="blue">This is a button :)</Button>
            </div>
        </>
    )
}
