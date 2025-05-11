// This page displays displays the upcoming events and the playlist for that event

import { Container, Button, Typography, Divider, Paper, Link, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import { EventDetails, MusicTrack } from '../types/types.d';
import MusicTreeList from './MusicTreeList';
import { upcomingPlaylists } from 'src/services/queries';
import { useNavigate } from 'react-router-dom';


export default function MembersPage() {
    // events is the state containg an initial empty array of events
    const [events, setEvents] = useState<EventDetails[]>([]);
       const history = useNavigate();  
        const NavDash = () => {
            history('/AdminDashboard');
        }
    useEffect(() => {
        // if the cookie is not set, redirect to the members page
        if (document.cookie === '') {
            console.log('No cookie');
            history('/Members');
        }
        // fetch the upcoming events
        upcomingPlaylists().then((data) => {
            for (let i = 0; i < data.length; i++) {
                data[i].EventDate = new Date(data[i].EventDate);                    
            }
            setEvents(data);
        }
        );
    }
    , []);

    function getTrackList(entry: EventDetails) {
        //extract the playlist from the event details in the form of an array of music tracks
        var musicList: MusicTrack[] = [];
        for (let i = 0; i < entry.Playlist.length; i++) {
            musicList.push(entry.Playlist[i].MusicTrack);
        }
        return musicList;
    }
    // function to navigate to the music page
    const MusicPage = () => {
        history('/Music');
    }

    // function to display the playlist for the event
    const EventPlayList = (event: EventDetails) => {
        if (event.Playlist && event.Playlist.length > 0) {
            return <MusicTreeList TrackList={getTrackList(event)} />;
        }
        return null;
    }

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box>   
                        <Typography variant="h3">Upcoming Events</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={MusicPage} variant="contained">Repertoire</Button>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                {events && events.map((event) => (
                    <Grid item xs={12} key={event.EventID}>
                        <Paper>
                            <Typography variant="h5">{event.Title}</Typography>
                            <Typography variant="body1">{event.EventDate.toDateString()}</Typography>
                            <Typography variant="body1">{event.StartTime +" to "+ event.EndTime}</Typography>
                            <Typography variant="body1">Event location: {event.Location}</Typography>
                            <Typography variant="body1">Meeting point: {event.MeetingPoint}</Typography>
                            {EventPlayList(event)}
                        </Paper>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Button onClick={NavDash} variant="contained">Back</Button>
                </Grid>
            </Grid>
        </Container>
    );
}
