// This is just a flat page with a title and a Message. It is an appeal to visitors to join the choir or suggest to friends who might be interested. It will have a link to the contact form.

import React from 'react';
import { Button, Typography, Snackbar, TextField, Fade, Paper } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
// import { Button } from 'reactstrap';
import { useForm, SubmitHandler, Controller, set } from 'react-hook-form';
import { Form, Link, useNavigate } from 'react-router-dom'; 
// Import useHistory
import { Message } from '../types/types.d';
import { messagePOST } from '../services/queries';
// import db from '../services/db';
export default function Appeal() {
    const { register, handleSubmit, watch, setValue } = useForm<Message>(
        {
            defaultValues: {
                MessageID: 0,
                MessageFrom: '',
                MessageContent: '',
                MessageDate: '',
            },
        }
    );
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');

   const navigate = useNavigate(); // Create a history object

    function FormSubmitHandler(data: Message) {
        //console.log(data);
        // Is the email address valid?
        if (!data.MessageFrom.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }
        // Is the Message content valid?
        if (data.MessageContent.length < 1) {
            alert('Please enter a Message');
            return;
        }
        var dt = new Date();
        // Format the date
        var sDate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        data.MessageDate = sDate;
        // Add the Message to the database
        messagePOST(data).then(() => {
            // Redirect to the home page
            navigate('/');
            setAlertMessage('Message sent');
            setAlertOpen(true);
            // Clear the form
            setValue('MessageFrom', '');
            setValue('MessageContent', '');
        }).catch((error: string) => {
            setAlertMessage('Error: ' + error);
            setAlertOpen(true);
        }
        );
    }

    return (
        <form onSubmit={handleSubmit(FormSubmitHandler)}>
        <Grid2 container spacing={2}>
            <Grid2 size={12}>
                <Paper>
                    <Typography variant="h3">{localStorage.getItem("AppealTitle")}</Typography>
                </Paper>
            </Grid2 >
            <Grid2 size={12} sx={{gap:2}}>
                <Paper>
                    <Typography variant="h5">{localStorage.getItem("AppealText")}</Typography>
                </Paper>
            </Grid2 >
            <Grid2 size={12} sx={{gap:2}}>
            <TextField
              label="Email Address"
              fullWidth
              value={watch('MessageFrom') ? watch('MessageFrom') : ''}
              rows={4}
              {...register('MessageFrom')}
            />
            </Grid2 >
            <Grid2 size={12}  sx={{gap:2}}>
                        <TextField
              label="Event Report"
              fullWidth
              multiline
              value={watch('MessageContent') ? watch('MessageContent') : ''}
              rows={4}
              {...register('MessageContent')}
            />
        </Grid2 >
        <Grid2 size={12}  sx={{gap:2}}>
         <Button type="submit" variant="contained">Submit</Button>
        </Grid2 >
        </Grid2 >
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