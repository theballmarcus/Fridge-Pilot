import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

export default function MainPageProgress() {
    // Render calorie count out of desired daily calorie count
    // Within, render weight loss in kgs out of desired weight loss
    return <>
        <CircularProgressbarWithChildren value={66}>
            <b>Hello world type shi</b>
        </CircularProgressbarWithChildren>
    </>
}
