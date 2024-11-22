import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Typography, Divider, Paper, Snackbar, TextField, Fade, Box } from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Import Grid2
import { purple } from '@mui/material/colors';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { EventDetails, EmptyEventDetails } from '../types/types.d';
import { useNavigate } from 'react-router-dom';
import { EventPOST } from '../services/queries';

const ColorButton = styled(Button)({
    color: 'white',
    backgroundColor: purple[500],
    '&:hover': {
        backgroundColor: purple[700],
    },
});

const schema = yup.object().shape({
    Title: yup.string().required("Title is required"),
    Location: yup.string().required("Location is required"),   
    EventDate: yup.date().required("Event Date is required"),
    StartTime: yup.string().required("Start Time is required"),
    EndTime: yup.string().required("End Time is required"),   
    MeetingPoint: yup.string().required("Meeting Point is required"),
    Price: yup.string(),
    Invitation: yup.string().required("Invitation is required")
  });

type EventFormValues = Omit<EventDetails, 'MeetingPoint'> & { MeetingPoint: string };

export default function EventAdd() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [snackOpen, setSnackOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [state, setState] = useState<{
        open: boolean;
        Transition: typeof Fade;
    }>({
        open: false,
        Transition: Fade,
    });

    const handleClick = () => {
        setSnackOpen(true);
        setState({
            ...state,
            open: true,
        });
        (document.getElementById("NewEvent") as HTMLFormElement)?.reset();
    };

    const handleClose = () => {
        setSnackOpen(false);
    };

    const handleCloseError = () => {
        setOpenError(false);
    };

    const history = useNavigate();
    if (document.cookie === '') {
        console.log('No cookie');
        history('/Members');
    }

    const onSubmit = () => {
        const newEvent: EventDetails = {
            ...EmptyEventDetails(),
            Title: watch('Title'),
            Location: watch('Location'),
            DateString: new Date(watch('EventDate')).toISOString().slice(0, 19).replace('T', ' '),
            StartTime: watch('StartTime'),
            EndTime: watch('EndTime'),
            Price: watch('Price') || '',
            MeetingPoint: watch('MeetingPoint'),
            Invitation: watch('Invitation')
        };

        EventPOST(newEvent).then((res) => {
            if (res.Title === "Event Added") {
                handleClick();
            } else {
                setOpenError(true);
            }
        });
    };

    return (
        <Box>
            <form id="NewEvent" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h2" align="center" gutterBottom>Add Event</Typography>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <TextField
                            id="Title" required
                            label="Title"
                            fullWidth
                            {...register("Title")}
                            error={!!errors.Title}
                            helperText={errors.Title?.message}
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        <TextField
                            id="Location" required
                            label="Location"
                            fullWidth
                            {...register("Location")}
                            error={!!errors.Location}
                            helperText={errors.Location?.message}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            type="date"
                            fullWidth
                            {...register('EventDate')}
                            error={!!errors.EventDate}
                            helperText={errors.EventDate?.message}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            id="StartTime"
                            label="Start Time"
                            fullWidth
                            {...register("StartTime")}
                            error={!!errors.StartTime}
                            helperText={errors.StartTime?.message}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            id="EndTime"
                            label="End Time"
                            fullWidth
                            {...register("EndTime")}
                            error={!!errors.EndTime}
                            helperText={errors.EndTime?.message}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            id="Price"
                            label="Price"
                            fullWidth
                            {...register("Price")}
                            error={!!errors.Price}
                            helperText={errors.Price?.message}
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        <TextField
                            id="MeetingPoint"
                            label="Meeting Point"
                            fullWidth
                            {...register("MeetingPoint")}
                            error={!!errors.MeetingPoint}
                            helperText={errors.MeetingPoint?.message}
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        <TextField
                            id="Invitation"
                            label="Invitation message"
                            fullWidth
                            {...register("Invitation")}
                            error={!!errors.Invitation}
                            helperText={errors.Invitation?.message}
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        <Divider />
                    </Grid2>
                    <Grid2 size={12}>
                        <ColorButton variant="contained" type="submit">
                            Save Changes
                        </ColorButton>
                    </Grid2>
                </Grid2>
            </form>
            <Snackbar
                open={snackOpen}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Your updates have been saved"
            />
            <Snackbar
                open={openError}
                autoHideDuration={6000}
                onClose={handleCloseError}
                message="There was an error saving your updates"
            />
        </Box>
    );
}