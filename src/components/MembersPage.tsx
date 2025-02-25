// This page displays displays the upcoming events and the playlist for that event

import { Container, Button, Typography, Divider, Paper, Link, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import { EventDetails } from '../types/types.d';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view';
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
                        {events && events.map((event) => (
                            <>
                            <Grid item xs={12} key={event.EventID}>
                                <Paper>
                                    <Typography variant="h5">{event.Title}</Typography>
                                    <Typography variant="body1">{event.EventDate.toDateString()}</Typography>
                                    <Typography variant="body1">{event.StartTime +" to "+ event.EndTime}</Typography>
                                    <Typography variant="body1">Event location: {event.Location}</Typography>
                                    <Typography variant="body1">Meeting point: {event.MeetingPoint}</Typography>
                                    <Typography variant="h5">Playlist</Typography>
                                    {/* cycle through the playlist and  */}
                                    <SimpleTreeView>
                    {event.Playlist && event.Playlist.map((entry, index) => (
                        entry.ID=== 0) ? null : (  
                        <TreeItem itemId={index.toString()} label={entry.MusicTrack.TrackName}>
                        <Link href={entry.MusicTrack.Lyrics} >
                            <TreeItem  key={entry.MusicTrack.MusicTrackID+ "l"} itemId={index.toString()+"l"} label="Lyrics" >Download</TreeItem>
                        </Link>
                        <Link href={entry.MusicTrack.Piano} >
                            <TreeItem key={entry.MusicTrack.MusicTrackID+ "p"} itemId={index.toString()+"p"} label="Piano" >Download</TreeItem>
                        </Link>
                        <Link href={entry.MusicTrack.AllParts} >
                            <TreeItem key={entry.MusicTrack.MusicTrackID+ "ap"} itemId={index.toString()+"ap"} label="All Parts" >Download</TreeItem>
                        </Link>
                        <Link href={entry.MusicTrack.Soprano} >
                            <TreeItem key={entry.MusicTrack.MusicTrackID+ "s"} itemId={index.toString()+"s"} label="Soprano" >Download</TreeItem>
                        </Link>
                        <Link href={entry.MusicTrack.Alto} >
                            <TreeItem key={entry.MusicTrack.MusicTrackID+ "a"} itemId={index.toString()+"a"} label="Alto" >Download</TreeItem>
                        </Link>
                        <Link href={entry.MusicTrack.Tenor} >
                            <TreeItem key={entry.MusicTrack.MusicTrackID+ "t"} itemId={index.toString()+"t"} label="Tenor" >Download</TreeItem>
                        </Link>
                        </TreeItem>
                        
                    ))}
                </SimpleTreeView>
                                </Paper>
                            </Grid>
                            </>
                        ))}
                        <Grid item xs={12}>
                            <Button onClick={NavDash} variant="contained">Back</Button>
                            </Grid>
                    </Grid>
                </Container>
                );
}
