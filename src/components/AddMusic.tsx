// React and core imports
import { useEffect, useState } from 'react'
// Material UI components
import { Container, Button, TextField, Typography, Select, FormControl, InputLabel, MenuItem, Snackbar, Fade, ButtonGroup, Box } from '@mui/material';
import Grid from '@mui/material/Grid';

// Form handling
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

// API and types
import { MusicGET, MusicPOST, MusicTrackPUT, musicTrackDELETE, MusicTrackGET } from '../services/queries';
import { MusicTrack } from '../types/types.d';
import { NotificationSnackbar } from './shared/NotificationSnackbar';
import { useNavigate } from 'react-router-dom';



/**
 * Component for adding and editing music tracks
 * Provides form interface for managing music track details including
 * track name, artist, and various part recordings (Soprano, Alto, etc.)
*/
export default function AddMusic() {
    const { register, setValue, watch, getValues, handleSubmit, control, formState: { errors } } = useForm<MusicTrack>({
        defaultValues: {
            MusicTrackID: 0,
            Artist: "",
            TrackName: "",
            Lyrics: "",
            Soprano: "",
            Alto: "",
            Tenor: "",
            AllParts: "",
            Piano: ""
        }
    });
    const [snackMessage, setSnackMessage] = useState('');
    const [snackOpen, setSnackOpen] = useState(false);
    const [musicList, setMusicList] = useState<MusicTrack[]>([]);
    /**
     * Navigates to the dashboard page
     */
    const history = useNavigate();  
    const NavDash = () => {
        history('/AdminDashboard');
    }
    /**
     * Handles form submission for both new tracks and updates
     * @param data MusicTrack data from the form
    */
   const FormSubmitHandler: SubmitHandler<MusicTrack> = (data: MusicTrack) => {
       if (data.MusicTrackID === 0) {
           console.log('Adding new track', data);
           const mPost = async () => {
               var newTrack = await MusicPOST(data)
               if (newTrack) {
                   setSnackMessage('Track Added');
                   setSnackOpen(true);
                   setMusicList([...musicList, newTrack]);
                } else {
                    setSnackMessage('Error Adding Track');
                    setSnackOpen(true);
                    
                }
            }
            mPost();
        } else {
            const mPost = async () => {
                const respon = await MusicTrackPUT(data);
                if (respon) {
                    for (var i = 0; i < musicList.length; i++) {
                        if (musicList[i].MusicTrackID === data.MusicTrackID) {
                            musicList[i] = data;
                            break;
                        }
                    }
                    setMusicList(musicList);
                    mPost();
                    //setOpen(true);
                } else {
                    setSnackMessage('Error Updating Track');
                    setSnackOpen(true);
                }
                //replace the existing track with the new data in the array
            }
        }
    }
    
    /**
     * Fetches music list on component mount
    */
   useEffect(() => {
    // if the cookie is not set, with a role of admin, redirect to the dashboard
    if (document.cookie === '' || document.cookie !== 'role=admin') {
        console.log('No cookie');
        history('/AdminDashboard');
    }
       const fetchMusic = async () => {
           const music = await MusicGET(-1);
           if (music) {
               setMusicList(music);
            }
        }
        fetchMusic();
    }
    , []);
    
    /**
     * Populates form with selected track details
    */
   const viewDetails = async () => {
       const id = getValues('MusicTrackID');
       
       try {
           const mtrack = await MusicTrackGET(id);
           console.log(mtrack);
           if (mtrack) {
               setValue('TrackName', mtrack.TrackName);
               setValue('Artist', mtrack.Artist);
               setValue('Lyrics', mtrack.Lyrics);
               setValue('Soprano', mtrack.Soprano);
               setValue('Alto', mtrack.Alto);
               setValue('Tenor', mtrack.Tenor);
               setValue('AllParts', mtrack.AllParts);
               setValue('Piano', mtrack.Piano);
            }
        } catch (error) {
            console.error("Error fetching music data:", error);
            // Handle error, e.g., display an error message to the user
        }
    };
    
    /**
     * Handles deletion of a music track
    */
   const deleteTrack = async () => {
       try {
           const id = getValues('MusicTrackID');
           
           if (id > 0) {
               const deleteResponse = await musicTrackDELETE(id);
               if (deleteResponse.status === 204) {
                   // reset the form
                   console.log('Track Deleted', deleteResponse);
                   setValue('MusicTrackID', 0);
                   setValue('Artist', '');
                   setValue('TrackName', '');
                   setValue('Lyrics', '');
                   setValue('Soprano', '');
                   setValue('Alto', '');
                   setValue('Tenor', '');
                   setValue('AllParts', '');
                   setValue('Piano', '');
                   // snackbar the deletion
                   setSnackMessage('Track Deleted');
                   setSnackOpen(true);
                   // remove the track from the array
                   setMusicList(musicList.filter((track) => track.MusicTrackID !== id));
                } else {
                    setSnackMessage('Error Deleting Track');
                    setSnackOpen(true);
                }
            }
        } catch (error) {
            console.error("Error deleting music data:", error);
            setSnackMessage('Error Deleting Track');
            setSnackOpen(true);
        }
    }
    const buttons = [
        <Button variant="contained"  onClick={deleteTrack}>Delete Track</Button>,
        <Button type="submit" variant="contained">Save Details</Button>,
        <Button variant="contained" onClick={NavDash}>Dashboard</Button>,
    ];


    return (
        // Component layout structure
        <Container>
            {/* Track Selection Section */}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4">Add or Edit Music Entries</Typography>
                </Grid>

                {/* add a select containing all of the existing  */}
                <Grid item xs={12}>
                    <FormControl fullWidth><InputLabel id="ExistingTracks">Venue</InputLabel>
                        <Controller name="MusicTrackID" control={control} render={({ field }) => (
                            <Select {...field}  {...register("MusicTrackID")} label="Existing Tracks" required
                                onChange={(e) => { field.onChange(e); viewDetails(); }}>


                                <MenuItem key={0} value={0}>New Track</MenuItem>
                                {musicList && musicList.map((track) =>
                                    <MenuItem key={track.MusicTrackID} value={track.MusicTrackID}>
                                        {track.TrackName}
                                    </MenuItem>
                                )}
                            </Select>
                        )} />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h4">Track Details</Typography>
                </Grid>
                <Grid item xs={12}>
                    <form onSubmit={handleSubmit(FormSubmitHandler)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant='outlined'
                                    label="Track Name"
                                    placeholder='Track Name'
                                    value={watch('TrackName')}
                                    fullWidth
                                    {...register('TrackName')}
                                    error={!!errors.TrackName}
                                    helperText={errors.TrackName?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Artist"
                                    value={watch('Artist')}
                                    fullWidth
                                    {...register('Artist')}
                                    error={!!errors.Artist}
                                    helperText={errors.Artist?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Lyrics"
                                    value={watch('Lyrics')}
                                    fullWidth
                                    {...register('Lyrics')}
                                    error={!!errors.Lyrics}
                                    helperText={errors.Lyrics?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Soprano"
                                    value={watch('Soprano')}
                                    fullWidth
                                    {...register('Soprano')}
                                    error={!!errors.Soprano}
                                    helperText={errors.Soprano?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Alto"
                                    fullWidth
                                    value={watch('Alto')}
                                    {...register('Alto')}
                                    error={!!errors.Alto}
                                    helperText={errors.Alto?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Tenor"
                                    fullWidth
                                    value={watch('Tenor')}
                                    {...register('Tenor')}
                                    error={!!errors.Lyrics}
                                    helperText={errors.Lyrics?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="All Parts"
                                    fullWidth
                                    value={watch('AllParts')}
                                    {...register('AllParts')}
                                    error={!!errors.AllParts}
                                    helperText={errors.AllParts?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Piano"
                                    fullWidth
                                    value={watch('Piano')}
                                    {...register('Piano')}
                                    error={!!errors.Piano}
                                    helperText={errors.Piano?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        '& > *': {
                                            m: 1,
                                        },
                                    }}
                                >   
                                    <ButtonGroup size="large" aria-label="Large button group">
                                        {buttons}
                                    </ButtonGroup>
                                </Box>
                                    </Grid>
                            </Grid>
                    </form>
                </Grid>
            </Grid>

            {/* Feedback Messages */}
            <NotificationSnackbar
                open={snackOpen}
                message={snackMessage}
                onClose={() => setSnackOpen(false)}
            />
        </Container>
    );
}