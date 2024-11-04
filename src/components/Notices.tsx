//  This page lists the notices for upcoming events and other important information.  It gets this information from a Notices.json file in the public folder.
import * as React from 'react';
//import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import Grid2 from '@mui/material/Grid2';
import { Paper, Typography } from '@mui/material';
import { EventDetails, EmptyEventDetails } from '../types/types.d';
import { EventsList } from '../services/queries';

export default function Notices() {
       

        const [notices, setNotices] = React.useState([] as EventDetails[]);
        const upcomingEvents = 
        React.useEffect(() => {
            EventsList().then((data) => {
                setNotices(data);
            }
            );

    }, []);
// the project is not running stating that TypeError: Cannot read properties of null (reading 'useState')
// the code is not working because the useState is not imported from react.  It is imported from react though
//  this means that the problem must be 


    return (
        <>
        <Grid2 container spacing={2}>
            <Grid2 size={12}>
                <Paper>
                <Typography variant="h4">{localStorage.getItem('NoticesTitle')}</Typography>
                </Paper>
            </Grid2>
            <Grid2 size={12}>
                <Paper>
                <Typography variant="h6" sx={{ whiteSpace: "pre-wrap" }}>
                    {localStorage.getItem('NoticesText')}</Typography>
                </Paper>
            </Grid2>
            <Grid2 size={12}>
                {notices.map((notice: EventDetails, index: number) => (
                    <Col key={index} sm="12" md="6" lg="4">
                        {/*  */}
                        <Card>
                            <Paper>
                            <CardBody>
                                <CardTitle>{notice.Title}</CardTitle>
                                <CardText>{notice.Invitation}</CardText>
                                <CardText>{notice.Location}</CardText>
                                <CardText>{notice.EventDate.toDateString()}</CardText>
                                <CardText>{notice.StartTime} to {notice.EndTime}</CardText>

                            </CardBody>
                            </Paper>
                        </Card>
                    </Col>
                ))}
            </Grid2>
        </Grid2>
        </>

    );
}