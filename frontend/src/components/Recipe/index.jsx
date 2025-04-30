import { Dialog, Button, Typography, IconButton, } from '@material-tailwind/react';
import { IconX, IconFlame, IconWheat, IconMeat, IconDroplet } from '@tabler/icons-react';
import { useThemeColors } from '../../hooks/useThemeColors.jsx';
import ModalPortal from '../ModalPortal';

export default function Recipe({ open, meal, onVisibilityChange }) {
    const { firstColor, secondaryColor, tertiaryColor, quaternaryColor } = useThemeColors();

    console.log(meal);

    return (
        (meal &&
            <ModalPortal isOpen={open}>
                <Dialog open={open} handler={() => onVisibilityChange(false)}>
                    <Dialog.Overlay>
                        <Dialog.Content>
                            <div className="flex items-center justify-between gap-4">
                                <Typography type="h4">{meal.recipe}</Typography>
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
                            <div>
                                <div className="w-full grid grid-cols-2 grid-rows-2 gap-4 h-[80px]">
                                    <div className="flex items-center justify-center">
                                        <IconFlame color={quaternaryColor} />
                                        <Typography type="h6">{meal.calories} kcal</Typography>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <IconWheat color={firstColor} />
                                        <Typography type="h6">{meal.carbs} kulhydrater</Typography>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <IconMeat color={secondaryColor} />
                                        <Typography type="h6">{meal.protein} protein</Typography>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <IconDroplet color={tertiaryColor} />
                                        <Typography type="h6">{meal.fat} fedt</Typography>
                                    </div>
                                </div>
                            </div>
                            <Typography className="mb-6 mt-2 text-foreground">

                            </Typography>
                            <div className="mb-1 flex items-center justify-end gap-2">
                                <Button>Some stuff</Button>
                            </div>
                        </Dialog.Content>
                    </Dialog.Overlay>
                </Dialog>
            </ModalPortal>
        )
    )
}
