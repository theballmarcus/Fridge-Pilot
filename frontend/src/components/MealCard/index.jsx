import { useEffect } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { IconGrillFork } from '@tabler/icons-react';
import axios from 'axios';
import { getToken } from "../../utils/Session";

export default function HorizontalCard() {
    const token = getToken();

    const mealOfDay = 'morgenmad';

    useEffect(() => {
        const date = new Date().getTime();
        axios.get(`http://localhost:8080/api/diet/mealplan/${ date }`, {
            date
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(result => {
            if (result.status === 200) {
                console.log(result);
            }
        });
    }, []);

    return (
        <Card className="flex h-full w-full max-w-[48rem] flex-row">
            <Card.Header className="m-0 h-full w-2/5 shrink-0 rounded-r-none">
                <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                    alt="card-image"
                    className="h-full w-full object-cover"
                />
            </Card.Header>
            <Card.Body className="p-4">
                <Typography
                    type="small"
                    className="mb-4 font-bold uppercase text-foreground"
                >
                    {mealOfDay}
                </Typography>
                <Typography type="h5" className="mb-2">
                    Klam vegansk mad
                </Typography>
                <Typography className="mb-8 text-foreground">
                    Her skal vi vise kcal, kulhydrater, protein, fedt med deres farvekodning og ikon
                    <br/>
                    Vi skal også vise tid i alt, indkøbstid, pris og manglende ingredienser
                </Typography>
                <Button className="mb-2 flex w-fit items-center gap-2">
                    <IconGrillFork />
                    Se opskrift
                </Button>
            </Card.Body>
        </Card>
    );
}
