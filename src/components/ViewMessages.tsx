// This page displays Messages that have been sent to the choir.  It will have a title, date, and content.  It will also allow these Messages to be marked as read or deleted.

import { Container, Button, Typography, Divider, Paper, Snackbar } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message } from '../types/types.d';
import { messageDELETE, messagesGET } from '../services/queries';
// form detail from react hook form

export default function ViewMessages() {
    const history = useNavigate();
    const [Snackopen, setSnackOpen] = useState(false);
    const [SnackMessage, setSnackMessage] = useState('');
    const [action, setAction] = useState(<></>);
    const handleClose = () => {
        setSnackOpen(false);
    };
    // Messages is the state containg an initial empty array of Messages
    const [Messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (document.cookie === '') {
            console.log('No cookie');
            history('/Members');
        }
        messagesGET().then((data) => {
            setMessages(data);
        }
        ).catch((error) => {
            console.log(error);
        });

    }, []);

    function deleteMessage(MessageID: number) {
        messageDELETE(MessageID).then(() => {
            setMessages(Messages.filter((Message) => Message.MessageID !== MessageID));
            setSnackMessage('Message Deleted');
            setSnackOpen(true);
        }
        ).catch((error) => {
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
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <Paper>
                        <Typography variant="h3">Messages</Typography>
                    </Paper>
                </Grid2>
                <Grid2 size={12}>
                    <Divider />
                </Grid2>
                {Messages.map((Message) => (
                    <>
                        <Grid2 size={10} key={Message.MessageID}>
                            <Card>
                                <Card.Body>
                                    <Card.Subtitle className="mb-2 text-muted">{stringToDate(Message.MessageDate)}</Card.Subtitle>
                                    <Card.Title>{Message.MessageFrom}</Card.Title>
                                    <Card.Text>{Message.MessageContent}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Grid2>
                        <Grid2 size={12}>
                            <Button onClick={() => deleteMessage(Message.MessageID)} variant="contained">Delete</Button>
                        </Grid2>
                    </>
                ))}
            </Grid2>
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