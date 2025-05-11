import { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import Grid from '@mui/material/Grid'; // Import Grid
import { Paper, Typography } from '@mui/material';
import { EventDetails } from '../types/types.d';
import { UpcomingEventsList } from '../services/queries';

export default function Notices() {
    const [notices, setNotices] = useState<EventDetails[]>([]);

    useEffect(() => {
        UpcomingEventsList().then((data) => {
            console.log(data);
            if (typeof data === 'string') {
                console.error('Error:', data);
                return;
            }
            const processedData = data && data.map((event: any) => ({
                ...event,
                EventDate: new Date(event.DateString),
            }));
            setNotices(processedData);
        });
    }, []);

    function setOutDate(EventDate: Date): import("react").ReactNode {
        return EventDate.toLocaleDateString('en-UK', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                    <Typography variant="h2" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
                    {localStorage.getItem("NoticesTitle")}</Typography>
                    </Paper>                    
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                            {localStorage.getItem('NoticesText')}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    {notices && notices.map((notice: EventDetails, index: number) => (
                        <Col key={index} sm="12" md="6" lg="4">
                            <Card>
                                <Paper>
                                    <CardBody>
                                        <CardTitle>{notice.Title}</CardTitle>
                                        <CardText>{notice.Invitation}</CardText>
                                        <CardText>{notice.Location}</CardText>
                                        <CardText>{setOutDate(notice.EventDate)}</CardText>
                                        <CardText>{notice.Price}</CardText>
                                        <CardText>{`${notice.StartTime} to ${notice.EndTime}`}</CardText>
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