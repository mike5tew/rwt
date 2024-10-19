// This page allows you to add the googledrive Links for the tracks.  It is a form using react-hook-form

import React, { useState } from 'react'
import { Container, Button, TextField, Typography, Select, FormControl, InputLabel, MenuItem, Snackbar, Alert, Fade } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { Music, MusicPOST, musicListPUT, musicListDELETE } from '../services/queries';
import { TransitionProps } from '@mui/material/transitions';
import { MusicTrack } from '../types/types';


const schema = yup.object().shape({
    title: yup.string().required(),
    link: yup.string().required(),

});




export default function AddMusic() {
    const { register, setValue, watch, getValues, handleSubmit, control, formState: { errors } } = useForm<MusicTrack>({
        defaultValues: {
            id: 0,
            trackName: "",
            lyrics: "",
            soprano: "",
            alto: "",
            tenor: "",
            allParts: "",
            piano: ""
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
        if (data.id === 0) {
            var newTrack: MusicTrack = MusicPOST(data)
            if (newTrack) {
                setOpen(true);
                setMusicList([...musicList, newTrack]);
            } else {
                setOpenError(true);
            }
        } else {
            musicListPUT(data);
            //replace the existing track with the new data in the array
            for (var i = 0; i < musicList.length; i++) {
                if (musicList[i].id === data.id) {
                    musicList[i] = data;
                    break;
                }
            }
            setMusicList(musicList);
            setOpenError(true);
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
    const viewDetails = () => {
        const id = getValues('id');
        // use the music function from the queries page to get the track details
        Music(id).then((mtrack) => {

        if (mtrack) {
            setValue('trackName', mtrack[0].trackName);
            setValue('lyrics', mtrack[0].lyrics);
            setValue('soprano', mtrack[0].soprano);
            setValue('alto', mtrack[0].alto);
            setValue('tenor', mtrack[0].tenor);
            setValue('allParts', mtrack[0].allParts);
            setValue('piano', mtrack[0].piano);
        }
    }
    )
    }

    const deleteTrack = () => {
        const id = getValues('id');
        if (id > 0) {
            const deleteResponse:string = musicListDELETE(id);
            if (deleteResponse === 'success') {
                setOpen(true);
                // remove the track from the array
                setMusicList(musicList.filter((track) => track.id !== id));
            } else {
                setOpenError(true);
            }
        }
        // reset the form
        setValue('id', 0);
        setValue('trackName', '');
        setValue('lyrics', '');
        setValue('soprano', '');
        setValue('alto', '');
        setValue('tenor', '');
        setValue('allParts', '');
        setValue('piano', '');
        // snackbar the deletion

    }

    return (

        <Container>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Typography variant="h4">Add or Edit Music Entries</Typography>
                </Grid>

                {/* add a select containing all of the existing  */}
                <Grid size={12}>
                    <FormControl fullWidth><InputLabel id="ExistingTracks">Venue</InputLabel>
                        <Controller name="id" control={control} render={({ field }) => (
                            <Select {...field}  {...register("id")} label="Existing Tracks" required
                                onChange={(e) => { field.onChange(e); viewDetails(); }}>


                                <MenuItem key={0} value={0}>New Track</MenuItem>
                                {musicList && musicList.map((track) =>
                                    <MenuItem key={track.id} value={track.id}>
                                        {track.trackName}
                                    </MenuItem>
                                )}
                            </Select>
                        )} />
                    </FormControl>
                </Grid>
                <Grid size={12}>
                    <Typography variant="h4">Track Details</Typography>
                </Grid>
                <Grid size={12}>
                    <form onSubmit={handleSubmit(FormSubmitHandler)}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    variant='outlined'
                                    label="Track Name"
                                    placeholder='Track Name'
                                    value={watch('trackName')}
                                    fullWidth
                                    {...register('trackName')}
                                    error={!!errors.trackName}
                                    helperText={errors.trackName?.message}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Lyrics"
                                    value={watch('lyrics')}
                                    fullWidth
                                    {...register('lyrics')}
                                    error={!!errors.lyrics}
                                    helperText={errors.lyrics?.message}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Soprano"
                                    value={watch('soprano')}
                                    fullWidth
                                    {...register('soprano')}
                                    error={!!errors.soprano}
                                    helperText={errors.soprano?.message}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Alto"
                                    fullWidth
                                    value={watch('alto')}
                                    {...register('alto')}
                                    error={!!errors.alto}
                                    helperText={errors.alto?.message}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Tenor"
                                    fullWidth
                                    value={watch('tenor')}
                                    {...register('tenor')}
                                    error={!!errors.lyrics}
                                    helperText={errors.lyrics?.message}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="All Parts"
                                    fullWidth
                                    value={watch('allParts')}
                                    {...register('allParts')}
                                    error={!!errors.allParts}
                                    helperText={errors.allParts?.message}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Piano"
                                    fullWidth
                                    value={watch('piano')}
                                    {...register('piano')}
                                    error={!!errors.piano}
                                    helperText={errors.piano?.message}
                                />
                            </Grid>
                            <Grid size={3}>
                                <Button type="submit" variant="contained">Save Details</Button>
                            </Grid>
                            <Grid size={9} sx={{ align: 'right' }}>
                                <Button variant="contained" onClick={deleteTrack}   >Delete Track</Button>
                            </Grid>
                            <Grid size={12}>
                                <Link to="/Music">
                                    <Button variant="contained">Back</Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
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