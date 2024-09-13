// This is just a flat page with a title and a message. It is an appeal to visitors to join the choir or suggest to friends who might be interested. It will have a link to the contact form.

import React from 'react';
import { Container } from 'react-bootstrap';
import { Grid, Button, Typography, Divider, Snackbar, TextField, Fade, Paper } from '@mui/material';
// import { Button } from 'reactstrap';
import { useForm, SubmitHandler, Controller, set } from 'react-hook-form';
import { Form, Link, useNavigate } from 'react-router-dom'; 
// Import useHistory
import { Padding } from '@mui/icons-material';
import { Message } from '../types/types.d';

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
        fetch('http://localhost:3001/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                // the message has been sent redirect to the home page
                console.log('Success:', data);
                 navigate('/'); // Redirect to the home page
                       })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    

    return (
        <form onSubmit={handleSubmit(FormSubmitHandler)}>
        <Grid container spacing={2}>
            <Grid item xs={12}   sx={{gap:2}}>
                <Paper>
                    <Typography variant="h3">{localStorage.getItem("AppealTitle")}</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sx={{gap:2}}>
                <Paper>
                    <Typography variant="h5">{localStorage.getItem("AppealText")}</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sx={{gap:2}}>
            <TextField
              label="Email Address"
              fullWidth
              value={watch('messageFrom') ? watch('messageFrom') : ''}
              rows={4}
              {...register('messageFrom')}
            />
            </Grid>
            <Grid item xs={12}  sx={{gap:2}}>
                        <TextField
              label="Event Report"
              fullWidth
              multiline
              value={watch('messageContent') ? watch('messageContent') : ''}
              rows={4}
              {...register('messageContent')}
            />
        </Grid>
        <Grid item xs={12}  sx={{gap:2}}>
         <Button type="submit" variant="contained">Submit</Button>
        </Grid>
        </Grid>
        </form>
    );
}