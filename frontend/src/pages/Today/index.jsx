import KetoGuidelines from '../../components/KetoGuidelines';
import MainPageProgress from '../../components/MainPageProgress';
import CalorieBuffer from '../../components/CalorieBuffer';

export default function Today() {
    return <>
        <div className="flex flex-row items-start justify-between">
            <div><KetoGuidelines></KetoGuidelines></div>
            <div className="w-max"><MainPageProgress></MainPageProgress></div>
            <div><CalorieBuffer></CalorieBuffer></div>
        </div>
    </>
}
