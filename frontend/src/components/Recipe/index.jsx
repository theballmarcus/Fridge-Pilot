import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, Button, Typography, IconButton, } from '@material-tailwind/react';
import { IconX } from '@tabler/icons-react';

const ModalRootPortal = ({ children }) => {
    const modalRoot = document.getElementById('modal-root');

    if (!modalRoot) {
        console.error('Modal root element not found');
        return null;
    }

    return createPortal(children, modalRoot);
};

export default function Recipe({ open, meal }) {
    const [isOpen, setOpen] = useState(open);

    return (
        <>
            {isOpen && (
                <ModalRootPortal>
                    <Dialog open={isOpen} handler={() => setOpen(false)}>
                        <Dialog.Overlay>
                            <Dialog.Content>
                                <div className="flex items-center justify-between gap-4">
                                    <Typography type="h6">Recipe name</Typography>
                                    <IconButton
                                        size="sm"
                                        variant="ghost"
                                        color="secondary"
                                        className="absolute right-2 top-2"
                                        isCircular
                                        onClick={() => setOpen(false)}
                                    >
                                        <IconX className="h-5 w-5" />
                                    </IconButton>
                                </div>
                                <Typography className="mb-6 mt-2 text-foreground">
                                    Body text
                                </Typography>
                                <div className="mb-1 flex items-center justify-end gap-2">
                                    <Button>Some stuff</Button>
                                </div>
                            </Dialog.Content>
                        </Dialog.Overlay>
                    </Dialog>
                </ModalRootPortal>
            )}
        </>
    );
}
