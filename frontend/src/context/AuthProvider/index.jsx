import { createContext, useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, Typography, Button } from "@material-tailwind/react";

const ErrorModal = ({ onClose }) => {

    const handleLoginRedirect = () => {
        onClose();
        window.location.href = '/login';

    };

    return createPortal(
        <div className="fixed inset-0  z-[9999] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 text-center">
                <Typography variant="h4" color="red" className="mb-4">
                    Adgang nægtet
                </Typography>
                <Typography variant="paragraph" className="mb-6 text-gray-700">
                    Du skal være logget ind for at få adgang til denne side. Venligst log ind eller opret en konto for at fortsætte.
                </Typography>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button
                        color="gray"
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        Annuller
                    </Button>
                    <Button
                        color="red"
                        onClick={handleLoginRedirect}
                        className="w-full sm:w-auto"
                    >
                        Log ind
                    </Button>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [tokenError, setTokenError] = useState(false);

    const validateToken = () => {
        const token = localStorage.getItem('token');
        if (token === null) {
            setTokenError(true);
            return false;
        }
        return true;
    };

    const getToken = () => {
        return validateToken() ? localStorage.getItem('token') : null;
    };

    return (
        <AuthContext.Provider value={{ tokenError, setTokenError, validateToken, getToken }}>
            {tokenError && (
                <ErrorModal onClose={() => setTokenError(false)} />
            )}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
