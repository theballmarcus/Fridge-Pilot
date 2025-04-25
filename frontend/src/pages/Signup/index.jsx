import { useState, useEffect, forwardRef } from 'react';
import { Menu, Card, Button, Input, Timeline, Typography } from "@material-tailwind/react";
import { IconCircleArrowUp, IconUser, IconAdjustmentsHorizontal } from '@tabler/icons-react';

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

const ActivityItem = forwardRef(({ 
  title, 
  description,
  onClick,
  ...rest 
}, ref) => {
  return (
    <Menu.Item 
      ref={ref} 
      {...rest} 
      className="flex-col items-start p-3 hover:bg-gray-50"
      onClick={onClick}
    >
      <Typography color="default" className="font-semibold">
        {title}
      </Typography>
      <Typography type="small" className="text-gray-600 mt-1">
        {description}
      </Typography>
    </Menu.Item>
  );
});

function ActivityLevelDropdown({ value, onChange }) {
  const activityLevels = [
    {
      id: 1,
      title: "Stillesiddende",
      description: "Lidt eller ingen motion, f.eks. et skrivebordsjob uden yderligere fysisk aktivitet"
    },
    {
      id: 2,
      title: "Let aktiv",
      description: "Let motion 1-2 dage om ugen"
    },
    {
      id: 3,
      title: "Moderat aktiv",
      description: "Moderat motion 3-5 dage/uge"
    },
    {
      id: 4,
      title: "Meget aktiv",
      description: "Hård motion 6-7 dage/uge"
    },
    {
      id: 5,
      title: "Ekstremt aktiv",
      description: "Hård daglig motion og fysisk arbejde eller træning to gange om dagen"
    }
  ];

  const selectedLevel = activityLevels.find(level => level.id === value);
  const buttonText = selectedLevel ? selectedLevel.title : "Vælg aktivitetsniveau";

  const handleSelect = (levelId) => {
    onChange(levelId);
  };

  return (
    <Menu>
      <Menu.Trigger
        as={Button}
        size="md"
        className="flex items-center gap-2 border-gray-300 text-gray-700"
      >
        {buttonText}
        <IconCircleArrowUp className="h-4 w-4 stroke-2 group-data-[open=true]:rotate-180" />
      </Menu.Trigger>
      <Menu.Content className="w-80 p-2 z-100">
        <ul className="space-y-1">
          {activityLevels.map((level) => (
            <ActivityItem
              key={level.id}
              title={level.title}
              description={level.description}
              onClick={() => handleSelect(level.id)}
            />
          ))}
        </ul>
      </Menu.Content>
    </Menu>
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
    const [activityLevel, setActivityLevel] = useState(null);

    return (
        <Card className="max-w-xs">
            <Card.Header
                as={Card}
                color="primary"
                className="grid h-24 place-items-center shadow-none"
            >
                <Typography as="span" type="h4" className="text-primary-foreground">
                    Lad os skræddersy din keto!
                </Typography>
            </Card.Header>
            <Card.Body className="flex justify-center flex-col">
                <Typography>
                    Hvor aktiv er du?
                </Typography>
                <ActivityLevelDropdown
                      value={activityLevel} 
                      onChange={setActivityLevel} 
                />
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