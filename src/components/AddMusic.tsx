// This page allows you to add the googledrive Links for the tracks.  It is a form using react-hook-form

import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import { Container, Grid, Button, TextField, Typography, Select, FormControl, InputLabel, MenuItem, Snackbar, Alert, Fade } from '@mui/material';
import { purple } from '@mui/material/colors';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import Music from '../music.json';
import { TransitionProps } from '@mui/material/transitions';

const ColorButton = styled(Button)({
    color: 'white',
    backgroundColor: purple[500],
    '&:hover': {
        backgroundColor: purple[700],
    },
    });

const schema = yup.object().shape({
    title: yup.string().required(),
    link: yup.string().required(),
    

});


interface Music {
    
    // using the same schema as the music.json file
    id : number,
    trackName : string,
    lyrics : string,
    soprano : string,
    alto : string,
    tenor : string,
    allParts : string,
    piano : string
}


export default function AddMusic() {
    const { register, setValue, watch, getValues, handleSubmit, control, formState: { errors } } = useForm<Music>({
        defaultValues: {
            id : 0,
            trackName : "",
            lyrics : "",
            soprano : "",
            alto : "",
            tenor : "",
            allParts : "",
            piano : ""
        }
      });
      const [openError, setOpenError] = useState(false);
        const [state, setState] = useState<{
            open: boolean;
            Transition: React.ComponentType<TransitionProps & {children: React.ReactElement<any, any>;}>;
        }>({
            open: false,
            Transition: Fade,
        });
      const [snackOpen, setSnackOpen] = useState(false);
      const [open, setOpen] = React.useState(false);


      const FormSubmitHandler: SubmitHandler<Music> = (data: Music) => {
        if (data.id === 0) {
            addMusic(data);
        } else {
            editMusic(data);
        }
        console.log(data);
        Music.push(data);
        console.log(Music);
    };

    const addMusic = (data: Music) => {
        // find the highest id and add 1
        const id = Math.max(...Music.map((track) => track.id)) + 1;
        Music.push(data);
    }

    const editMusic = (data: Music) => {
        const index = Music.findIndex((track) => track.id === data.id);
        if (index !== -1) {
            Music[index] = data;
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
        const track = Music.find((track) => track.id === id);
        if (track) {
            setValue('trackName', track.trackName);
            setValue('lyrics', track.lyrics);
            setValue('soprano', track.soprano);
            setValue('alto', track.alto);
            setValue('tenor', track.tenor);
            setValue('allParts', track.allParts);
            setValue('piano', track.piano);
        }
    }

    const deleteTrack = () => {
        const id = getValues('id');
        const index = Music.findIndex((track) => track.id === id);
        if (index !== -1) {
            Music.splice(index, 1);
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
                <Grid item xs={12}>
                    <Typography variant="h4">Add or Edit Music Entries</Typography>
                </Grid>

                    {/* add a select containing all of the existing  */}
                    <Grid item xs={12}>
                        <FormControl fullWidth><InputLabel id="ExistingTracks">Venue</InputLabel>
                            <Controller name="id" control={control} render={({ field }) => (
                                <Select {...field}  {...register("id")} label="Existing Tracks" required
                                onChange={(e) => {  field.onChange(e); viewDetails(); }}>
                               
                                       
                                    <MenuItem key={0} value={0}>New Track</MenuItem>
                                    {Music && Music.map((track) =>
                                        <MenuItem key={track.id} value={track.id}>
                                            {track.trackName}
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
                                    value={watch('trackName')}
                                    fullWidth
                                    {...register('trackName')}
                                    error={!!errors.trackName}
                                    helperText={errors.trackName?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Lyrics"
                                    value={watch('lyrics')}
                                    fullWidth
                                    {...register('lyrics')}
                                    error={!!errors.lyrics}
                                    helperText={errors.lyrics?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Soprano"
                                    value={watch('soprano')}
                                    fullWidth
                                    {...register('soprano')}
                                    error={!!errors.soprano}
                                    helperText={errors.soprano?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Alto"
                                    fullWidth
                                    value={watch('alto')}
                                    {...register('alto')}
                                    error={!!errors.alto}
                                    helperText={errors.alto?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Tenor"
                                    fullWidth
                                    value={watch('tenor')}
                                    {...register('tenor')}
                                    error={!!errors.lyrics}
                                    helperText={errors.lyrics?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="All Parts"
                                    fullWidth
                                    value={watch('allParts')}
                                    {...register('allParts')}
                                    error={!!errors.allParts}
                                    helperText={errors.allParts?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Piano"
                                    fullWidth
                                    value={watch('piano')}
                                    {...register('piano')}
                                    error={!!errors.piano}
                                    helperText={errors.piano?.message}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <ColorButton type="submit" variant="contained">Save Details</ColorButton>
                            </Grid>
                            <Grid item xs={9} sx={{align: 'right'}}>
                                <ColorButton variant="contained" onClick={deleteTrack}   >Delete Track</ColorButton>
                            </Grid>
                            <Grid item xs={12}>
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