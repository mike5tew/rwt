import React, { useEffect, useState } from 'react';
import { EventDetails, EmptyEventDetails, PlaylistEntry, EmptyPlaylistEntry, MusicTrack, EmptyMusicTrack, StringtoDate } from '../types/types.d';
import { DataGrid, GridColDef, GridRowId, GridCellParams, GridColumnVisibilityModel } from '@mui/x-data-grid';
import { Button, Select, MenuItem, SelectChangeEvent, Typography, IconButton, Snackbar } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import { playlistGET, musicList, MusicPOST, playlistPOST, EventsUpcomingGET } from '../services/queries';

// This is the column definition for the playlist table with a button to remove the track from the playlist

export default function PlayListAdd() {
    const [eventID, setEventID] = useState<number>(0);
    const [eventList, setEventList] = useState<EventDetails[]>([]);
    const [playlist, setPlaylist] = useState<PlaylistEntry[]>([]);
    const [trackList, setTrackList] = useState<MusicTrack[]>([]);
    const [mTrackList, setMTrackList] = useState<MTrack[]>([]);
    const [SnackMessage, setSnackMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedTrackId, setSelectedTrackId] = useState<GridRowId | null>(null);
    const [tablePlayList, setTablePlaylist] = useState<PlayListEntries[]>([]);
    const [columnVisibilityModel, setColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
            musicTrackID: false,
            TrackName: true,
            Artist: true,
        });
    const [columnVisibilityModel2, setColumnVisibilityModel2] =
        React.useState<GridColumnVisibilityModel>({
            id: false,
            musicTrackID: false,
            TrackName: true,
            Artist: true,
            Playorder: true,
        });
    const history = useNavigate();

    // This is the column definition for the playlist table with a button to add the track to the playlist
    const playlistColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 0, hideable: false },
        { field: 'musicTrackID', headerName: 'MusicTrackID', width: 0, hideable: false },
        { field: 'trackName', headerName: 'Title', width: 200 },
        { field: 'artist', headerName: 'Artist', width: 150 },
        { field: 'playorder', headerName: 'Play Order', width: 100 },
        {
            field: 'remove', headerName: 'Remove', width: 70, renderCell: (params: GridCellParams) => (
                <IconButton onClick={() => handleRemoveTrack(params.row.id)}><DeleteOutlineIcon /></IconButton>
            )
        }
    ];

    // This is the column definition for the track list table with a button to add the track to the playlist
    const allTrackColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 0, hideable: false },
        { field: 'MusicTrackID', headerName: 'MusicTrackID', width: 0, hideable: false },
        { field: 'TrackName', headerName: 'Title', width: 200 },
        { field: 'Artist', headerName: 'Artist', width: 150 },
        {
            field: 'add', headerName: 'Add', width: 70, renderCell: (params: GridCellParams) => (
                <IconButton onClick={() => handleAddTrack(params.row.id)}><AddCircleOutlineIcon /></IconButton>
            )
        }
    ];

    // As the data come in as a PlaylistEntry, we need to convert it to a PlayListEntries so that it has the id entity
    interface PlayListEntries {
        id: number;
        musicTrackID: number;
        trackName: string;
        artist: string;
        playorder: number;
    }

    // This is the column definition for the available music table with a button to remove the track from the playlist
    interface MTrack {
        id: number;
        MusicTrackID: number;
        TrackName: string;
        Artist: string;
    }

    useEffect(() => {
        // retrieve the full music list and the upcoming events
        musicList().then(respon => {
            setTrackList(respon);
            // convert the music list to a MTrack list
            let temptrk: MTrack[] = [];
            for (let i = 0; i < respon.length; i++) {
                let mt: MTrack = {
                    id: Math.floor(Math.random() * 1000000),
                    MusicTrackID: respon[i].MusicTrackID,
                    TrackName: respon[i].TrackName,
                    Artist: respon[i].Artist
                };
                temptrk.push(mt);
            }
            setMTrackList(temptrk);
        }).catch(error => console.log(error));

        // populate the event list
        EventsUpcomingGET().then(respon => setEventList(respon)).catch(error => console.log(error));
        setTablePlaylist([]);
    }, []);

    // When the user selects an event, the playlist for that event is retrieved
    function handleEventChange(event: SelectChangeEvent<number>) {
        setEventID(event.target.value as number);
        console.log("Selected Event ID:", event.target.value);

        playlistGET(event.target.value as number)
            .then(respon => {
                console.log("Playlist Response:", respon);

                if (!respon || respon.length === 0) {
                    setSnackMessage("No playlist for this event");
                    setOpen(true);
                    setTablePlaylist([]);
                    return;
                }

                if (respon[0].MusicTrack.TrackName === "No playlist") {
                    setSnackMessage("No playlist for this event");
                    setOpen(true);
                    return;
                }

                if (respon[0].ID < 0) {
                    setSnackMessage(respon[0].MusicTrack.TrackName);
                    setOpen(true);
                    return;
                }

                let tempPlaylist: PlayListEntries[] = respon.map(item => ({
                    id: Math.floor(Math.random() * 1000000),
                    musicTrackID: item.MusicTrack.MusicTrackID,
                    artist: item.MusicTrack.Artist,
                    trackName: item.MusicTrack.TrackName,
                    playorder: item.Playorder
                }));

                setTablePlaylist(tempPlaylist);
            })
            .catch(error => {
                console.error("Error fetching playlist:", error);
                setSnackMessage("Error fetching playlist");
                setOpen(true);
            });
    }




    function handleAddTrack(trackID: number) {
        // copy the track details from the trackList and add to the playlist
        let track = mTrackList.find(track => track.id === trackID);
        if (track) {
            // create a new playlist entry
            var pEntry: PlayListEntries = {
                id: Math.floor(Math.random() * 1000000),
                musicTrackID: track.MusicTrackID,
                artist: track.Artist,
                trackName: track.TrackName,
                playorder: tablePlayList.length + 1
            }
            // add the track to the playlist
            const newTablePlaylist = [...tablePlayList, pEntry];
            setTablePlaylist(newTablePlaylist);
        } else {
            console.log("track not found");
        }
    }

    function handleRemoveTrack(trackID: number) {
        // remove the track from the playlist
        let newPlaylist = tablePlayList.filter(track => track.id !== trackID);
        for (let i = 0; i < newPlaylist.length; i++) {
            newPlaylist[i].playorder = i + 1;
        }
        console.log(newPlaylist.length);
        setTablePlaylist(newPlaylist);
    }

    function handleSavePlayList(): void {
        if (eventID === 0) {
            setSnackMessage("Please select an event");
            setOpen(true);
            console.log("Please select an event", eventID);
            return;
        }
        console.log("Save playlist for event", eventID, tablePlayList);
        // convert the playlist to a PlaylistEntry list
        let tempPlaylist: PlaylistEntry[] = [];
        for (let i = 0; i < tablePlayList.length; i++) {
            let pEntry: PlaylistEntry = EmptyPlaylistEntry();
            pEntry.MusicTrack.MusicTrackID = tablePlayList[i].musicTrackID;
            pEntry.Playorder = tablePlayList[i].playorder;
            pEntry.EventID = eventID;
            tempPlaylist.push(pEntry);
        }

        playlistPOST(tempPlaylist).then(respon => {
            console.log(respon);
            if (respon.ID === 200) {
                console.log("Playlist saved");
                setSnackMessage("Playlist saved");
                setOpen(true);
                setEventID(0);
                setTablePlaylist([]);
            } else {
                setSnackMessage("Error saving playlist");
                setOpen(true);
            }
        }).catch(error => {
            console.log(error);
            setSnackMessage("Error saving playlist");
            setOpen(true);
        });
    }

    function MoveUpPlayList(): void {
        if (selectedTrackId === null) {
            setSnackMessage("Please select a track to move");
            setOpen(true);
            return;
        }
        const selectedRow = tablePlayList.findIndex(track => track.id === selectedTrackId);
        if (selectedRow > 0) {
            const newTablePlaylist = [...tablePlayList];
            const temp = newTablePlaylist[selectedRow - 1];
            newTablePlaylist[selectedRow - 1] = newTablePlaylist[selectedRow];
            newTablePlaylist[selectedRow] = temp;
            renumberPlayOrder(newTablePlaylist);
        } else {
            setSnackMessage("Cannot move up");
            setOpen(true);
        }
    }

    function MoveDownPlayList(): void {
        if (selectedTrackId === null) {
            setSnackMessage("Please select a track to move");
            setOpen(true);
            return;
        }
        const selectedRow = tablePlayList.findIndex(track => track.id === selectedTrackId);
        if (selectedRow < tablePlayList.length - 1) {
            const newTablePlaylist = [...tablePlayList];
            const temp = newTablePlaylist[selectedRow + 1];
            newTablePlaylist[selectedRow + 1] = newTablePlaylist[selectedRow];
            newTablePlaylist[selectedRow] = temp;
            renumberPlayOrder(newTablePlaylist);
        } else {
            setSnackMessage("Cannot move down");
            setOpen(true);
        }
    }

    function renumberPlayOrder(tempPlayList: PlayListEntries[]): void {
        for (let i = 0; i < tempPlayList.length; i++) {
            tempPlayList[i].playorder = i + 1;
        }
        setTablePlaylist(tempPlayList);
    }

    return (

        <div>
            <Grid2 container spacing={2} paddingTop={2}>
                <Grid2 size={12} ><Typography variant="h6">Create a Playlist</Typography></Grid2>
                <Grid2 size={6} >
                    <Select value={eventID} fullWidth onChange={handleEventChange}>
                        <MenuItem value={0}>Select Event</MenuItem>
                        {eventList.map((event) => (
                            <MenuItem key={event.EventID} value={event.EventID}>{event.Title + " " + StringtoDate(event.EventDate.toString())}</MenuItem>
                        ))}
                    </Select>
                </Grid2>
                <Grid2 size={6} />
                <Grid2 size={12} ><Typography variant="h6">Track List</Typography></Grid2>
                <Grid2 size={12} >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <DataGrid
                            rows={mTrackList}
                            columns={allTrackColumns}
                            columnVisibilityModel={{ id: false, MusicTrackID: false }}
                        />
                    </div>
                </Grid2>
                <Grid2 size={12} ><Typography variant="h6">Play List</Typography></Grid2>
                <Grid2 size={12}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <DataGrid
                            rows={tablePlayList}
                            columns={playlistColumns}
                            columnVisibilityModel={columnVisibilityModel2}
                            onRowSelectionModelChange={(newSelection) => {
                                if (newSelection.length > 0) {
                                    setSelectedTrackId(newSelection[0]);
                                } else {
                                    setSelectedTrackId(null);
                                }
                            }}
                            checkboxSelection
                            disableRowSelectionOnClick
                        />



                    </div>
                </Grid2>
                <Grid2 size={6} >
                    <Button variant='outlined' onClick={() => handleSavePlayList()}>Save Play List</Button>
                </Grid2>
                <Grid2 size={3} >
                    <Button variant='outlined' onClick={() => MoveUpPlayList()}>Move Up</Button>
                </Grid2>
                <Grid2 size={3} >
                    <Button variant='outlined' onClick={() => MoveDownPlayList()}>Move Down</Button>
                </Grid2>
            </Grid2>
            <Snackbar
                // anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={false}
                autoHideDuration={6000}
                message={SnackMessage}
            />
        </div>
    );
}



