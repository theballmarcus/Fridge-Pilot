import KetoGuidelines from '../../components/KetoGuidelines';
import MainPageProgress from '../../components/MainPageProgress';
import CalorieBuffer from '../../components/CalorieBuffer';

export default function Today() {
    return <>
        <div className="flex flex-row items-start justify-between">
            <div><KetoGuidelines /></div>
            <div className="w-max"><MainPageProgress /></div>
            <div><CalorieBuffer  /></div>
        </div>
    </>
}
