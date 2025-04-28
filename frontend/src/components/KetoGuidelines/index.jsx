import { List, Card, Typography } from "@material-tailwind/react";
import { IconDropletExclamation, IconWheatOff, IconMeat, IconCandyOff, IconSalt } from '@tabler/icons-react';
import header from '../../assets/guidelines-header.jpg';

export default function KetoGuidelines() {
    return (
        <Card className="max-w-xs">
            <Card.Header as="img" src={header} alt="Foto af mad med mål" />
            <Card.Body>
                <Typography type="h6">Retningslinjer for keto</Typography>
                <List>
                    <List.Item>
                        <List.ItemStart>
                            <IconDropletExclamation size={16} />
                        </List.ItemStart>
                        Spis højt fedtindhold som avocado, olivenolie og nødder
                    </List.Item>
                    <List.Item>
                        <List.ItemStart>
                            <IconWheatOff size={16} />
                        </List.ItemStart>
                        Hold kulhydrater under 20-50g om dagen for at opretholde ketose
                    </List.Item>
                    <List.Item>
                        <List.ItemStart>
                            <IconMeat size={16} />
                        </List.ItemStart>
                        Moderat proteinindtag for at undgå for meget glukoseproduktion
                    </List.Item>
                    <List.Item>
                        <List.ItemStart>
                            <IconCandyOff size={16} />
                        </List.ItemStart>
                        Undgå sukker og stivelse (brød, pasta, ris, slik)
                    </List.Item>
                    <List.Item>
                        <List.ItemStart>
                            <IconSalt size={16} />
                        </List.ItemStart>
                        Hold øje med dine elektrolytter for at undgå "keto-influenza"
                    </List.Item>
                </List>
            </Card.Body>
        </Card>
    );
}
