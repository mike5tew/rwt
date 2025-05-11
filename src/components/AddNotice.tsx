/**
 * Notice Management Component
 * Displays and manages upcoming events and notices
 * Allows users to add and view notices for the home page
 */
import React from 'react';
import { Container, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { EventDetails } from '../types/types.d';
import { EventsUpcomingGET } from 'src/services/queries';
import { NotificationSnackbar } from './shared/NotificationSnackbar';

export default function AddNotice() {
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState('');
    const history = useNavigate();

    
    /**
     * State to store upcoming events/notices
     */
    const [notices, setNotices] = React.useState<EventDetails[]>([]);
    
    /**
     * Fetch upcoming events on component mount
     */
    React.useEffect(() => {
        if (document.cookie.indexOf('role=administrator') === -1) { history('/Settings'); }        

        const fetchEventsUpcoming = async () => {
            EventsUpcomingGET().then((data) => {
                console.log(data);
                setNotices(data);
            }
            );
        }
        fetchEventsUpcoming();
    }, []);

    return (
        <Container>
            <Grid container spacing={2}>
                {notices && notices.map((entry, index) => (
                    <Grid item xs={12} key={index}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <Typography variant="h2" component="h2">
                                        {entry.Title}
                                    </Typography>
                                </Card.Title>
                                <Card.Text>{entry.EventDate.toDateString()}</Card.Text>
                                <Card.Text>{entry.Location}</Card.Text>
                                <Link to={`/AddNotice/${index}`}>
                                    <Button variant="contained">Read More</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Grid>
                ))}
            </Grid>
             <NotificationSnackbar
                            open={snackOpen}
                            message={snackMessage}
                            onClose={() => setSnackOpen(false)}
                        />
        </Container>
    );
}