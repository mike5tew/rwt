// This page adds a notice to the home page.  It will have a title, date, and content.  It will also have a link to the choir's facebook and instagram pages.

import React from 'react'
import { Container, Button } from '@mui/material';
import Grid2  from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
//import db from '../services/db';

import { Typography } from '@mui/material';
import { EmptyEventDetails, EventDetails } from '../types/types.d';
import { EventsUpcomingGET } from 'src/services/queries';




export default function AddNotice() {
    const [notices, setNotices] = React.useState<EventDetails[]>([]);
    
    React.useEffect(() => {
        const fetchEventsUpcoming = async () => {
            const events = await EventsUpcomingGET();
        const data = await EventsUpcomingGET();
        const notices = data.map(event => ({
            EventID: event.EventID,
            Location: event.Location,
            EventDate: event.EventDate,
            StartTime: event.StartTime,
            EndTime: event.EndTime,
            Price: event.Price,
            Title: event.Title,
            MeetingPoint: event.MeetingPoint,
            Invitation: event.Invitation,
            Playlist: event.Playlist || []
        }));
        
        setNotices(notices);
        console.log(notices);
        }
        fetchEventsUpcoming();
    }
    , []);




    return (
        <Container>
            <Grid2 container spacing={2}>
                {notices && notices.map((entry, index) => (
                    <Grid2 size={12} key={index}>
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
                    </Grid2>
                ))}
            </Grid2>
        </Container>
    )
}