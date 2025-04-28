import { Card, Button, Input, Typography } from '@material-tailwind/react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const loginUser = async({ email, password }) => {
    try {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
            mail: email,
            password
        });

        if (response.status === 400) {
            throw new Error('Invalid credentials');
        }

        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.response?.data?.msg || 'Login failed');
    }
};

const LoginForm = ({ onSubmit, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <Card className="max-w-xs w-full">
            <Card.Header className="grid h-24 place-items-center bg-primary shadow-none">
                <Typography as="span" type="h4" className="text-primary-foreground">
                    Log ind
                </Typography>
            </Card.Header>

            <Card.Body as="form" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Typography as="label" variant="small" className="font-semibold block">
                            E-mail
                        </Typography>
                        <Input
                            type="email"
                            placeholder="din@e-mail.dk"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Typography as="label" variant="small" className="font-semibold block">
                            Kodeord
                        </Typography>
                        <Input
                            type="password"
                            placeholder="************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <Typography variant="small" color="red">
                            {error}
                        </Typography>
                    )}

                    <Button type="submit" isFullWidth>
                        Log ind
                    </Button>
                </div>
            </Card.Body>

            <Card.Footer className="text-center">
                <Typography variant="small" className="flex justify-center gap-1">
                    Har du ikke en konto?
                    <Typography
                        as="a"
                        href="/signup"
                        color="primary"
                        className="font-bold"
                    >
                        Opret konto
                    </Typography>
                </Typography>
            </Card.Footer>
        </Card>
    );
};

export default function LoginPage() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (credentials) => {
        try {
            await loginUser(credentials);
            navigate('/home');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <LoginForm onSubmit={handleLogin} error={error} />
            </div>
        </div>
    );
}
