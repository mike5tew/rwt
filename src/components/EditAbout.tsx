// This page allows the user to edit the text from the about and appeal pages.

import {useEffect, useState} from 'react';
import { Button, Typography, Divider, TextField, Grid } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { SiteInfoGET, SiteinfoPUT } from '../services/queries';
import { SiteInfo } from '../types/types.d';
import { NotificationSnackbar } from './shared/NotificationSnackbar';
import { ButtonGroup } from 'react-bootstrap';


const schema = yup.object().shape({
    about: yup.string().required(),
    appeal: yup.string().required(),
});


export default function EditAbout() {
    const { register, setValue, watch, getValues, handleSubmit, control, formState: { errors } } = useForm<SiteInfo>({
        defaultValues: {
            ID: 0,  
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


    const [snackMessage, setSnackMessage] = useState('');
    const [snackOpen, setSnackOpen] = useState(false);
    

        // id, HomeTitle, HomeText, AboutTitle, AboutText, ArchiveTitle, ArchiveText, NoticesTitle, NoticesText, BookingTitle, BookingText, MembersTitle, MembersText, AppealTitle, AppealText, SettingsTitle, SettingsText
        useEffect(() => {
            // get the info from the json file and set the default values
            // console.log(Info);
            if (document.cookie === '') {
                history('/Settings');
            }
            SiteInfoGET()
            .then(respon => respon)
            .then(data => {
                console.log(data);
                setValue('ID', data.ID);
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

        SiteinfoPUT(data).then((respon) => {
            console.log(respon);
            setSnackMessage('Changes saved');
            setSnackOpen(true);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <>
        <form onSubmit={handleSubmit(FormSubmitHandler)}>
        <Grid container spacing={2} >
            <Grid item xs={9} sx={{ paddingBottom: 2 }}>
                <Typography variant="h2" component="h2">
                    Content Editor
                </Typography>
            </Grid>
            <Grid item xs={3}>
            <Button variant="contained" type="submit">
                Save Changes
            </Button>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h4" component="h2">
                    About Page
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="About section title"
                    fullWidth
                    margin="normal"
                    {...register('AboutTitle')} 
                    value={watch('AboutTitle')}
                />
            </Grid>
            <Grid item xs={6}>
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
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h4" component="h2">
                    Appeal Page
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Appeal section title"                    
                    fullWidth
                    margin="normal"
                    value={watch('AppealTitle')}
                    {...register('AppealTitle')}
                />
                </Grid>
                <Grid item xs={6}>
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
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h4" component="h2">
                            Home Page
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Home section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('HomeTitle')}
                            {...register('HomeTitle')}
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h4" component="h2">
                            Archive Page
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Archive section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('ArchiveTitle')}
                            {...register('ArchiveTitle')}
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h4" component="h2">
                            Notices Page
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Notices section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('NoticesTitle')}
                            {...register('NoticesTitle')}
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h4" component="h2">
                            Booking Page
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Booking section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('BookingTitle')}
                            {...register('BookingTitle')}
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h4" component="h2">
                            Members Page
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Members section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('MembersTitle')}
                            {...register('MembersTitle')}
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h4" component="h2">
                            Settings Page
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Settings section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('SettingsTitle')}
                            {...register('SettingsTitle')}
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

        <Grid item xs={12}>
            <ButtonGroup>                
            <Button variant="contained" type="submit">
                Save Changes
            </Button>
            <Button variant="contained" onClick={() => history('/Settings')}>
                Back
            </Button>
            </ButtonGroup>
        </Grid>
        <Grid item xs={12}/>
        </Grid>
             <NotificationSnackbar
                 open={snackOpen}
                 message={snackMessage}
                 onClose={() => setSnackOpen(false)}
             />
        </form>
        </>
    );
}
