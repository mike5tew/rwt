//  This page lists the notices for upcoming events and other important information.  It gets this information from a Notices.json file in the public folder.
import * as React from 'react';
//import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import Grid from '@mui/material/Grid';
import { Paper, Typography } from '@mui/material';
import { EventDetails, EmptyEventDetails } from '../types/types.d';

export default function Notices() {
       

        const [notices, setNotices] = React.useState([] as EventDetails[]);

        React.useEffect(() => {
            fetch('http://localhost:3001/upcomingEvents')
            .then(response => response.json())
            .then(data => {
                let events = [] as EventDetails[];
                for (let i = 0; i < data.length; i++) {
                    let evDetail = EmptyEventDetails();
                    evDetail.eventDate = new Date(data[i].eventDate);
                    evDetail.eventID = data[i].eventID;
                    evDetail.location = data[i].location;
                    evDetail.startTime = data[i].startTime;
                    evDetail.endTime = data[i].endTime;
                    evDetail.invitation = data[i].invitation;
                    evDetail.meetingPoint = data[i].meetingPoint;
                    evDetail.price = data[i].price;
                    evDetail.title = data[i].title;
                    events = [...events, evDetail];
                    }

                setNotices(events);
            });

    }, []);
// the project is not running stating that TypeError: Cannot read properties of null (reading 'useState')
// the code is not working because the useState is not imported from react.  It is imported from react though
//  this means that the problem must be 


    return (
        <>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper>
                <Typography variant="h4">{localStorage.getItem('NoticesTitle')}</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                <Typography variant="h6" sx={{ whiteSpace: "pre-wrap" }}>
                    {localStorage.getItem('NoticesText')}</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                {notices.map((notice: EventDetails, index: number) => (
                    <Col key={index} sm="12" md="6" lg="4">
                        {/*  */}
                        <Card>
                            <Paper>
                            <CardBody>
                                <CardTitle>{notice.title}</CardTitle>
                                <CardText>{notice.invitation}</CardText>
                                <CardText>{notice.location}</CardText>
                                <CardText>{notice.eventDate.toDateString()}</CardText>
                                <CardText>{notice.startTime} to {notice.endTime}</CardText>

                            </CardBody>
                            </Paper>
                        </Card>
                    </Col>
                ))}
            </Grid>
        </Grid>
        </>

    );
}