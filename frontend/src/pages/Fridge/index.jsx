import { useState, useEffect } from 'react';
import { Navbar, Input, Button, Chip } from '@material-tailwind/react';
import { IconX, IconSearch } from '@tabler/icons-react';
import { matchSorter } from 'match-sorter';
import axios from 'axios';
import { getToken } from '../../utils/Session.jsx';

const groceryPost = (groceryList) => {
    const token = getToken();
    axios.post(`http://localhost:8080/api/diet/groceries`, {
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
    if (groceryList.includes(grocery)) return;

    const newList = [...groceryList, grocery];
    setGroceryInput('');
    setGroceryList(newList);
    groceryPost(newList);
}

const deleteGrocery = (groceryToDelete, groceryList, setGroceryList) => {
    const newList = groceryList.filter(grocery => grocery !== groceryToDelete);
    setGroceryList(newList);
    groceryPost(newList);
}

function GroceryChip({ grocery, onDelete }) {
    return (
        <Chip variant="outline">
            <Chip.Icon>
                <IconX className="h-full w-full" onClick={onDelete} />
            </Chip.Icon>
            <Chip.Label>{grocery}</Chip.Label>
        </Chip>
    );
}

export default function FridgePage() {
    const [groceryInput, setGroceryInput] = useState('');
    const [groceryList, setGroceryList] = useState([]);
    const [filteredGroceries, setFilteredGroceries] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [inputDisabled, setInputDisabled] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    useEffect(() => {
        const token = getToken();

        axios.get('http://localhost:8080/api/diet/groceries', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(result => {
            if (result.status === 200) {
                const { groceries } = result.data;
                setGroceryList(groceries);
                setFilteredGroceries(groceries);
                setInputDisabled(false);
                setSubmitDisabled(false);
            }
        });
    }, []);

    useEffect(() => {
        const groceriesParsed = groceryList.map(grocery => grocery.toLowerCase());
        const searchQuery = searchInput.toLowerCase().replace(/\s+/g, '');
        setFilteredGroceries(matchSorter(groceriesParsed, searchQuery));
    }, [searchInput, groceryList]);

    return (
        <div className="space-y-4">
            <div>
                <Navbar className="mx-auto w-full max-w-screen-xl">
                    <div className="flex w-full flex-wrap items-center justify-between gap-2">
                        {/* Grocery Input */}
                        <div className="flex flex-row">
                            <div className="relative w-[150px]">
                                <Input
                                    placeholder="Vare"
                                    value={groceryInput}
                                    onChange={(e) => {
                                        setSubmitDisabled(groceryList.includes(e.target.value));
                                        setGroceryInput(e.target.value);
                                    }}
                                    disabled={inputDisabled}
                                    className="border-gray-300 text-gray-700 placeholder:text-primary placeholder:opacity-100 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
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
                    </div>
                </Navbar>
            </div>

            {/* Grocery Chips */}
            <div className="flex flex-wrap gap-2">
                {filteredGroceries.map((grocery, index) => (
                    <GroceryChip
                        key={index}
                        grocery={grocery}
                        onDelete={() => deleteGrocery(grocery, groceryList, setGroceryList)}
                    />
                ))}
            </div>
        </div>
    );
}
