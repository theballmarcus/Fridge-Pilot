import { useState, useEffect } from 'react';
import { Card, Button, Input, Timeline, Typography } from "@material-tailwind/react";
import { IconUser, IconAdjustmentsHorizontal } from '@tabler/icons-react';

function SignupProgress(props) {
    return (
        <div className="w-full">
            <Timeline
                mode="stepper"
                value={props.step}
                className="relative"
            >
                <Timeline.Item value={0} disabled={props.step !== 0} className="w-full">
                    <Timeline.Header>
                        <Timeline.Separator className="translate-x-1/2" />
                        <Timeline.Icon className="mx-auto">
                            <IconUser className="h-6 w-6" />
                        </Timeline.Icon>
                    </Timeline.Header>
                    <Timeline.Body className="text-center">
                        <Typography type="h6" color="primary">
                            Trin 1
                        </Typography>
                        <Typography type="small">Kontodetaljer</Typography>
                    </Timeline.Body>
                </Timeline.Item>
                <Timeline.Item value={1} disabled={props.step !== 1} className="w-full">
                    <Timeline.Header>
                        <Timeline.Icon className="mx-auto">
                            <IconAdjustmentsHorizontal className="h-6 w-6" />
                        </Timeline.Icon>
                    </Timeline.Header>
                    <Timeline.Body className="text-center">
                        <Typography type="h6" color={props.step === 1 ? "primary" : "inherit"}>
                            Trin 2
                        </Typography>
                        <Typography type="small">Lidt om dig ...</Typography>
                    </Timeline.Body>
                </Timeline.Item>
            </Timeline>
        </div>
    );
}

function SignupAccountCard({ onNext }) {
    return (
        <Card className="max-w-xs">
            <Card.Header
                as={Card}
                color="primary"
                className="grid h-24 place-items-center shadow-none"
            >
                <Typography as="span" type="h4" className="text-primary-foreground">
                    Opret ny konto
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
                        Email
                    </Typography>
                    <Input id="email" type="email" placeholder="din@email.dk" />
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
                <Button isFullWidth onClick={onNext}>Opret konto</Button>
            </Card.Body>
            <Card.Footer className="text-center">
                <Typography
                    type="small"
                    className="my-1 flex items-center justify-center gap-1 text-foreground"
                >
                    Har allerede en konto?
                    <Typography
                        type="small"
                        as="a"
                        href="#"
                        color="primary"
                        className="font-bold"
                    >
                        Log ind
                    </Typography>
                </Typography>
            </Card.Footer>
        </Card>
    );
}

function DetailsCard() {
    return (
        <Card className="max-w-xs">
            <Card.Header
                as={Card}
                color="primary"
                className="grid h-24 place-items-center shadow-none"
            >
                <Typography as="span" type="h4" className="text-primary-foreground">
                    Info om dig
                </Typography>
            </Card.Header>
            <Card.Body>
                <Typography>
                    Her skal vi have noget info om personen på keto
                </Typography>
            </Card.Body>
        </Card>
    );
}

export default function Signup() {
    const [currentStep, setCurrentStep] = useState(0);
    const [showDetailsCard, setShowDetailsCard] = useState(false);

    useEffect(() => {
        if (currentStep === 0) window.location.hash = 'accountdetails';
        else if (currentStep === 1) window.location.hash = 'userdetails';
    }, [currentStep]);

    const handleNextStep = () => {
        setCurrentStep(1);
        setShowDetailsCard(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col items-center w-full max-w-md">
                {showDetailsCard ? (
                    <DetailsCard />
                ) : (
                    <SignupAccountCard onNext={handleNextStep} />
                )}
                <div className="mt-10 w-[300px]">
                    <SignupProgress step={currentStep} />
                </div>
            </div>
        </div>
    );
}