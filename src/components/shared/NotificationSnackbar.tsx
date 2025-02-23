import { Snackbar } from '@mui/material';
import React from 'react';

interface NotificationSnackbarProps {
    open: boolean;
    message: string;
    onClose: () => void;
}

export const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({ open, message, onClose }) => {
    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        onClose();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            message={message}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
    );
};
