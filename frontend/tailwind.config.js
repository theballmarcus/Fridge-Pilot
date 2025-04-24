import { mtConfig } from "@material-tailwind/react";

/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}",
    ],
  plugins: [mtConfig({
    colors: {
      primary: {
        default: "#86ae64",
        dark: "#4f7c23",
        light: "#96e25e",
        foreground: "#030712"
      }
    },
  })],
};
export default config;
