//This page an email form for booking the choir for events. It will have fields for the name of the event, the date of the event, the location of the event, the time of the event, the type of event, the number of attendees, the contact person, the contact person's email, and the contact person's phone number. It will also have a submit button that will send the information to the choir's email address. It will also have a link to the choir's facebook and instagram pages.
import * as React from 'react';
import { Container } from 'react-bootstrap';
import { Button, TextField, Typography, Link, Paper } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { Message, EmptyMessage } from '../types/types.d';
// Divider, FormControl, InputLabel, Select, MenuItem, Paper, Snackbar, List, ListItem, ListItemText, ListSubheader, DialogProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Icon, ButtonGroup,  ListItemButton, colors
import { Snackbar } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TransitionProps } from '@mui/material/transitions';
import Fade from '@mui/material/Fade';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import { messagePOST } from 'src/services/queries';

const schema = yup.object().shape({
    eventname: yup.string().required(),
    eventdate: yup.date().required(),
    eventlocation: yup.string().required(),
    eventtime: yup.string().required(),
    eventtype: yup.string(),
    contactperson: yup.string().required(),
    contactemail: yup.string().email().required(),
    contactphone: yup.string(),
    message: yup.string(),
});

export default function BookingForm() {
    const { register, handleSubmit, control, formState: { errors }, watch } = useForm({
        resolver: yupResolver(schema),
    });
    const [SnackMessage, setSnackMessage] = React.useState('Message Sent');
    const [open, setOpen] = React.useState(false);
    const [openError, setOpenError] = React.useState(false);
    const [state, setState] = React.useState<{
        open: boolean;
        Transition: React.ComponentType<TransitionProps & { children: React.ReactElement<any, any>; }>;
    }>({
        open: false,
        Transition: Fade,
    });

    const handleClick = () => {
        setState({
            ...state,
            open: true,
        });
        clearForm();
    };

    const handleClickError = () => {
        setOpenError(true);
    }

    const clearForm = () => {
        // clear the form
        (document.getElementById("bookingform") as HTMLFormElement)?.reset();
    }        

    const onSubmit = () => {
        // create a message object from the form data
        // checking that the form is valid
        if (errors.eventname || errors.eventdate || errors.eventlocation || errors.eventtime || errors.eventtype || errors.contactperson || errors.contactemail) {
            return;
        }
        var Message: Message = EmptyMessage();
        Message.EventName = watch('eventname');
        var DateObj = new Date(watch('eventdate'));
        // convert the date to a string in mySQL format
        Message.EventDate = DateObj.toISOString().slice(0, 19).replace('T', ' ');
        Message.EventLocation = watch('eventlocation');
        Message.EventTime = watch('eventtime');
        Message.EventName = watch('eventname');
        Message.ContactEmail = watch('contactemail');
        Message.ContactPhone = watch('contactphone') || '';
        Message.MessageContent = watch('message') || '';
        Message.MessageFrom = watch('contactperson');
        //console.log(Message);
        messagePOST(Message).then((data) => {
            if (data.MessageContent === 'message sent') {
                console.log(data);
                handleClick();
            } else {
                handleClickError();
            }
        }
        );
    }

    return (
        <form id="bookingform" onSubmit={handleSubmit(onSubmit)}>
            <Container>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <Paper>
                            <Typography variant="h2">{localStorage.getItem("BookingTitle")}</Typography>
                            <Typography variant="h6">{localStorage.getItem("BookingText")}</Typography>
                        </Paper>
                    </Grid2>
                    <Grid2 size={6}>

                        <TextField
                            label="Event Name"
                            fullWidth
                            {...register('eventname')}
                            error={errors.eventname ? true : false}
                            helperText={errors.eventname ? errors.eventname.message : ''}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="Event Location"
                            fullWidth
                            {...register('eventlocation')}
                            error={errors.eventlocation ? true : false}
                            helperText={errors.eventlocation ? errors.eventlocation.message : ''}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            type="date"
                            fullWidth
                            {...register('eventdate')}
                            error={errors.eventdate ? true : false}
                            helperText={errors.eventdate ? errors.eventdate.message : ''}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="Event Time"
                            fullWidth
                            {...register('eventtime')}
                            error={errors.eventtime ? true : false}
                            helperText={errors.eventtime ? errors.eventtime.message : ''}
                        />

                    </Grid2>
                    <Grid2 size={6}>

                        <TextField
                            label="Event Type"
                            fullWidth
                            {...register('eventtype')}
                            error={errors.eventtype ? true : false}
                            helperText={errors.eventtype ? errors.eventtype.message : ''}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="Contact Person"
                            fullWidth
                            {...register('contactperson')}
                            error={errors.contactperson ? true : false}
                            helperText={errors.contactperson ? errors.contactperson.message : ''}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="Contact Email"
                            fullWidth
                            {...register('contactemail')}
                            error={errors.contactemail ? true : false}
                            helperText={errors.contactemail ? errors.contactemail.message : ''}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="Contact Phone"
                            fullWidth
                            {...register('contactphone')}
                            error={errors.contactphone ? true : false}
                            helperText={errors.contactphone ? errors.contactphone.message : ''}
                        />

                    </Grid2>
                    <Grid2 size={12}>
                        <TextField
                            label="Message"
                            fullWidth
                            {...register('message')}
                            multiline
                            rows={4}
                            error={errors.message ? true : false}
                            helperText={errors.message ? errors.message.message : ''}
                        />
                    </Grid2>
                    <Grid2 size={12} paddingBottom={2}>

                        <Button variant="contained" type="submit">Submit</Button>

                    </Grid2 >

                    <Typography variant="h5">Follow Us  </Typography>&nbsp;&nbsp;
                    {/* // add the icons for facebook and instagram */}


                    <Link href="https://www.facebook.com/RWTSingers2" target="_blank">
                        <FacebookIcon />
                    </Link>&nbsp;&nbsp;
                    <Link href="https://www.instagram.com" target="_blank">
                        <InstagramIcon />
                    </Link>

                    <Snackbar
                        open={open}
                        autoHideDuration={6000}
                        onClose={() => setOpen(false)}
                        TransitionComponent={Fade}
                        message={SnackMessage}
                    />
                </Grid2>
            </Container>
        </form>
    );
}
