// This page displays displays the upcoming events and the playlist for that event

import React from 'react';
import { Container, Grid, Button, Typography, Divider, Paper, Snackbar, Link, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User, EmptyUser, EventDetails, EmptyEventDetails, PlaylistEntry, EmptyPlaylistEntry, MusicTrack, EmptyMusicTrack } from '../types/types.d';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view';


export default function MembersPage() {
    const history = useNavigate();
    const [Snackopen, setSnackOpen] = useState(false);
    const [SnackMessage, setSnackMessage] = useState('');
    const [action, setAction] = useState(<></>);
    const handleClose = () => {
        setSnackOpen(false);
    };
    // events is the state containg an initial empty array of events
    const [events, setEvents] = useState<EventDetails[]>([]);
    const [playlist, setPlaylist] = useState<PlaylistEntry[]>([]);
    const [musicTrack, setMusicTrack] = useState<MusicTrack>(EmptyMusicTrack());
    const [playorder, setPlayorder] = useState(0);
    const [eventID, setEventID] = useState(0);
    const [playlistID, setPlaylistID] = useState(0);

    useEffect(() => {
        // rediret to the login page if the user is not logged in
        if (document.cookie === '') {
            history('/Members');
        }
        fetch('http://localhost:3001/upcomingPlaylists')
            .then(response => response.json())
            .then( data => {
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
                    for (let j = 0; j < data[i].playlist.length; j++) {
                        let entry = EmptyPlaylistEntry();
                        entry.id = data[i].playlist[j].id;
                        entry.playlistID = data[i].playlist[j].playlistID;
                        entry.eventID = data[i].playlist[j].eventID;
                        // var mTrack = EmptyMusicTrack();
                        entry.musicTrack = data[i].playlist[j].musicTrack;
                        entry.playorder = data[i].playlist[j].playorder;
                        evDetail.playlist = [...evDetail.playlist, entry];
                    }
                    events = [...events, evDetail];
                    }
                setEvents(events);
            }
        );
    }
    , []);

function dateToString(dateObj: Date) {
    // this takes a date object and converts it to a string
    console.log(dateObj);
    return dateObj.getDay() + "/" + dateObj.getMonth() + "/" + dateObj.getFullYear();
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
                        {events.map((event) => (
                            <Grid item xs={12} key={event.eventID}>
                                <Paper>
                                    <Typography variant="h5">{event.title}</Typography>
                                    <Typography variant="body1">{event.eventDate.toDateString()}</Typography>
                                    <Typography variant="body1">{event.startTime +" to "+ event.endTime}</Typography>
                                    <Typography variant="body1">Event location: {event.location}</Typography>
                                    <Typography variant="body1">Meeting point: {event.meetingPoint}</Typography>

                                    {/* cycle through the playlist and  */}
                                    <SimpleTreeView>
                    {event.playlist.map((entry, index) => (
                        entry.id === 0) ? null : (  
                        <TreeItem itemId={index.toString()} label={entry.musicTrack.trackName}>
                        <Link href={entry.musicTrack.lyrics} >
                            <TreeItem itemId={index.toString()+"l"} label="Lyrics" >Download</TreeItem>
                        </Link>
                        <Link href={entry.musicTrack.piano} >
                            <TreeItem itemId={index.toString()+"p"} label="Piano" >Download</TreeItem>
                        </Link>
                        <Link href={entry.musicTrack.allParts} >
                            <TreeItem itemId={index.toString()+"ap"} label="All Parts" >Download</TreeItem>
                        </Link>
                        <Link href={entry.musicTrack.soprano} >
                            <TreeItem itemId={index.toString()+"s"} label="Soprano" >Download</TreeItem>
                        </Link>
                        <Link href={entry.musicTrack.alto} >
                            <TreeItem itemId={index.toString()+"a"} label="Alto" >Download</TreeItem>
                        </Link>
                        <Link href={entry.musicTrack.tenor} >
                            <TreeItem itemId={index.toString()+"t"} label="Tenor" >Download</TreeItem>
                        </Link>
                        </TreeItem>
                    ))}
                </SimpleTreeView>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
                );
}
//                     </>