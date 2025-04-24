import { Button } from "@material-tailwind/react";
import MainPageProgress from '../../components/MainPageProgress/index.jsx';

export default function HomePage() {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <MainPageProgress></MainPageProgress>
                <Button color="blue">This a button :)</Button>
            </div>
        </>
    )
}
