// This page allows you to add the googledrive Links for the tracks.  It is a form using react-hook-form

import React, { useState } from 'react'
import { Container, Button, TextField, Typography, Select, FormControl, InputLabel, MenuItem, Snackbar, Alert, Fade } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { MusicGET, MusicPOST, MusicTrackPUT, musicTrackDELETE } from '../services/queries';
import { TransitionProps } from '@mui/material/transitions';
import { MusicTrack } from '../types/types';


const schema = yup.object().shape({
    title: yup.string().required(),
    link: yup.string().required(),

});




export default function AddMusic() {
    const { register, setValue, watch, getValues, handleSubmit, control, formState: { errors } } = useForm<MusicTrack>({
        defaultValues: {
            ID: 0,
            TrackName: "",
            Lyrics: "",
            Soprano: "",
            Alto: "",
            Tenor: "",
            AllParts: "",
            Piano: ""
        }
    });
    const [openError, setOpenError] = useState(false);
    const [state, setState] = useState<{
        open: boolean;
        Transition: React.ComponentType<TransitionProps & { children: React.ReactElement<any, any>; }>;
    }>({
        open: false,
        Transition: Fade,
    });
    const [snackOpen, setSnackOpen] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [musicList, setMusicList] = useState<MusicTrack[]>([]);

    const FormSubmitHandler: SubmitHandler<MusicTrack> = (data: MusicTrack) => {
        if (data.ID === 0) {

            const mPost = async () => {
                var newTrack = await MusicPOST(data)
                if (newTrack) {
                    setOpen(true);
                    setMusicList([...musicList, newTrack]);
                } else {
                    setOpenError(true);
                }
            }
            mPost();
        } else {
            const mPost = async () => {
                const respon = await MusicTrackPUT(data);
                if (respon) {
                    for (var i = 0; i < musicList.length; i++) {
                        if (musicList[i].ID === data.ID) {
                            musicList[i] = data;
                            break;
                        }
                    }
                    setMusicList(musicList);
                    mPost();
                    //setOpen(true);
                } else {
                    setOpenError(true);
                }
                //replace the existing track with the new data in the array
            }
        }
    }


    const handleClose = () => {
        setState({
            ...state,
            open: false,
        });
    };
    const handleCloseError = () => {
        setState({
            ...state,
            open: false,
        });
    };

    // take the id from the select and use it to populate the form
    const viewDetails = async () => {
        const id = getValues('ID');

        try {
            const mtrack = await MusicGET(id);
            if (mtrack) {
                setValue('TrackName', mtrack[0].TrackName);
                setValue('Lyrics', mtrack[0].Lyrics);
                setValue('Soprano', mtrack[0].Soprano);
                setValue('Alto', mtrack[0].Alto);
                setValue('Tenor', mtrack[0].Tenor);
                setValue('AllParts', mtrack[0].AllParts);
                setValue('Piano', mtrack[0].Piano);
            }
        } catch (error) {
            console.error("Error fetching music data:", error);
            // Handle error, e.g., display an error message to the user
        }
    };

    const deleteTrack = async () => {
        try {
            const id = await getValues('ID');

            if (id > 0) {
                const deleteResponse = await musicTrackDELETE(id);
                if (deleteResponse === 'success') {
                    setOpen(true);
                    // reset the form
                    setValue('ID', 0);
                    setValue('TrackName', '');
                    setValue('Lyrics', '');
                    setValue('Soprano', '');
                    setValue('Alto', '');
                    setValue('Tenor', '');
                    setValue('AllParts', '');
                    setValue('Piano', '');
                    // snackbar the deletion
                    // remove the track from the array
                    setMusicList(musicList.filter((track) => track.ID !== id));
                } else {
                    setOpenError(true);
                }
            }
        }
        catch (error) {
            console.error("Error deleting music data:", error);
            // Handle error, e.g., display an error message to the user
        }
    }


    return (

        <Container>
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <Typography variant="h4">Add or Edit Music Entries</Typography>
                </Grid2>

                {/* add a select containing all of the existing  */}
                <Grid2 size={12}>
                    <FormControl fullWidth><InputLabel id="ExistingTracks">Venue</InputLabel>
                        <Controller name="ID" control={control} render={({ field }) => (
                            <Select {...field}  {...register("ID")} label="Existing Tracks" required
                                onChange={(e) => { field.onChange(e); viewDetails(); }}>


                                <MenuItem key={0} value={0}>New Track</MenuItem>
                                {musicList && musicList.map((track) =>
                                    <MenuItem key={track.ID} value={track.ID}>
                                        {track.TrackName}
                                    </MenuItem>
                                )}
                            </Select>
                        )} />
                    </FormControl>
                </Grid2>
                <Grid2 size={12}>
                    <Typography variant="h4">Track Details</Typography>
                </Grid2>
                <Grid2 size={12}>
                    <form onSubmit={handleSubmit(FormSubmitHandler)}>
                        <Grid2 container spacing={2}>
                            <Grid2 size={12}>
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
                            </Grid2>
                            <Grid2 size={12}>
                                <TextField
                                    label="Lyrics"
                                    value={watch('Lyrics')}
                                    fullWidth
                                    {...register('Lyrics')}
                                    error={!!errors.Lyrics}
                                    helperText={errors.Lyrics?.message}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <TextField
                                    label="Soprano"
                                    value={watch('Soprano')}
                                    fullWidth
                                    {...register('Soprano')}
                                    error={!!errors.Soprano}
                                    helperText={errors.Soprano?.message}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <TextField
                                    label="Alto"
                                    fullWidth
                                    value={watch('Alto')}
                                    {...register('Alto')}
                                    error={!!errors.Alto}
                                    helperText={errors.Alto?.message}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <TextField
                                    label="Tenor"
                                    fullWidth
                                    value={watch('Tenor')}
                                    {...register('Tenor')}
                                    error={!!errors.Lyrics}
                                    helperText={errors.Lyrics?.message}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <TextField
                                    label="All Parts"
                                    fullWidth
                                    value={watch('AllParts')}
                                    {...register('AllParts')}
                                    error={!!errors.AllParts}
                                    helperText={errors.AllParts?.message}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <TextField
                                    label="Piano"
                                    fullWidth
                                    value={watch('Piano')}
                                    {...register('Piano')}
                                    error={!!errors.Piano}
                                    helperText={errors.Piano?.message}
                                />
                            </Grid2>
                            <Grid2 size={3}>
                                <Button type="submit" variant="contained">Save Details</Button>
                            </Grid2>
                            <Grid2 size={9} sx={{ align: 'right' }}>
                                <Button variant="contained" onClick={deleteTrack}   >Delete Track</Button>
                            </Grid2>
                            <Grid2 size={12}>
                                <Link to="/Music">
                                    <Button variant="contained">Back</Button>
                                </Link>
                            </Grid2>
                        </Grid2>
                    </form>
                </Grid2>
            </Grid2>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Booking submitted successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="error">
                    Error submitting booking!
                </Alert>
            </Snackbar>
        </Container>

    );
}