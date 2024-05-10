//This page an email form for booking the choir for events. It will have fields for the name of the event, the date of the event, the location of the event, the time of the event, the type of event, the number of attendees, the contact person, the contact person's email, and the contact person's phone number. It will also have a submit button that will send the information to the choir's email address. It will also have a link to the choir's facebook and instagram pages.
import React from 'react';
import {useState} from 'react'; 
import {useEffect} from 'react';
import { styled } from '@mui/material/styles';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, TextField, Typography, Link, Divider, FormControl, InputLabel, Select, MenuItem, Paper, Snackbar, List, ListItem, ListItemText, ListSubheader, DialogProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Icon, ButtonGroup,  ListItemButton, colors } from '@mui/material';
import { purple } from '@mui/material/colors';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Email } from '@mui/icons-material';
import { Send } from '@mui/icons-material';
import { Alert } from '@mui/material';
import { EmailJSResponseStatus, init } from 'emailjs-com';
import emailjs from 'emailjs-com';
import { TransitionProps } from '@mui/material/transitions';
import Fade from '@mui/material/Fade';


const ColorButton = styled(Button)({
    color: 'white',
    backgroundColor: purple[500],
    '&:hover': {
        backgroundColor: purple[700],
    },
    });

const schema = yup.object().shape({
    eventname: yup.string().required(),
    eventdate: yup.date().required(),
    eventlocation: yup.string().required(),
    eventtime: yup.string().required(),
    eventtype: yup.string().required(),
    eventattendees: yup.number().required(),
    contactperson: yup.string().required(),
    contactemail: yup.string().email().required(),
    contactphone: yup.string().required(),
});

export default function BookingForm () {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [state, setState
        
    ] = useState<{
        open: boolean;
        Transition: React.ComponentType<
          TransitionProps & {children: React.ReactElement<any, any>;}
        >;
      }>({
        open: false,
        Transition: Fade,
      });
    const handleClick = () => {
        setOpen(true);
    };

    // const handleClose = () => {
    //     setState({
    //       ...state,
    //       open: false,
    //     });
    //   };
    
    const handleClickError = () => {
        setOpenError(true);
    };

    // const handleCloseError = () => {
    //     setState({
    //         ...state,
    //         open: false,
    //       });
    //     };

        
    const onSubmit = (data: any) => {
        console.log(data);
        emailjs.send('service_9zv0w7m', 'template_9zv0w7m', data, 'user_9zv0w7m')
            .then((result: EmailJSResponseStatus) => {
                console.log(result.text);
                handleClick();
            }, (error) => {
                console.log(error.text);
                handleClickError();
            });
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Typography variant="h4">Booking Form</Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            label="Event Name"
                            fullWidth
                            {...register('eventname')}
                            error={errors.eventname ? true : false}
                            helperText={errors.eventname ? errors.eventname.message : ''}
                        />
                        <TextField
                            label="Event Date"
                            type="date"
                            fullWidth
                            {...register('eventdate')}
                            error={errors.eventdate ? true : false}
                            helperText={errors.eventdate ? errors.eventdate.message : ''}
                        />
                        <TextField
                            label="Event Location"
                            fullWidth
                            {...register('eventlocation')}
                            error={errors.eventlocation ? true : false}
                            helperText={errors.eventlocation ? errors.eventlocation.message : ''}
                        />
                        <TextField
                            label="Event Time"
                            type="time"
                            fullWidth
                            {...register('eventtime')}
                            error={errors.eventtime ? true : false}
                            helperText={errors.eventtime ? errors.eventtime.message : ''}
                        />
                        <TextField
                            label="Event Type"
                            fullWidth
                            {...register('eventtype')}
                            error={errors.eventtype ? true : false}
                            helperText={errors.eventtype ? errors.eventtype.message : ''}
                        />
                        <TextField
                            label="Number of Attendees"
                            type="number"
                            fullWidth
                            {...register('eventattendees')}
                            error={errors.eventattendees ? true : false}
                            helperText={errors.eventattendees ? errors.eventattendees.message : ''}
                        />
                        <TextField
                            label="Contact Person"
                            fullWidth
                            {...register('contactperson')}
                            error={errors.contactperson ? true : false}
                            helperText={errors.contactperson ? errors.contactperson.message : ''}
                        />
                        <TextField
                            label="Contact Email"
                            fullWidth
                            {...register('contactemail')}
                            error={errors.contactemail ? true : false}
                            helperText={errors.contactemail ? errors.contactemail.message : ''}
                        />
                        <TextField
                            label="Contact Phone"
                            fullWidth
                            {...register('contactphone')}
                            error={errors.contactphone ? true : false}
                            helperText={errors.contactphone ? errors.contactphone.message : ''}
                        />
                        <ColorButton variant="contained" type="submit">Submit</ColorButton>
                    </form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Typography variant="h4">Follow Us</Typography>
                    <Link href="https://www.facebook.com" target="_blank">Facebook</Link>
                    <Link href="https://www.instagram.com" target="_blank">Instagram</Link>
                </Col>
            </Row>
            {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Booking submitted successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="error">
                    Error submitting booking!
                </Alert>    
            </Snackbar> */}
        </Container>
    );
}

