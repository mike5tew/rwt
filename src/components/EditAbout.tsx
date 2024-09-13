// This page allows the user to edit the text from the about and appeal pages.

import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Button, Typography, Link, Divider, Paper, Snackbar, TextField, Fade, Box } from '@mui/material';
import { purple } from '@mui/material/colors';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TransitionProps } from '@mui/material/transitions';
import Info from "../EditInfo.json"



const ColorButton = styled(Button)({
    color: 'white',
    backgroundColor: purple[500],
    '&:hover': {
        backgroundColor: purple[700],
    },
    });

const schema = yup.object().shape({
    about: yup.string().required(),
    appeal: yup.string().required(),
});

interface AllInfo {
    titleAbout: string,
    descriptionAbout: string,
    titleAppeal: string,
    descriptionAppeal: string
}


export default function EditAbout() {
    const { register, setValue, watch, getValues, handleSubmit, control, formState: { errors } } = useForm<AllInfo>({
        defaultValues: {
            titleAbout: "",
            descriptionAbout: "",
            titleAppeal: "",
            descriptionAppeal: ""
        }
        });

    const [snackOpen, setSnackOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [state, setState] = useState<{
            open: boolean;
            Transition: typeof Fade;
        }>({
            open: false,
            Transition: Fade,
    });

    const handleClick = () => {
            setSnackOpen(true);
            setOpen(true);
            console.log(open);
            Info[0].title = getValues('titleAbout');
            Info[0].description = getValues('descriptionAbout');
            Info[1].title = getValues('titleAppeal');
            Info[1].description = getValues('descriptionAppeal');
            
            // write the new info to the json file
            console.log(Info);
    };


    useEffect(() => {
        // get the info from the json file and set the default values
        // console.log(Info);
        for (let i = 0; i < Info.length; i++) {
            // console.log(Info[i].title);
            if (Info[i].type === 'About') {
                setValue('titleAbout', Info[i].title);
                setValue('descriptionAbout', Info[i].description);
            }
            if (Info[i].type === 'Appeal') {
                setValue('titleAppeal', Info[i].title);
                setValue('descriptionAppeal', Info[i].description);
            }
        }
    }
    , []);

    const FormSubmitHandler: SubmitHandler<AllInfo> = (data: AllInfo) => {
        console.log("HIT "+data);
        // replace the info in the json file with the new info
        for (let i = 0; i < Info.length; i++) {
            if (Info[i].title === 'about') {
                Info[i].title = data.titleAbout;
                Info[i].description = data.descriptionAbout;
            }
            if (Info[i].title === 'appeal') {
                Info[i].title = data.titleAppeal;
                Info[i].description = data.descriptionAppeal;
            }
        }
        // saving the new info to the json file
        console.log(Info);
        handleClick();
    }  



    return (
        <>
        <form onSubmit={handleSubmit(FormSubmitHandler)}>
        <Grid container spacing={2} >
            <Grid item xs={12} sx={{ paddingBottom: 2 }}>
                <Typography variant="h2" component="h2">
                    Content Editor
                </Typography>
            </Grid>
            {/* run through the array and lay out the info*/}
            <Grid item xs={12}>
                <TextField
                    label="About section title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    {...register('titleAbout')}
                    value={watch('titleAbout')}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="About section description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    maxRows={4}
                    value={watch('descriptionAbout')}
                    {...register('descriptionAbout')}
                />
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Appeal section title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={watch('titleAppeal')}
                    {...register('titleAppeal')}
                />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Appeal section description"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        multiline
                        maxRows={4}
                        value={watch('descriptionAppeal')}
                        {...register('descriptionAppeal')}
                    />
                    </Grid>
        <Grid item xs={12}>
            <ColorButton variant="contained" type="submit">
                Save Changes
            </ColorButton>
        <Grid item xs={12}/>
        </Grid>
        </Grid>
        <Snackbar
            open={snackOpen}
            autoHideDuration={6000}
            onClose={() => setSnackOpen(false)}
            message="Your updates have been saved"
        />
        </form>
        </>
    );
}
