// This page adds a notice to the home page.  It will have a title, date, and content.  It will also have a link to the choir's facebook and instagram pages.

import React from 'react'
import { styled } from '@mui/material/styles';  
import { Container, Button } from '@mui/material';
import Grid  from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import db from '../services/db';

import { Typography } from '@mui/material';
import { EmptyEventDetails, EventDetails } from '../types/types.d';




export default function AddNotice() {
    
    const [notices, setNotices] = React.useState<EventDetails[]>([]);
    React.useEffect(() => {

        //eventID, location, eventDate, startTime, endTime, price, title, meetingPoint, invitation
        db.query('SELECT * FROM choirevents WHERE eventDate > NOW() ORDER BY eventDate ASC')
        fetch('http://localhost:3001/notices')
        .then(response => response.json())
        .then(data => {
            var notices: EventDetails[] = [];
            for (let i = 0; i < data.length; i++) {
                var ev: EventDetails = EmptyEventDetails();
                ev.eventID= data[i].EventID;
                ev.location= data[i].Location;
                ev.eventDate= data[i].EventDate;
                ev.startTime= data[i].StartTime;
                ev.endTime= data[i].EndTime;
                ev.price= data[i].Price;
                ev.title= data[i].Title;
                ev.meetingPoint= data[i].MeetingPoint;
                ev.invitation= data[i].Invitation;
                notices.push(ev);
            }
            setNotices(data);
        })
        .catch((error) => {
            console.log(error);
        })
    }, [])



    return (
        <Container>
            <Grid container spacing={2}>
                {notices && notices.map((entry, index) => (
                    <Grid size={12} key={index}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <Typography variant="h2" component="h2">
                                        {entry.title}
                                    </Typography>
                                </Card.Title>
                                <Card.Text>{entry.eventDate.toDateString()}</Card.Text>
                                <Card.Text>{entry.location}</Card.Text>
                                <Link to={`/AddNotice/${index}`}>
                                    <Button variant="contained">Read More</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}