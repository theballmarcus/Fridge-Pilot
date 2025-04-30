import { useState } from 'react';
import { Dialog, List, Typography, IconButton, } from '@material-tailwind/react';
import { IconCheck, IconX, IconFlame, IconWheat, IconMeat, IconDroplet } from '@tabler/icons-react';
import { useThemeColors } from '../../hooks/useThemeColors.jsx';
import ModalPortal from '../ModalPortal';

function Ingredient({ needsIngredient, weight, unit, ingredient }) {
    const [markedDone, setMarkedDone] = useState(false);

    return (
        <List.Item onClick={() => setMarkedDone(!markedDone)}>
            <List.ItemStart>
                <Typography color={needsIngredient ? 'error' : 'success'}>{needsIngredient ? <IconX/> : <IconCheck />}</Typography>
            </List.ItemStart>
            <Typography className={markedDone && 'line-through'}>{weight} {unit} {ingredient}</Typography>
        </List.Item>
    )
}

export default function Recipe({ open, meal, onVisibilityChange }) {
    const { firstColor, secondaryColor, tertiaryColor, quaternaryColor } = useThemeColors();

    return (
        (meal &&
            <ModalPortal isOpen={open}>
                <Dialog open={open} handler={() => onVisibilityChange(false)}>
                    <Dialog.Overlay>
                        <Dialog.Content>
                            <div className="flex items-center justify-between gap-4">
                                <IconButton
                                    size="sm"
                                    variant="ghost"
                                    color="secondary"
                                    className="absolute right-2 top-2"
                                    isCircular
                                    onClick={() => onVisibilityChange(false)}
                                >
                                    <IconX className="h-5 w-5" />
                                </IconButton>
                            </div>
                            <div className="flex flex-row">
                                <img
                                    src={meal.image}
                                    alt="card-image"
                                    className="h-full w-[300px] object-cover object-center"
                                />
                                <div className="flex flex-col ml-4 w-full">
                                    <Typography type="h4" className="mt-2">{meal.recipe}</Typography>
                                    <hr className="my-4 border-surface" />
                                    <div className="w-full grid grid-cols-2 grid-rows-5 gap-0">
                                        <div className="flex items-center justify-start">
                                            <IconFlame color={quaternaryColor} />
                                            <Typography type="h6">{meal.calories} kcal</Typography>
                                        </div>
                                        <div className="flex items-center justify-start">
                                            <IconWheat color={firstColor} />
                                            <Typography type="h6">{meal.carbs} kulhydrater</Typography>
                                        </div>
                                        <div className="flex items-center justify-start">
                                            <IconMeat color={secondaryColor} />
                                            <Typography type="h6">{meal.protein} protein</Typography>
                                        </div>
                                        <div className="flex items-center justify-start">
                                            <IconDroplet color={tertiaryColor} />
                                            <Typography type="h6">{meal.fat} fedt</Typography>
                                        </div>
                                        <div className="flex items-center justify-start w-full"><hr className="border-surface w-full" /></div>
                                        <div className="flex items-center justify-start w-full"><hr className="border-surface w-full" /></div>
                                        <Typography><b>Tid i alt</b>: {meal.totalTime} min</Typography>
                                        <Typography><b>Arbejdstid</b>: {meal.prepTime} min</Typography>
                                        <Typography><b>Indkøbspris</b>: {meal.price} kr.</Typography>
                                    </div>
                                </div>
                            </div>
                            <hr className="my-4 border-surface" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div className="bg-surface-light p-4 rounded-lg">
                                    <Typography type="h6" className="mx-3">Ingredienser</Typography>
                                    <hr className="my-2 border-surface" />
                                    <List>
                                        {meal.ingredients.map(([ingredient, weight, unit, , needsIngredient], index) =>
                                            <Ingredient
                                                key={index}
                                                ingredient={ingredient}
                                                weight={weight}
                                                unit={unit}
                                                needsIngredient={needsIngredient}
                                            />
                                        )}
                                    </List>
                                </div>
                                <div className="bg-surface-light p-4 rounded-lg">
                                    <Typography type="h6">Fremgangsmåde</Typography>
                                    <hr className="my-2 border-surface" />
                                    <Typography type="paragraph" className="whitespace-pre-line">{meal.instructions.replaceAll('\n', '\n\n')}</Typography>
                                </div>
                            </div>
                        </Dialog.Content>
                    </Dialog.Overlay>
                </Dialog>
            </ModalPortal>
        )
    )
}
