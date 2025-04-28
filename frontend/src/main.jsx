import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from "@material-tailwind/react";
import App from './App';
import './index.css';
import './react-circular-progressbar.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider>
        <App />
    </ThemeProvider>
);
