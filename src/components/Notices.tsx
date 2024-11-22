import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import Grid2 from '@mui/material/Grid2'; // Import Grid2
import { Paper, Typography } from '@mui/material';
import { EventDetails } from '../types/types.d';
import { EventsList } from '../services/queries';

export default function Notices() {
    const [notices, setNotices] = useState<EventDetails[]>([]);

    useEffect(() => {
        EventsList().then((data) => {
            console.log(data);
            if (typeof data === 'string') {
                console.error('Error:', data);
                return;
            }
            const processedData = data.map((event: any) => ({
                ...event,
                EventDate: new Date(event.DateString),
            }));
            setNotices(processedData);
        });
    }, []);

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
                            {localStorage.getItem('NoticesText')}
                        </Typography>
                    </Paper>
                </Grid2>
                <Grid2 size={12}>
                    {notices.map((notice: EventDetails, index: number) => (
                        <Col key={index} sm="12" md="6" lg="4">
                            <Card>
                                <Paper>
                                    <CardBody>
                                        <CardTitle>{notice.Title}</CardTitle>
                                        <CardText>{notice.Invitation}</CardText>
                                        <CardText>{notice.Location}</CardText>
                                        <CardText>{`${notice.EventDate.getDate()} ${notice.EventDate.toLocaleString('default', { month: 'long' })} ${notice.EventDate.getFullYear()}`}</CardText>
                                        <CardText>{`${notice.StartTime} to ${notice.EndTime}`}</CardText>
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