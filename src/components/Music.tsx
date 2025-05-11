// This page provides a list of music titles that download the mp3 when clicked.

import { useEffect, useState } from 'react';
import { Grid, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import  MusicTreeList  from 'src/components/MusicTreeList';
import { MusicGET } from 'src/services/queries';
import { MusicTrack } from 'src/types/types';
// we loop through there music.json file and display the music titles with the links to the mp3 files being under the key names

export default function Music() {
    const history= useNavigate();

    const [music, setMusic] = useState<MusicTrack[]>([]);
    const fetchMusic = async () => {
        const musicData = await MusicGET(-1);
        setMusic(musicData);
    }

    useEffect(() => {
        fetchMusic();
    }, []);
        

    return (
        <Grid container spacing={2}>
    
            <Grid item xs={10}>
                <Paper>
                    <Typography variant="h3">Music List</Typography>
                </Paper>
            </Grid>
            <Grid item xs={2}>
                <Button onClick={() => history('/')} variant="contained">Back</Button>
            </Grid>
            <Grid item xs={12}>
                {music && <MusicTreeList TrackList={music} />}
            </Grid>
        </Grid>
    );
}
