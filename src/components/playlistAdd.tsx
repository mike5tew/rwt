// This page allows the admin user to add a playlist to an event.
// The page contains a select box to select the event, a table to display the tracks that can be added to the playlist, and a table to display the tracks that have been added to the playlist.  The order of the tracks in the playlist can be changed by changing the running order number in the table.

import React, { useEffect, useState } from 'react';
import { EventDetails, EmptyEventDetails, PlaylistEntry, EmptyPlaylistEntry, MusicTrack, EmptyMusicTrack, StringtoDate } from '../types/types.d';
import { DataGrid, GridColDef, GridRowId, GridCellParams } from '@mui/x-data-grid';
import { Button, Select, MenuItem, Paper, SelectChangeEvent, Typography, IconButton,  } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import { playlistGET, musicList, MusicPOST, playlistPOST } from '../services/queries';

// This is the column definition for the playlist table with a button to remove the track from the playlist


export default function PlayListAdd() {
    const [eventID, setEventID] = useState<number>(0);
    const [eventList, setEventList] = useState<EventDetails[]>([]);
    const [playlist, setPlaylist] = useState<PlaylistEntry[]>([]);
    const [trackList, setTrackList] = useState<MusicTrack[]>([]);
    const [tableplaylist, setTablePlaylist] = useState<TableListEntries[]>([]);
    const history = useNavigate();
    const columns: GridColDef[] = [
        { field: 'playorder', headerName: 'Order', width: 50, editable: true},
        // we need the trackName and artist from the musicTrack object
        { field: 'trackName', headerName: 'Title', width: 200 },
        { field: 'artist', headerName: 'Artist', width: 150 },
        { field: 'remove', headerName: 'Remove', width: 70 , renderCell: (params: GridCellParams) => (
            <IconButton onClick={() => handleRemoveTrack(params.row.musicTrackID)}><DeleteOutlineIcon/></IconButton>
        )}
    ];
    const allTrackColumns: GridColDef[] = [
        { field: 'trackName', headerName: 'Title', width: 200 },
        { field: 'artist', headerName: 'Artist', width: 150 },
        { field: 'add', headerName: 'Add', width: 70, renderCell: (params: GridCellParams) => (
            <IconButton  onClick={() => handleAddTrack(params.row.musicTrackID)}><AddCircleOutlineIcon/></IconButton>
        )}
    ];
    interface TableListEntries {
        id: number;
        musicTrackID: number;
        trackName: string;
        artist: string;
        playorder: number;
    }



    useEffect(() => {
        musicList().then(respon => setTrackList(respon)).catch(error => console.log(error));
        setTablePlaylist([]);
        if (eventID > 0) {
            playlistGET(eventID)
                .then(respon => setPlaylist(respon));
            // create  an empty array to hold the playlist entries
            let holdingPlaylist: TableListEntries[] = [];
            
            for (let i = 0; i < playlist.length; i++) {
                console.log(playlist[i]);
                let playListEntry: TableListEntries = {
                    id: i,
                    musicTrackID: playlist[i].MusicTrack.MusicTrackID,
                    trackName: playlist[i].MusicTrack.TrackName,
                    artist: playlist[i].MusicTrack.Artist,
                    playorder: playlist[i].Playorder
                };
                holdingPlaylist.push(playListEntry);
            }
            console.log(holdingPlaylist);
            setTablePlaylist(holdingPlaylist);
        }
    }, [eventID]);

    function handleEventChange(event: SelectChangeEvent<Number>) {
        setEventID(event.target.value as number);
    }

    function handleAddTrack(trackID: number) {
        // copy the track details from the trackList and add to the playlist
        let track = trackList.find(track => track.MusicTrackID === trackID);
        if (track) {
            console.log(track);
        // create a new playlist entry
            let Tableplaylistcount = tableplaylist.length;
        var playListEntry: TableListEntries = {
            id: Tableplaylistcount + 1,
            musicTrackID: track.MusicTrackID,
            trackName: track.TrackName,
            artist: track.Artist,
            playorder: Tableplaylistcount + 1
        };
        setTablePlaylist([...tableplaylist, playListEntry]);

         } else {
            console.log("track not found");
         }
    }

    function handleRemoveTrack(trackID: number) {
        // remove the track from the playlist
        let newPlaylist = tableplaylist.filter(track => track.musicTrackID !== trackID);
        setTablePlaylist(newPlaylist);
    }

    function handleSavePlayList(): void {
        // convert the array of TableListEntries to an array of PlaylistEntry
        let playlist: PlaylistEntry[] = [];
        tableplaylist.forEach(track => {
            let playlistEntry: PlaylistEntry = EmptyPlaylistEntry();
            playlistEntry.EventID = eventID;
            playlistEntry.MusicTrack = EmptyMusicTrack();
            playlistEntry.MusicTrack.MusicTrackID = track.musicTrackID;
            playlistEntry.Playorder = track.playorder;
            playlist.push(playlistEntry);
        });


        // save the playlist to the database
        playlistPOST(playlist)
            .then(respon => console.log(respon));
            // reset the playlist
            setPlaylist([]);
            setTablePlaylist([]);
    }

    return (
        <div>
               <Grid2  container spacing={2} paddingTop={2}>
            <Grid2  size={12} ><Typography variant="h6">Create a Playlist</Typography></Grid2>
            <Grid2  size={12} >
            <Select value={eventID} onChange={handleEventChange}>
               <MenuItem value={0}>Select Event</MenuItem>
                {eventList.map((event) => (
                    <MenuItem key={event.EventID} value={event.EventID}>{event.Title +" "+StringtoDate(event.EventDate.toString())}</MenuItem>
                ))}
            </Select>
            </Grid2>
                <Grid2  size={12} ><Typography variant="h6">Track List</Typography></Grid2>
                <Grid2  size={12} ><Typography variant="h6">Play List</Typography></Grid2>
                <Grid2  size={12} >
                    <DataGrid rows={trackList} columns={allTrackColumns} autoHeight />
                </Grid2>
                        <Grid2  size={12}> 
            <DataGrid
                rows={tableplaylist}
                columns={columns}
                autoHeight
            />
            </Grid2>
            <Grid2  size={12} >
            <Button variant='outlined' onClick={() => handleSavePlayList()}>Save Play List</Button>
            </Grid2>
        </Grid2>
        </div>
    );
}



