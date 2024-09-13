// This page displays messages that have been sent to the choir.  It will have a title, date, and content.  It will also allow these messages to be marked as read or deleted.

import React from 'react';
import { Container, Grid, Button, Typography, Divider, Paper, Snackbar } from '@mui/material';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message } from '../types/types.d';
// form detail from react hook form

export default function ViewMessages() {
    const history = useNavigate();
    const [Snackopen, setSnackOpen] = useState(false);
    const [SnackMessage, setSnackMessage] = useState('');
    const [action, setAction] = useState(<></>);
    const handleClose = () => {
      setSnackOpen(false);
    };
    // messages is the state containg an initial empty array of messages
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (document.cookie === '') {
            console.log('No cookie');
            history('/Members');
        }
    
        fetch('http://localhost:3001/messages')
            .then(response => response.json())
            .then(data => setMessages(data));
    }, []);

    function deleteMessage(messageID: number) {
        fetch(`http://localhost:3001/messages/${messageID}`, {
            method: 'DELETE',
        })
            .then(() => {
                setMessages(messages.filter((message) => message.messageID !== messageID));
                setSnackMessage('Message Deleted');
                setSnackOpen(true);


            })
            .catch((error) => {
                console.log(error);
            });
    }

    const stringToDate = (dateString: string) => {
        //this takes a timestamp output from the database and converts it to a date string
        const date = new Date(dateString);
        return date.toDateString();
    }

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                        <Typography variant="h3">Messages</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                {messages.map((message) => (
                    <>
                    <Grid item xs={10} key={message.messageID}>
                        <Card>
                            <Card.Body>
                                <Card.Subtitle className="mb-2 text-muted">{stringToDate(message.messageDate)}</Card.Subtitle>
                                <Card.Title>{message.messageFrom}</Card.Title>
                                <Card.Text>{message.messageContent}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Grid>
                        <Grid item xs={12}>
                            <Button onClick={() => deleteMessage(message.messageID)} variant="contained">Delete</Button>
                    </Grid>
                    </>
                ))}
            </Grid>
            <Snackbar
                open={Snackopen}
                autoHideDuration={6000}
                onClose={handleClose}
                message={SnackMessage}
                action={action}
            />
        </Container>
    );
}