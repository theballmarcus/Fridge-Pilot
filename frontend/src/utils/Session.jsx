/**
 * Gets the token from localStorage and shows reauth modal if missing
 * @returns {string|null} The token if exists, otherwise shows modal and returns null
 */

export const getToken = () => {
    const token = localStorage.getItem('token');

    if (token === null) {
        // Trigger modal
        const event = new CustomEvent('showAuthModal');
        window.dispatchEvent(event);
    }

    return token;
};
