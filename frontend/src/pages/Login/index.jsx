import { Card, Button, Input, Typography } from "@material-tailwind/react";

function LoginCard() {
    return (
        <Card className="max-w-xs">
            <Card.Header
                as={Card}
                color="primary"
                className="grid h-24 place-items-center shadow-none"
            >
                <Typography as="span" type="h4" className="text-primary-foreground">
                    Log ind
                </Typography>
            </Card.Header>
            <Card.Body as="form">
                <div className="mb-4 mt-2 space-y-1.5">
                    <Typography
                        as="label"
                        htmlFor="email"
                        type="small"
                        color="default"
                        className="font-semibold"
                    >
                        E-mail
                    </Typography>
                    <Input id="email" type="email" placeholder="din@e-mail.dk" />
                </div>
                <div className="mb-4 space-y-1.5">
                    <Typography
                        as="label"
                        htmlFor="password"
                        type="small"
                        color="default"
                        className="font-semibold"
                    >
                        Kodeord
                    </Typography>
                    <Input id="password" type="password" placeholder="************" />
                </div>
                <Button isFullWidth>Log ind</Button>
            </Card.Body>
            <Card.Footer className="text-center">
                <Typography
                    type="small"
                    className="my-1 flex items-center justify-center gap-1 text-foreground"
                >
                    Har du ikke en konto?
                    <Typography
                        type="small"
                        as="a"
                        href="#"
                        color="primary"
                        className="font-bold"
                    >
                        Opret konto
                    </Typography>
                </Typography>
            </Card.Footer>
        </Card>
    );
}

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col items-center w-full max-w-md flex"> {/* Adjust max-w-md to your preferred width */}
                <LoginCard/>
            </div>
        </div>
    );
}
