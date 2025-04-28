import { createContext, useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';


/*const ErrorModal = () => {
    const navigate = useNavigate();

    return createPortal(
        <Dialog open={true}>
            <Dialog.Overlay>
                <Dialog.Content>
                    <div className='flex items-center justify-between gap-4'>
                        <Typography type='h6'>Du er ikke logget ind</Typography>
                    </div>
                    <Typography className='mb-6 mt-2 text-foreground'>
                        Klik på knappen for at tilgå forsiden, så du kan logge ind igen
                    </Typography>
                    <div className='mb-1 flex items-center justify-end gap-2'>
                        <Button onClick={() => {
                            localStorage.clear();
                            navigate('/', { replace: true });
                        }}>Til forsiden</Button>
                    </div>
                </Dialog.Content>
            </Dialog.Overlay>
        </Dialog>,
        document.getElementById('modal-root')
    );
};*/

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

    return (
        <AuthContext.Provider value={{ tokenError, setTokenError, validateToken }}>
            {/*tokenError && (
                <ErrorModal onClose={() => setTokenError(false)} />
            )*/}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
