import { Typography } from "@material-tailwind/react";
import icon from '../../assets/icon-flat.png';

const YEAR = new Date().getFullYear();

const LINKS = [
    {
        title: "Om os",
        href: "#",
    },
    {
        title: "Kontakt os",
        href: "#",
    },
    (localStorage.getItem('token') !== null ? {
        title: "Log ud",
        href: "",
        onClick: () => {
            localStorage.clear();
            document.location.pathname = '/';
        }
    } : {})
];

export default function Footer() {
    return (
        <footer className="w-full flex justify-center items-center p-4">
            <div>
                <img src={icon} alt="brand" className="w-16 mr-8" />
            </div>
            <div className="w-full">
                <div className="flex w-full flex-row flex-wrap items-center justify-end gap-x-12 gap-y-3 text-center">
                    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        {LINKS.map(({ title, href, onClick }, key) => (
                            <li key={key}>
                                <Typography as="a" href={href || ''} onClick={onClick || (() => {})} className="text-foreground hover:text-primary">
                                    {title}
                                </Typography>
                            </li>
                        ))}
                    </ul>
                </div>
                <hr className="my-4 border-surface"/>
                <Typography className="text-center text-foreground">
                    &copy; {YEAR} FridgePilot co. FridgePilot og FridgePilot-logoet er blandt vores registrerede og uregistrerede varemærker i Danmark og andre lande.
                </Typography>
            </div>
            <div className="w-16 ml-8"></div>
        </footer>
    );
}
