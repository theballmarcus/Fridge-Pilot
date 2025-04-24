import MainPageProgress from '../../components/MainPageProgress';
import KetoGuidelines from '../../components/KetoGuidelines';

export default function HomePage() {
    return (
        <>
            <div className="flex flex-row items-center justify-center h-screen">
                <div className="mx-8"><MainPageProgress></MainPageProgress></div>
                <div><KetoGuidelines></KetoGuidelines></div>
            </div>
        </>
    )
}
