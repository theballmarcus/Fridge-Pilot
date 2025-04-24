import { Typography } from "@material-tailwind/react";

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
];

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="flex w-full flex-row flex-wrap items-center justify-center gap-x-12 gap-y-3 text-center md:justify-between">
        <img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/ct-assets/logo.png" alt="brand" className="w-8" />
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {LINKS.map(({ title, href }, key) => (
            <li key={key}>
              <Typography as="a" href={href} className="hover:text-primary">
                {title}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
      <hr className="my-4 border-surface" />
      <Typography className="text-center">
        &copy; {YEAR} FridgePilot
      </Typography>
    </footer>
  );
}
