import { useState, useEffect } from 'react';
import { Typography, Card, Navbar, Input, Button, Chip } from '@material-tailwind/react';
import { IconX, IconSearch, IconShoppingCart } from '@tabler/icons-react';
import { matchSorter } from 'match-sorter';
import axios from 'axios';
import { getToken } from '../../utils/Session.jsx';
import { useAuth } from '../../context/AuthProvider/index.jsx';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const groceryPost = (groceryList) => {
    const token = getToken();
    axios.post(`${API_BASE_URL}/api/diet/groceries`, {
        groceries: groceryList
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(result => {
        if (result.statusText !== 'OK') console.error(result.data.msg);
    });
}

const submitNewGrocery = async (grocery, groceryList, setGroceryInput, setGroceryList) => {
    if (!grocery.length) return;
    if (groceryList.map(grocery => grocery.toLowerCase().trim()).includes(grocery.toLowerCase().trim())) return;

    const newList = [...groceryList, grocery];
    if (setGroceryInput) setGroceryInput('');
    setGroceryList(newList);
    groceryPost(newList);
}

const deleteGrocery = (groceryToDelete, groceryList, setGroceryList) => {
    const newList = groceryList.filter(grocery => grocery !== groceryToDelete);
    setGroceryList(newList);
    groceryPost(newList);
}

function IngredientChip({ ingredient, onDelete }) {
    return (
        <Chip variant="outline" size="lg">
            <Chip.Icon>
                <IconX className="h-full w-full cursor-pointer" onClick={onDelete} />
            </Chip.Icon>
            <Chip.Label>{ingredient}</Chip.Label>
        </Chip>
    );
}

function PredefinedIngredientChip({ ingredient, press }) {
    return (
        <Chip variant="outline" size="lg" className="cursor-pointer" onClick={() => press(ingredient)}>
            <Chip.Label>{ingredient}</Chip.Label>
        </Chip>
    );
}

function PredefinedIngredients({ press }) {
    const groceries = {
        'Animalsk protein': ['Æg', 'Bacon', 'Kyllingebryst', 'Laks', 'Oksekød', 'Skinke', 'Kalkun', 'Røget laks'],
        'Mejeri': ['Smør', 'Fløde', 'Ost', 'Creme fraiche', 'Græsk yoghurt', 'Mozzarella', 'Parmesan', 'Blåskimmelost'],
        'Grøntsager': ['Spinat', 'Avocado', 'Broccoli', 'Blomkål', 'Zucchini', 'Tomater', 'Løg', 'Champignon'],
        'Fedt og olie': ['Kokosolie', 'Olivenolie', 'Sesamolie', 'Avocadoolie', 'Ghee', 'Smør', 'Kokoscreme', 'Baconfedt'],
        'Nødder og frø': ['Mandler', 'Valnødder', 'Hasselnødder', 'Chiafrø', 'Hørfrø', 'Solsikkefrø', 'Paranødder', 'Cashewnødder'],
        'Krydderier og urter': ['Salt', 'Peber', 'Hvidløg', 'Basilikum', 'Oregano', 'Spidskommen', 'Chilipulver', 'Koriander']
    }

    return <Card>
        <Card.Body>
            {Object.keys(groceries).map(category => (
                <div key={category}>
                    <Typography type="h6" className="mb-2">{category}</Typography>
                    <div className="flex flex-wrap">
                        {groceries[category].map(ingredient => (
                            <PredefinedIngredientChip key={ingredient} ingredient={ingredient} press={press} />
                        ))}
                    </div>
                    <hr className="my-4 border-surface" />
                </div>
            ))}
        </Card.Body>
    </Card>
}

export default function FridgePage() {
    const { getToken } = useAuth();
    const [groceryInput, setGroceryInput] = useState('');
    const [groceryList, setGroceryList] = useState([]);
    const [groceryListSet, setGroceryListSet] = useState(new Set(groceryList));
    const [filteredGroceryList, setFilteredGroceryList] = useState(groceryList);
    const [searchInput, setSearchInput] = useState('');
    const [inputDisabled, setInputDisabled] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) return;

        axios.get(`${API_BASE_URL}/api/diet/groceries`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(result => {
            if (result.status === 200) {
                const { groceries } = result.data;
                setGroceryList(groceries);
                setFilteredGroceryList(groceries);
                setInputDisabled(false);
                setSubmitDisabled(false);
            }
        });
    }, [getToken]);

    useEffect(() => {
        setFilteredGroceryList(matchSorter(groceryList, searchInput));
    }, [searchInput, groceryList]);

    useEffect(() => {
        setGroceryListSet(new Set(groceryList.map(item => item.toLowerCase().trim())));
    }, [groceryList])

    return (
        <div className="space-y-4">
            <div>
                <Navbar className="mx-auto w-full max-w-screen-xl">
                    <div className="flex w-full flex-wrap items-center justify-between gap-2">
                        {/* Search Input */}
                        <div className="relative w-[150px]">
                            <Input
                                placeholder="Søg efter vare"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                disabled={inputDisabled}
                                className="border-gray-300 text-gray-700 placeholder:text-primary placeholder:opacity-100 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            >
                                <Input.Icon>
                                    <IconSearch className="h-full w-full" />
                                </Input.Icon>
                            </Input>
                        </div>

                        {/* Grocery Input */}
                        <div className="flex flex-row">
                            <div className="relative w-[150px]">
                                <Input
                                    placeholder="Vare"
                                    value={groceryInput}
                                    onChange={(e) => {
                                        const grocery = e.target.value;
                                        setSubmitDisabled(groceryListSet.has(grocery.toLowerCase().trim()));
                                        setGroceryInput(grocery);
                                    }}
                                    disabled={inputDisabled}
                                    className="border-gray-300 text-gray-700 placeholder:text-primary placeholder:opacity-100 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                >
                                    <Input.Icon>
                                        <IconShoppingCart className="h-full w-full" />
                                    </Input.Icon>
                                </Input>
                            </div>
                            <Button
                                className="ml-2"
                                disabled={submitDisabled}
                                variant="outline"
                                onClick={() =>
                                    submitNewGrocery(
                                        groceryInput,
                                        groceryList,
                                        setGroceryInput,
                                        setGroceryList
                                    )
                                }
                            >
                                Føj til køleskab
                            </Button>
                        </div>
                    </div>
                </Navbar>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-0">
                <Card>
                    <Card.Body>
                        {/* Grocery Chips */}
                        <div className="flex flex-wrap gap-2">
                            {filteredGroceryList.map((ingredient, index) => (
                                <IngredientChip
                                    key={index}
                                    ingredient={ingredient}
                                    onDelete={() => deleteGrocery(ingredient, groceryList, setGroceryList)}
                                />
                            ))}
                        </div>
                    </Card.Body>
                </Card>
                <PredefinedIngredients press={clickedGrocery => submitNewGrocery(
                    clickedGrocery,
                    groceryList,
                    null,
                    setGroceryList
                )} />
            </div>
        </div>
    );
}
