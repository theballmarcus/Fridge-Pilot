import { List, Card, Typography } from "@material-tailwind/react";
import { IconBrandPeanut, IconMilk, IconCheese, IconEggs } from '@tabler/icons-react';
import header from '../../assets/cheatmeal-header.jpg';

export default function CalorieBuffer() {
    return (
        <Card className="max-w-xs">
            <Card.Header as="img" src={header} alt="Foto af bestik med skriften keto diet" />
            <Card.Body>
                <Typography type="h6">Cheat Meals</Typography>
                <Typography>I dag har du et kalorieoverskud på {300} kcal! Du har buffer til ekstra snacks i dag.</Typography>
                <List>
                    <List.Item>
                        <List.ItemStart>
                            <IconBrandPeanut size={16} />
                        </List.ItemStart>
                        Jordnødder: Kalorietætte, moderate i kulhydrater, højt fedt- og proteinindhold, ideelle til hurtig mæthed i små portioner.                    </List.Item>
                    <List.Item>
                        <List.ItemStart>
                            <IconMilk size={16} />
                        </List.ItemStart>
                        Græsk yoghurt: Tilføj nødder, kerner eller kokosflager for flere kalorier.
                    </List.Item>
                    <List.Item>
                        <List.ItemStart>
                            <IconCheese size={16} />
                        </List.ItemStart>
                        Ostestænger: Højt fedt og protein & nemt til farten
                    </List.Item>
                    <List.Item>
                        <List.ItemStart>
                            <IconEggs size={16} />
                        </List.ItemStart>
                        Æg (hårdkogte): Højt fedt og protein, kan forberedes på forhånd til flere dage
                    </List.Item>
                </List>
            </Card.Body>
        </Card>
    );
}
