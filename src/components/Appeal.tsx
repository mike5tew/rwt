// This is just a flat page with a title and a message. It is an appeal to visitors to join the choir or suggest to friends who might be interested. It will have a link to the contact form.

import React from 'react';
import { Button, Typography, Divider, Snackbar, TextField, Fade, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
// import { Button } from 'reactstrap';
import { useForm, SubmitHandler, Controller, set } from 'react-hook-form';
import { Form, Link, useNavigate } from 'react-router-dom'; 
// Import useHistory
import { Message } from '../types/types.d';
import db from '../services/db';
export default function Appeal() {
    const { register, handleSubmit, watch, setValue } = useForm<Message>(
        {
            defaultValues: {
                messageID: 0,
                messageFrom: '',
                messageContent: '',
                messageDate: '',
            },
        }
    );
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');

   const navigate = useNavigate(); // Create a history object

    function FormSubmitHandler(data: Message) {
        //console.log(data);
        // Is the email address valid?
        if (!data.messageFrom.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }
        // Is the message content valid?
        if (data.messageContent.length < 1) {
            alert('Please enter a message');
            return;
        }
        var dt = new Date();
        // Format the date
        var sDate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        // Add the message to the database
        db.query('INSERT INTO messages SET messageDate = ?, messageFrom = ?, messageContent = ?', [sDate, data.messageFrom, data.messageContent], (err: any) => {
            if (err) {
                console.log(err);
                setAlertMessage('Error: ' + err.message);
                setAlertOpen(true);
            } else {
                setAlertMessage('Message sent');
                setAlertOpen(true);
                // Clear the form
                setValue('messageFrom', '');
                setValue('messageContent', '');
            }
        }
        );
    }


  


    

    return (
        <form onSubmit={handleSubmit(FormSubmitHandler)}>
        <Grid container spacing={2}>
            <Grid size={12}   sx={{gap:2}}>
                <Paper>
                    <Typography variant="h3">{localStorage.getItem("AppealTitle")}</Typography>
                </Paper>
            </Grid>
            <Grid size={12} sx={{gap:2}}>
                <Paper>
                    <Typography variant="h5">{localStorage.getItem("AppealText")}</Typography>
                </Paper>
            </Grid>
            <Grid size={12} sx={{gap:2}}>
            <TextField
              label="Email Address"
              fullWidth
              value={watch('messageFrom') ? watch('messageFrom') : ''}
              rows={4}
              {...register('messageFrom')}
            />
            </Grid>
            <Grid size={12}  sx={{gap:2}}>
                        <TextField
              label="Event Report"
              fullWidth
              multiline
              value={watch('messageContent') ? watch('messageContent') : ''}
              rows={4}
              {...register('messageContent')}
            />
        </Grid>
        <Grid size={12}  sx={{gap:2}}>
         <Button type="submit" variant="contained">Submit</Button>
        </Grid>
        </Grid>
        <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={() => setAlertOpen(false)}
            TransitionComponent={Fade}
            message={alertMessage}
        />
        </form>
    );
}