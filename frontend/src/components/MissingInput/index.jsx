import { IconAlertCircle } from '@tabler/icons-react';
import { Alert } from "@material-tailwind/react";

export default function MissingInput({ errorMessage }) {
    return <>
        {errorMessage && (
            <Alert className="mt-5"
                size="s"
                variant="ghost">
                <Alert.Icon>
                    <IconAlertCircle className="h-5 w-5" />
                </Alert.Icon>
                <Alert.Content>{errorMessage}</Alert.Content>
            </Alert>
        )}
    </>
}
