//This page an email form for booking the choir for events. It will have fields for the name of the event, the date of the event, the location of the event, the time of the event, the type of event, the number of attendees, the contact person, the contact person's email, and the contact person's phone number. It will also have a submit button that will send the information to the choir's email address. It will also have a link to the choir's facebook and instagram pages.
import * as React from 'react';

import { styled } from '@mui/material/styles';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, TextField, Typography, Link, Grid, Paper } from '@mui/material';
// Divider, FormControl, InputLabel, Select, MenuItem, Paper, Snackbar, List, ListItem, ListItemText, ListSubheader, DialogProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Icon, ButtonGroup,  ListItemButton, colors

import { purple } from '@mui/material/colors';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// import { Email } from '@mui/icons-material';
// import { Send } from '@mui/icons-material';
// import { Alert } from '@mui/material';
import { EmailJSResponseStatus, init } from 'emailjs-com';
import emailjs from 'emailjs-com';
import { TransitionProps } from '@mui/material/transitions';
import Fade from '@mui/material/Fade';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

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

    const [open, setOpen] = React.useState(false);
    const [openError, setOpenError] = React.useState(false);
    const [state, setState] = React.useState<{
        open: boolean;
        Transition: React.ComponentType<TransitionProps & {children: React.ReactElement<any, any>;}>;
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
        <form onSubmit={handleSubmit(onSubmit)}>
        <Container>
            <Paper>
            <Typography variant="h4">{localStorage.getItem("BookingTitle")}</Typography>
            <Typography variant="h6">{localStorage.getItem("BookingText")}</Typography>
            </Paper>
            <Grid container spacing={2}>
            <Grid item xs={6}>
                
                        <TextField
                            label="Event Name"
                            fullWidth
                            {...register('eventname')}
                            error={errors.eventname ? true : false}
                            helperText={errors.eventname ? errors.eventname.message : ''}
                        />
                        </Grid>
                                  <Grid item xs={6}> 
                                  <TextField
                            label="Event Location"
                            fullWidth
                            {...register('eventlocation')}
                            error={errors.eventlocation ? true : false}
                            helperText={errors.eventlocation ? errors.eventlocation.message : ''}
                        />
                        </Grid>
                       <Grid item xs={6}>   
                       <TextField
                            type="date"
                            fullWidth
                            {...register('eventdate')}
                            error={errors.eventdate ? true : false}
                            helperText={errors.eventdate ? errors.eventdate.message : ''}
                        />
                      
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                            type="time"
                            fullWidth
                            {...register('eventtime')}
                            error={errors.eventtime ? true : false}
                            helperText={errors.eventtime ? errors.eventtime.message : ''}
                        />
                        
                        </Grid>
                       <Grid item xs={6}>
                        
                        <TextField
                            label="Event Type"
                            fullWidth
                            {...register('eventtype')}
                            error={errors.eventtype ? true : false}
                            helperText={errors.eventtype ? errors.eventtype.message : ''}
                        />
                        </Grid>
                          <Grid item xs={6}>    
                        <TextField
                            label="Contact Person"
                            fullWidth
                            {...register('contactperson')}
                            error={errors.contactperson ? true : false}
                            helperText={errors.contactperson ? errors.contactperson.message : ''}
                        />
                        
                        </Grid>
                       <Grid item xs={6}>
                        
                        <TextField
                            label="Contact Email"
                            fullWidth
                            {...register('contactemail')}
                            error={errors.contactemail ? true : false}
                            helperText={errors.contactemail ? errors.contactemail.message : ''}
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                            label="Contact Phone"
                            fullWidth
                            {...register('contactphone')}
                            error={errors.contactphone ? true : false}
                            helperText={errors.contactphone ? errors.contactphone.message : ''}
                        />
                        
                        </Grid>
                       <Grid item xs={12} paddingBottom={2}>
                        
                        <ColorButton variant="contained" type="submit">Submit</ColorButton>
                        
                        </Grid >
                
                    <Typography variant="h5">Follow Us  </Typography>&nbsp;&nbsp;
                    {/* // add the icons for facebook and instagram */}
                    

                    <Link href="https://www.facebook.com/RWTSingers2" target="_blank">
                        <FacebookIcon />
                            </Link>&nbsp;&nbsp;
                    <Link href="https://www.instagram.com" target="_blank">
                        <InstagramIcon />
                    </Link>
                
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
            </Grid>
        </Container>
            </form>
    );
}
