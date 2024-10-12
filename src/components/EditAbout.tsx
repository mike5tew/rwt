// This page allows the user to edit the text from the about and appeal pages.

import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import { Button, Typography, Divider, Snackbar, TextField, Fade } from '@mui/material';
import  Grid from '@mui/material/Grid2';
import { purple } from '@mui/material/colors';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { siteinfo, siteinfoPUT } from '../services/queries';
import { SiteInfo } from '../types/types.d';


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


export default function EditAbout() {
    const { register, setValue, watch, getValues, handleSubmit, control, formState: { errors } } = useForm<SiteInfo>({
        defaultValues: {
            id: 0,  
            HomeTitle: "",
            HomeText: "",
            AboutTitle: "",
            AboutText: "",
            ArchiveTitle: "",
            ArchiveText: "",
            NoticesTitle: "",
            NoticesText: "",
            BookingTitle: "",
            BookingText: "",
            MembersTitle: "",
            MembersText: "",
            AppealTitle: "",
            AppealText: "",
            SettingsTitle: "",
            SettingsText: ""
        }
    });
    const history = useNavigate();


    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [state, setState] = useState<{
        open: boolean;
        Transition: typeof Fade;
    }>({
        open: false,
        Transition: Fade,
    });
    

        // id, HomeTitle, HomeText, AboutTitle, AboutText, ArchiveTitle, ArchiveText, NoticesTitle, NoticesText, BookingTitle, BookingText, MembersTitle, MembersText, AppealTitle, AppealText, SettingsTitle, SettingsText
        useEffect(() => {
            // get the info from the json file and set the default values
            // console.log(Info);
            if (document.cookie === '') {
                history('/Settings');
            }
            siteinfo()
            .then(response => response)
            .then(data => {
                console.log(data);
                setValue('id', data.id);
                setValue('HomeTitle', data.HomeTitle);
                setValue('HomeText', data.HomeText);
                setValue('AboutTitle', data.AboutTitle);
                setValue('AboutText', data.AboutText);
                setValue('ArchiveTitle', data.ArchiveTitle);
                setValue('ArchiveText', data.ArchiveText);
                setValue('NoticesTitle', data.NoticesTitle);
                setValue('NoticesText', data.NoticesText);
                setValue('BookingTitle', data.BookingTitle);
                setValue('BookingText', data.BookingText);
                setValue('MembersTitle', data.MembersTitle);
                setValue('MembersText', data.MembersText);
                setValue('AppealTitle', data.AppealTitle);
                setValue('AppealText', data.AppealText);
                setValue('SettingsTitle', data.SettingsTitle);
                setValue('SettingsText', data.SettingsText);
                
            })
            .catch((error) => {
                console.error('Error:', error);
            }
        )
    }
    , []);
    
    //id, HomeTitle, HomeText, AboutTitle, AboutText, ArchiveTitle, ArchiveText, NoticesTitle, NoticesText, BookingTitle, BookingText, MembersTitle, MembersText, AppealTitle, AppealText, SettingsTitle, SettingsText
    const FormSubmitHandler: SubmitHandler<SiteInfo> = (data: SiteInfo) => {
        // we need to convert the data to a json object

        siteinfoPUT(data).then((response) => {
            console.log(response);
            setSnackOpen(true);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    
        

    return (
        <>
        <form onSubmit={handleSubmit(FormSubmitHandler)}>
        <Grid container spacing={2} >
            <Grid size={12} sx={{ paddingBottom: 2 }}>
                <Typography variant="h2" component="h2">
                    Content Editor
                </Typography>
            </Grid>
            {/* run through the array and lay out the info*/}
            <Grid size={12}>
                <Typography variant="h2" component="h2">
                    About Page
                </Typography>
            </Grid>
            <Grid size={6}>
                <TextField
                    label="About section title"
                    fullWidth
                    margin="normal"
                    {...register('AboutTitle')} 
                    value={watch('AboutTitle')}
                />
            </Grid>
            <Grid size={6}>
                <TextField
                    label="About section description"                    
                    fullWidth
                    margin="normal"
                    multiline
                    maxRows={4}
                    value={watch('AboutText')}
                    {...register('AboutText')}
                />
            </Grid>
            <Grid size={12}>
                <Divider />
            </Grid>
            <Grid size={12}>
                <Typography variant="h2" component="h2">
                    Appeal Page
                </Typography>
            </Grid>
            <Grid size={6}>
                <TextField
                    label="Appeal section title"                    
                    fullWidth
                    margin="normal"
                    value={watch('AppealTitle')}
                    {...register('AppealTitle')}
                />
                </Grid>
                <Grid size={6}>
                    <TextField
                        label="Appeal section description"
                        multiline
                        maxRows={4}
     
                        fullWidth
                        margin="normal"
                        value={watch('AppealText')}
                        {...register('AppealText')}
                    />
                    </Grid>
                    <Grid size={12}>
                        <Divider />
                    </Grid>
                    <Grid size={12}>
                        <Typography variant="h2" component="h2">
                            Home Page
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Home section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('HomeTitle')}
                            {...register('HomeTitle')}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Home section description"
                            
                            fullWidth
                            margin="normal"
                            multiline
                            maxRows={4}
                            value={watch('HomeText')}
                            {...register('HomeText')}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Divider />
                    </Grid>
                    <Grid size={12}>
                        <Typography variant="h2" component="h2">
                            Archive Page
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Archive section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('ArchiveTitle')}
                            {...register('ArchiveTitle')}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Archive section description"
                            
                            fullWidth
                            margin="normal"
                            multiline
                            maxRows={4}
                            value={watch('ArchiveText')}
                            {...register('ArchiveText')}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Divider />
                    </Grid>
                    <Grid size={12}>
                        <Typography variant="h2" component="h2">
                            Notices Page
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Notices section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('NoticesTitle')}
                            {...register('NoticesTitle')}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Notices section description"
                            
                            fullWidth
                            margin="normal"
                            multiline
                            maxRows={4}
                            value={watch('NoticesText')}
                            {...register('NoticesText')}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Divider />
                    </Grid>
                    <Grid size={12}>
                        <Typography variant="h2" component="h2">
                            Booking Page
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Booking section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('BookingTitle')}
                            {...register('BookingTitle')}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Booking section description"
                            
                            fullWidth
                            margin="normal"
                            multiline
                            maxRows={4}
                            value={watch('BookingText')}
                            {...register('BookingText')}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Divider />
                    </Grid>
                    <Grid size={12}>
                        <Typography variant="h2" component="h2">
                            Members Page
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Members section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('MembersTitle')}
                            {...register('MembersTitle')}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Members section description"
                            
                            fullWidth
                            margin="normal"
                            multiline
                            maxRows={4}
                            value={watch('MembersText')}
                            {...register('MembersText')}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Divider />
                    </Grid>
                    <Grid size={12}>
                        <Typography variant="h2" component="h2">
                            Settings Page
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Settings section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('SettingsTitle')}
                            {...register('SettingsTitle')}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Settings section description"
                            
                            fullWidth
                            margin="normal"
                            multiline
                            maxRows={4}
                            value={watch('SettingsText')}
                            {...register('SettingsText')}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Divider />
                    </Grid>

        <Grid size={12}>
            <ColorButton variant="contained" type="submit">
                Save Changes
            </ColorButton>
        <Grid size={12}/>
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
