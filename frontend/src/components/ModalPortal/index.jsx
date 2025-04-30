import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ModalPortal = ({ children, isOpen }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
        console.error('Modal root element not found');
        return null;
    }

    return isOpen ? createPortal(children, modalRoot) : null;
};

export default ModalPortal;
