import { useEffect, useState } from 'react';

/**
 * 
 * @param {string} rgb 
 * @returns 
 */
const rgbToHex = rgb => {
    const [r, g, b] = rgb.split(' ').map(Number);

    const toHex = (num) => {
        const hex = num.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Gets current theme colors from CSS variables
 * @returns {Object} Theme colors object
 */
const getThemeColors = () => {
    // Get computed styles from root element
    const computedStyles = window.getComputedStyle(document.documentElement);

    return {
        firstColor: rgbToHex(computedStyles.getPropertyValue('--color-primary').trim()),
        secondaryColor: rgbToHex(computedStyles.getPropertyValue('--color-info').trim()),
        tertiaryColor: rgbToHex(computedStyles.getPropertyValue('--color-success').trim()),
        quaternaryColor: rgbToHex(computedStyles.getPropertyValue('--color-error').trim())
    };
};

/**
 * Watches for theme changes and calls callback with new colors
 * @param {(object) => unknown} callback Receives colors object (primary, info, success)
 * @returns {() => void} Cleanup function to remove observer
 */
const watchThemeColors = (callback) => {
    const observer = new MutationObserver(() => {
        callback(getThemeColors());
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'style']
    });

    return () => observer.disconnect();
};

export const useThemeColors = () => {
    const [colors, setColors] = useState(getThemeColors());

    useEffect(() => {
        return watchThemeColors(newColors => {
            setColors(newColors);
        });
    }, []);

    return colors;
};
