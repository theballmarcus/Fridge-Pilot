import React from 'react';
import { Button } from '@material-tailwind/react';
import { IconFaceIdError } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md text-center">
                <div className="flex justify-center mb-6">
                    <IconFaceIdError
                        size={256}
                        stroke={1}
                    />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
                <p className="text-lg text-gray-600 mb-4">
                    Upsi! Den side du tilgår, er ikke tilgængelig.
                </p>
                <Button
                    color="blue"
                    onClick={() => navigate("/home")}
                    className="mt-4 cursor-pointer"
                >
                    Tilbage til hjem
                </Button>
            </div>
        </div>
    );
}
