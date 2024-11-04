// This page allows the admin to add an event to the database.  The event will have a title, a date, a description, and a picture.  The picture will be uploaded to the server and the filename will be stored in the database.  The event will be displayed on the home page of the website.
// There will be a Select to display all of the events so that you can edit existing ones and add images and reports.  This way the infomration added on this page can act as a Notice and an archive entry

import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Typography, Link, Divider, Paper, Snackbar, TextField, Fade, Box } from '@mui/material';
import  Grid  from '@mui/material/Grid2';
import { purple } from '@mui/material/colors';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TransitionProps } from '@mui/material/transitions';
import { ImageDetail, EmptyImageDetail, IsMobile, EventDetails, DatetoString, EmptyEventDetails } from '../types/types.d';
import { LocalizationProvider, DatePicker, TimePicker as MuiTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import { useNavigate } from 'react-router-dom';
import {EventPOST} from '../services/queries';

const ColorButton = styled(Button)({
    color: 'white',
    backgroundColor: purple[500],
    '&:hover': {
        backgroundColor: purple[700],
    },
    });

const schema = yup.object().shape({ 
    title: yup.string().required("Title is required"),
    location: yup.string().required("Location is required"),
    eventDate: yup.date().required("Event Date is required"),
    startTime: yup.string().required("Start Time is required"),
    endTime: yup.string().required("End Time is required"),
    meetingPoint: yup.string().required("Meeting Point is required"),
    price: yup.string().required("Price is required"),
    invitation: yup.string().required("Invitation is required")
    
});


export default function EventAdd() {
    const { register, setValue, watch, getValues, handleSubmit, control, formState: { errors } } = useForm<EventDetails>({
        defaultValues: {
            Title: "",
            Location: "",
            EventDate: new Date(),
            StartTime: "",
            EndTime: "",
            MeetingPoint: "",
            Price: "",
            Invitation: "",
        },
    });

    const todaysDate = new Date();
    const todayString = todaysDate.getFullYear() + "-" + (todaysDate.getMonth() + 1) + "-" + todaysDate.getDate();
    const [evDate , setEvDate] = useState<Dayjs | null>(dayjs(todayString));
    const [snackOpen, setSnackOpen] = useState(false);
    const [open, setOpen] = useState(false);
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
            setOpen(true);
            console.log(open);
            // reset the form
            setValue("Title", "");
            setValue("Location", "");
            setValue("EventDate", new Date());
            setValue("Invitation", "");
            setValue("StartTime", "");
            setValue("EndTime", "");
            setValue("MeetingPoint", "");
            setValue("Price", "");  
    };

    const handleClose = () => {
        setSnackOpen(false);
    };

    const handleCloseError = () => {
        setOpenError(false);
    };

    const handleCloseTransition = () => {
        setState({
            ...state,
            open: false
        });
    };
    const history = useNavigate();
    if (document.cookie === '') {
        console.log('No cookie');
        history('/Members');
    }


    // const handleTransition = (Transition: React.ComponentType<TransitionProps>) => () => {
    //     setState({
    //         open: true,
    //         Transition,
    //     });
    // };

    const onSubmit: SubmitHandler<EventDetails> = data => {
        if (evDate === null) {
            return;
        } 
        // convert the daysjs date to a date object
        var evDt = evDate.toDate();
        var eventDate = DatetoString(evDt);
        var newEvent: EventDetails = EmptyEventDetails();
        newEvent.Title= data.Title;
        newEvent.Location= data.Location;
        newEvent.EventDate= evDt;
        newEvent.StartTime= data.StartTime;
        newEvent.EndTime= data.EndTime;
        newEvent.Price= data.Price;
        newEvent.MeetingPoint= data.MeetingPoint;
        newEvent.Invitation= data.Invitation;

        EventPOST(newEvent).then((res) => {
        if (res=== "Values Inserted")   {
            handleClick();
        } else {
            setOpenError(true);
        }
    }
    );


    };

    return (
        <Box>
            <Typography variant="h2" align="center" gutterBottom>Add Event</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid size={12} >
                        <TextField
                            id="title" required
                            label="Title"
                            
                            value = {watch("Title")}
                            fullWidth
                            {...register("Title")}
                            error={errors.Title ? true : false}
                            helperText={errors.Title ? errors.Title.message : ""}
                        />
                    </Grid>
                    <Grid size={12} >
                        <TextField
                            id="location" required
                            label="Location"
                            
                            value = {watch("Location")}
                            fullWidth
                            {...register("Location")}
                            error={errors.Title ? true : false}
                            helperText={errors.Title ? errors.Title.message : ""}
                        />
                    </Grid>
                    <Grid size={6} >
                    <Controller name="EventDate" control={control} render={({ field: { ref, name, ...field }}) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb' >
                     <DatePicker label="Event Date" value={evDate} 
                     onChange={(newValue) => setEvDate(newValue)}  />
                    <div style={{ color: "red" }}>{errors.EventDate?.message}</div>
                  </LocalizationProvider>
                )} />

                    </Grid>
                    <Grid size={6} >
                        <TextField
                            id="startTime"
                            label="Start Time"
                            
                            fullWidth
                            {...register("StartTime")}
                            error={errors.StartTime ? true : false}
                            helperText={errors.StartTime ? errors.StartTime.message : ""}
                        />
                    </Grid>
                    <Grid size={6} >
                        <TextField
                            id="endTime"
                            label="End Time"
                            
                            fullWidth
                            {...register("EndTime")}
                            error={errors.EndTime ? true : false}
                            helperText={errors.EndTime ? errors.EndTime.message : ""}
                        />
                    </Grid>
                    <Grid size={6} >
                        <TextField
                            id="price"
                            label="price"
                            
                            fullWidth
                            {...register("Price")}
                            error={errors.EndTime ? true : false}
                            helperText={errors.EndTime ? errors.EndTime.message : ""}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            id="meetingPoint"
                            label="Meeting Point"
                            
                            fullWidth
                            {...register("MeetingPoint")}
                            error={errors.MeetingPoint ? true : false}
                            helperText={errors.MeetingPoint ? errors.MeetingPoint.message : ""}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            id="invitation"
                            label="Invitation message"
                            
                            fullWidth
                            {...register("Invitation")}
                            error={errors.MeetingPoint ? true : false}
                            helperText={errors.MeetingPoint ? errors.MeetingPoint.message : ""}
                        />
                    </Grid>

                    <Grid size={12}>
                        <Divider />
                    </Grid>
                    <Grid size={12}>
                        <ColorButton variant="contained" type="submit">
                            Save Changes
                        </ColorButton>
                    </Grid>
                </Grid>
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

