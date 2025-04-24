import { Button } from "@material-tailwind/react";
import MainPageProgress from './components/MainPageProgress/index.jsx';

export default function FrontPage() {
  return (
    <>
      <MainPageProgress></MainPageProgress>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Button color="blue">This a button :)</Button>
      </div>
    </>
  )
}
