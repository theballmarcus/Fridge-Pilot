import { useState, useEffect, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Card, Radio, IconButton, Button, Input, Timeline, Typography } from '@material-tailwind/react';
import { IconPlus, IconMinus, IconCircleArrowUp, IconUser, IconAdjustmentsHorizontal, IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { getToken } from '../../utils/Session.jsx';
import MissingInput from '../../components/MissingInput';
import axios from 'axios';
import intro1 from '../../assets/intro/0.png';
import intro2 from '../../assets/intro/1.png';
import intro3 from '../../assets/intro/2.png';
import intro4 from '../../assets/intro/3.png';
import intro5 from '../../assets/intro/4.png';
import intro6 from '../../assets/intro/5.png';
import intro7 from '../../assets/intro/6.png';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

function handleSignupSubmit(email, password) {
    return new Promise((resolve, reject) => {
        try {
            // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
            // if (!(emailRegex.test(email))) throw 'Indtast gyldig e-mail'
            // if (!(passwordRegex).test(password))
            //     throw 'Adgangskoden skal indeholde et ciffer fra 1 til 9, et lille bogstav, et stort bogstav, et specialtegn, ingen mellemrum, og skal være mellem 8-16 tegn langt'

            axios.post(`${API_BASE_URL}/api/auth/register`, {
                mail: email,
                password: password
            }).then(response => {
                if (response.status !== 201) throw 'Bruger eksisterer allerede';

                localStorage.setItem('token', response.data.token);

                return resolve({
                    email,
                    password
                });
            }).catch(error => {
                console.error('Error:', error);

                return reject('Bruger eksisterer allerede');
            });
        } catch (err) {
            return reject(err);
        }
    });
}

function SignupAccountCard({ show, onNext }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);

    return (
        <Card className={(show ? "block" : "hidden") + " max-w-xs"}>
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
                        E-mail
                    </Typography>
                    <Input
                        id="email"
                        type="email"
                        placeholder="dig@e-mail.dk"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
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
                    <Input
                        id="password"
                        type="password"
                        placeholder="************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <hr className="my-6 border-surface" />
                <Button isFullWidth className="cursor-pointer" onClick={(e) => {
                    e.preventDefault();
                    setError(null);
                    handleSignupSubmit(email, password)
                        .then(result => {
                            setError(null);
                            onNext(result);
                        }).catch(err => setError(err))
                }}>Fortsæt</Button>
                <MissingInput errorMessage={error} />
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
                        href="/login"
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

function HeightSelect({ value, onChange }) {
    const maxHeight = 250; // cm
    const isValueSet = value !== null;
    value ??= 160;

    const handleHeightChange = (newValue) => {
        const clampedValue = Math.min(Math.max(newValue, 0), maxHeight);
        value = clampedValue
        onChange(value);
    };

    return (
        <div>
            <div className="relative w-[116px]">
                <Input
                    type='number'
                    value={isValueSet ? value : ''}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    min={1}
                    max={maxHeight}
                    className="border-gray-300 text-gray-700 placeholder:text-primary placeholder:opacity-100 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Typography className='absolute right-14 top-3 h-5 w-5 text-gray-700 text-xs'>cm</Typography>
                <div className="absolute right-1 top-1 flex gap-0.5">
                    <IconButton
                        size="s"
                        variant="ghost"
                        className="rounded"
                        onClick={() => handleHeightChange((value) - 1)}
                        disabled={value <= 0}
                    >
                        <IconMinus />
                    </IconButton>
                    <IconButton
                        size="s"
                        variant="ghost"
                        className="rounded"
                        onClick={() => handleHeightChange((value) + 1)}
                        disabled={value >= maxHeight}
                    >
                        <IconPlus />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}

function GenderSelect({ value, onChange }) {
    const handleGenderChange = (gender) => {
        onChange(gender);
    };

    return (
        <div className="flex flex-col gap-2">
            <Radio
                value={value}
                onChange={(e) => handleGenderChange(e.target.value)}
                className="flex flex-col gap-2"
            >
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Radio.Item
                            id="male"
                            value="male"
                            ripple="false"
                        />
                        <Typography
                            as="label"
                            htmlFor="male"
                            className="cursor-pointer text-foreground"
                        >
                            Mand
                        </Typography>
                    </div>

                    <div className="flex items-center gap-2">
                        <Radio.Item
                            id="female"
                            value="female"
                            ripple="false"
                        />
                        <Typography
                            as="label"
                            htmlFor="female"
                            className="cursor-pointer text-foreground"
                        >
                            Kvinde
                        </Typography>
                    </div>
                </div>
            </Radio>
        </div>
    );
}

function YearSelect({ value, onChange }) {
    const currentYear = new Date().getFullYear();
    const isValueSet = value !== null;
    value ??= currentYear;

    const handleYearChange = (newValue) => {
        const clampedValue = Math.min(Math.max(newValue, 0), currentYear);
        value = clampedValue
        onChange(value);
    };

    return (
        <div>
            <div className="relative w-[116px]">
                <Input
                    type="number"
                    value={isValueSet ? value : ''}
                    onChange={(e) => handleYearChange(Number(e.target.value))}
                    min={1}
                    max={currentYear}
                    className="border-gray-300 text-gray-700 placeholder:text-primary placeholder:opacity-100 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="absolute right-1 top-1 flex gap-0.5">
                    <IconButton
                        size="s"
                        variant="ghost"
                        className="rounded"
                        onClick={() => handleYearChange((value) - 1)}
                        disabled={value <= 0}
                    >
                        <IconMinus />
                    </IconButton>
                    <IconButton
                        size="s"
                        variant="ghost"
                        className="rounded"
                        onClick={() => handleYearChange((value) + 1)}
                        disabled={value >= currentYear}
                    >
                        <IconPlus />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}

function MonthDropdown({ selectedMonth, onSelect }) {
    selectedMonth ??= new Date().getMonth();
    const months = [
        { index: 0, name: "Januar" },
        { index: 1, name: "Februar" },
        { index: 2, name: "Marts" },
        { index: 3, name: "April" },
        { index: 4, name: "Maj" },
        { index: 5, name: "Juni" },
        { index: 6, name: "Juli" },
        { index: 7, name: "August" },
        { index: 8, name: "September" },
        { index: 9, name: "Oktober" },
        { index: 10, name: "November" },
        { index: 11, name: "December" }
    ];

    const buttonText = months.find(m => m.index === selectedMonth)?.name

    return (
        <Menu>
            <Menu.Trigger as={Button} className="w-[200px] rounded shadow-sm border-gray-300 text-gray-700" variant="ghost" size="sm">
                {buttonText}
            </Menu.Trigger>
            <Menu.Content className="z-100">
                {months.map((month) => (
                    <Menu.Item
                        key={month.index}
                        onClick={() => onSelect(month.index)}
                    >
                        {month.name}
                    </Menu.Item>
                ))}
            </Menu.Content>
        </Menu>
    );
}

function DaySelect({ selectedYear, selectedMonth, value, onChange }) {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const isValueSet = value !== null;
    value ??= new Date().getDate();

    // Ensure the value stays within valid day range (1 to daysInMonth)
    const handleDayChange = (newValue) => {
        const clampedValue = Math.min(Math.max(newValue, 1), daysInMonth);
        onChange(clampedValue);
    };

    return (
        <div>
            <div className="relative w-[94px]">
                <Input
                    type="number"
                    value={isValueSet ? value : ''}
                    onChange={(e) => handleDayChange(Number(e.target.value))}
                    min={1}
                    max={daysInMonth}
                    className="border-gray-300 text-gray-700 placeholder:text-primary placeholder:opacity-100 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="absolute right-1 top-1 flex gap-0.5">
                    <IconButton
                        size="s"
                        variant="ghost"
                        className="rounded"
                        onClick={() => handleDayChange((value) - 1)}
                        disabled={value <= 1}
                    >
                        <IconMinus />
                    </IconButton>
                    <IconButton
                        size="s"
                        variant="ghost"
                        className="rounded"
                        onClick={() => handleDayChange((value) + 1)}
                        disabled={value >= daysInMonth}
                    >
                        <IconPlus />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}

function WeightSelect({ value, onChange }) {
    const maxWeight = 300; // kg
    const isValueSet = value !== null;
    value ??= 110;

    const handleWeightChange = (newValue) => {
        const clampedValue = Math.min(Math.max(newValue, 0), maxWeight);
        value = clampedValue
        onChange(value);
    };

    return (
        <div>
            <div className="relative w-[140px]">
                <Input
                    type="number"
                    value={isValueSet ? value : ''}
                    onChange={(e) => handleWeightChange(Number(e.target.value))}
                    min={1}
                    max={maxWeight}
                    className="border-gray-300 text-gray-700 placeholder:text-primary placeholder:opacity-100 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Typography className='absolute right-14 top-3 h-5 w-5 text-gray-700 text-xs'>kg</Typography>
                <div className="absolute right-1 top-1 flex gap-0.5">
                    <IconButton
                        size="s"
                        variant="ghost"
                        className="rounded"
                        onClick={() => handleWeightChange((value) - 1)}
                        disabled={value <= 0}
                    >
                        <IconMinus />
                    </IconButton>
                    <IconButton
                        size="s"
                        variant="ghost"
                        className="rounded"
                        onClick={() => handleWeightChange((value) + 1)}
                        disabled={value >= maxWeight}
                    >
                        <IconPlus />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}

function WeightLossSelect({ value, onChange }) {
    const maxLoss = 4;
    const isValueSet = value !== null;
    value ??= 1.5;

    const handleWeightLossChange = (newValue) => {
        const clampedValue = Math.min(Math.max(newValue, 0), maxLoss);
        const floatFixedValue = Math.round(clampedValue * 10) / 10
        value = floatFixedValue;
        onChange(value);
    };

    return (
        <div>
            <div className="relative w-full">
                <Input
                    type="number"
                    value={isValueSet ? value : ''}
                    onChange={(e) => handleWeightLossChange(Number(e.target.value))}
                    min={1}
                    max={maxLoss}
                    className="w-[140px] border-gray-300 text-gray-700 placeholder:text-primary placeholder:opacity-100 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Typography className='absolute right-19 top-3 h-5 w-5 text-gray-700 text-xs'>kg/md.</Typography>
                <div className="absolute right-1 top-1 flex gap-0.5">
                    <IconButton
                        size="s"
                        variant="ghost"
                        className="rounded"
                        onClick={() => handleWeightLossChange((value) - 0.1)}
                        disabled={value <= 0}
                    >
                        <IconMinus />
                    </IconButton>
                    <IconButton
                        size="s"
                        variant="ghost"
                        className="rounded"
                        onClick={() => handleWeightLossChange((value) + 0.1)}
                        disabled={value >= maxLoss}
                    >
                        <IconPlus />
                    </IconButton>
                </div>
            </div>
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
                variant="ghost"
                className="flex items-center gap-2 shadow-sm border-gray-300 text-gray-700"
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

function handleDetailsSubmit(height, gender, year, month, day, weight, weightLossKgPrMonth, activityLevel) {
    return new Promise((resolve, reject) => {
        try {
            const token = getToken();
            if (!token) throw 'Ingen token fundet';
            if (!height) throw 'Indtast din højde';
            if (!gender) throw 'Vælg køn';
            if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') throw 'Sæt fødselsdato';
            if (!weight) throw 'Indtast din nuværende vægt';
            if (!weightLossKgPrMonth) throw 'Indtast ønsket vægttab pr. måned';
            if (!activityLevel) throw 'Vælg dit aktivitetsniveau';
            const birthday = new Date(year, month, day).getTime();
            axios.post(`${API_BASE_URL}/api/auth/register_details`, {
                birthday: birthday,
                gender: gender === 'male' ? 0 : 1,
                height: height,
                weight: weight,
                activityLevel: activityLevel,
                monthlyGoal: weightLossKgPrMonth
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    console.log(response)
                }).catch(error => {
                    console.error('Error:', error);
                });

        } catch (err) {
            return reject(err);
        }

        const time = new Date(year, month, day).getTime();
        return resolve({
            height,
            gender,
            time,
            weight,
            weightLossKgPrMonth,
            activityLevel
        });
    });
}

function DetailsCard({ show, onNext }) {
    const [selectedHeight, setSelectedHeight] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedDay, setSelectedDay] = useState(1);
    const [selectedWeight, setSelectedWeight] = useState(null);
    const [selectedWeightLoss, setSelectedWeightLoss] = useState(null);
    const [activityLevel, setActivityLevel] = useState(null);

    const [error, setError] = useState(null);

    return (
        <Card className={(show ? "block" : "hidden") + " max-w-xs"}>
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
                <div className="grid grid-cols-[130px_1fr]">
                    <div>
                        <Typography>
                            Højde
                        </Typography>
                    </div>
                    <div>
                        <Typography>
                            Køn
                        </Typography>
                    </div>
                    <div>
                        <HeightSelect
                            value={selectedHeight}
                            onChange={setSelectedHeight}
                        />
                    </div>
                    <div className="flex items-center">
                        <GenderSelect
                            value={selectedGender}
                            onChange={setSelectedGender}
                        />
                    </div>
                </div>

                <Typography className="mt-4">
                    Fødselsdag
                </Typography>
                <div className="flex flex-row justify-between w-full">
                    <YearSelect
                        value={selectedYear}
                        onChange={setSelectedYear}
                    />
                    <MonthDropdown
                        selectedMonth={selectedMonth}
                        onSelect={setSelectedMonth}
                    />
                    <DaySelect
                        value={selectedDay}
                        selectedYear={selectedYear}
                        selectedMonth={selectedMonth}
                        onChange={setSelectedDay}
                    />
                </div>
                <div className="grid grid-cols-[150px_1fr] mt-4">
                    <div>
                        <Typography className="mt6">
                            Nuværende vægt
                        </Typography>
                    </div>
                    <div>
                        <Typography>
                            Tab pr. måned
                        </Typography>
                    </div>
                    <div>
                        <WeightSelect
                            value={selectedWeight}
                            onChange={setSelectedWeight}
                        />
                    </div>
                    <div className="flex items-center">
                        <WeightLossSelect
                            value={selectedWeightLoss}
                            onChange={setSelectedWeightLoss}
                        />
                    </div>
                </div>

                <Typography className="mt-4">
                    Hvor aktiv er du?
                </Typography>
                <ActivityLevelDropdown
                    value={activityLevel}
                    onChange={setActivityLevel}
                />
                <hr className="my-6 border-surface" />
                <Button isFullWidth className="cursor-pointer" onClick={(e) => {
                    e.preventDefault();
                    handleDetailsSubmit(
                        selectedHeight,
                        selectedGender,
                        selectedYear,
                        selectedMonth,
                        selectedDay,
                        selectedWeight,
                        selectedWeightLoss,
                        activityLevel
                    )
                        .then(result => {
                            setError(null);
                            onNext(result);
                        }).catch(err => setError(err))
                }
                }>Opret konto</Button>
                <MissingInput errorMessage={error} />
            </Card.Body>
        </Card>
    );
}

const IntroCarousel = ({ show, onNext }) => {
    const images = [intro1, intro2, intro3, intro4, intro5, intro6, intro7];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [backDisabled, setBackDisabled] = useState(true);

    const goToPrevious = () => {
        setCurrentIndex(prevIndex => Math.max(0, prevIndex - 1));
    };

    const goToNext = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= images.length) {
            onNext({});
        } else {
            setCurrentIndex(nextIndex);
        }
    };

    useEffect(() => {
        setBackDisabled(currentIndex === 0);
    }, [currentIndex])

    return (
        <div className={(show ? "block" : "hidden")}>
            <div className="fixed w-screen top-0 left-0 h-screen overflow-hidden bg-primary">
                {/* Full-width image */}
                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className="absolute inset-0 m-auto h-[calc(100%_-_100px)] object-cover rounded-4xl"
                />

                {/* Navigation arrows at the bottom */}
                <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-8 bottom-4">
                    <Button
                        onClick={goToPrevious}
                        variant="ghost"
                        disabled={backDisabled}
                    >
                        <IconArrowLeft size={60} color="rgb(var(--color-black))" stroke={2} />
                    </Button>
                    <button
                        onClick={goToNext}
                        variant="ghost"
                    >
                        {currentIndex === images.length - 1 ?
                            <IconCheck size={60} color="rgb(var(--color-black))" stroke={2} />
                            : <IconArrowRight size={60} color="rgb(var(--color-black))" stroke={2} />
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Signup() {
    const [signupStep, setSignupStep] = useState(0);
    const [_loginDetails, setLoginDetails] = useState({});
    const [_userDetails, setUserDetails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (signupStep === 0) window.location.hash = 'accountdetails';
        else if (signupStep === 1) window.location.hash = 'userdetails';
    }, [signupStep]);

    const handleNextStep = (stepData) => {
        switch (signupStep) {
            case 0:
                setLoginDetails(stepData);
                setSignupStep(signupStep + 1);
                break;
            case 1:
                setUserDetails(stepData);
                setSignupStep(signupStep + 1);
                break;
            case 2:
                setSignupStep(signupStep + 1);
                navigate('/home', { replace: true });
                break;
            default:
                throw new Error('Unhandled signup step');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col items-center w-full max-w-md">
                <SignupAccountCard show={signupStep === 0} onNext={handleNextStep} />
                <DetailsCard show={signupStep === 1} onNext={handleNextStep} />
                <IntroCarousel show={signupStep === 2} onNext={handleNextStep} />
                {signupStep !== 2 && <div className="mt-10 w-[300px]">
                    <SignupProgress step={signupStep} />
                </div>}
            </div>
        </div>
    );
}
