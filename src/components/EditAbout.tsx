// This page allows the user to edit the text from the about and appeal pages.

import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Button, Typography, Divider, Snackbar, TextField, Fade } from '@mui/material';
import { purple } from '@mui/material/colors';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';


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
    titleHome: string,
    descriptionHome: string,
    titleArchive: string,
    descriptionArchive: string,
    titleNotices: string,
    descriptionNotices: string,
    titleBooking: string,
    descriptionBooking: string,
    titleMembers: string,
    descriptionMembers: string,
    titleSettings: string,
    descriptionSettings: string
}

export default function EditAbout() {
    const { register, setValue, watch, getValues, handleSubmit, control, formState: { errors } } = useForm<AllInfo>({
        defaultValues: {
            titleAbout: "",
            descriptionAbout: "",
            titleAppeal: "",
            descriptionAppeal: "",
            titleHome: "",
            descriptionHome: "",
            titleArchive: "",
            descriptionArchive: "",
            titleNotices: "",
            descriptionNotices: "",
            titleBooking: "",
            descriptionBooking: "",
            titleMembers: "",  
            descriptionMembers: "",
            titleSettings: "",
            descriptionSettings: ""
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
    
    // const handleClick = () => {
        //         setSnackOpen(true);
        //         setOpen(true);
        //         console.log(open);
        //         Info[0].title = getValues('titleAbout');
        //         Info[0].description = getValues('descriptionAbout');
        //         Info[1].title = getValues('titleAppeal');
        //         Info[1].description = getValues('descriptionAppeal');
        
        //         // write the new info to the json file
        //         console.log(Info);
        // };
        
        // id, HomeTitle, HomeText, AboutTitle, AboutText, ArchiveTitle, ArchiveText, NoticesTitle, NoticesText, BookingTitle, BookingText, MembersTitle, MembersText, AppealTitle, AppealText, SettingsTitle, SettingsText
        useEffect(() => {
            // get the info from the json file and set the default values
            // console.log(Info);
            if (document.cookie === '') {
                history('/Settings');
            }
            fetch('http://localhost:3001/siteinfo')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setValue('titleAbout', data[0].AboutTitle);
                setValue('descriptionAbout', data[0].AboutText);
                setValue('titleAppeal', data[0].AppealTitle);
                setValue('descriptionAppeal', data[0].AppealText);
                setValue('titleHome', data[0].HomeTitle);
                setValue('descriptionHome', data[0].HomeText);
                setValue('titleArchive', data[0].ArchiveTitle);
                setValue('descriptionArchive', data[0].ArchiveText);
                setValue('titleNotices', data[0].NoticesTitle);
                setValue('descriptionNotices', data[0].NoticesText);
                setValue('titleBooking', data[0].BookingTitle);
                setValue('descriptionBooking', data[0].BookingText);
                setValue('titleMembers', data[0].MembersTitle);
                setValue('descriptionMembers', data[0].MembersText);
                setValue('titleSettings', data[0].SettingsTitle);
                setValue('descriptionSettings', data[0].SettingsText);
            })
            .catch((error) => {
                console.error('Error:', error);
            }
        )
    }
    , []);
    
    //id, HomeTitle, HomeText, AboutTitle, AboutText, ArchiveTitle, ArchiveText, NoticesTitle, NoticesText, BookingTitle, BookingText, MembersTitle, MembersText, AppealTitle, AppealText, SettingsTitle, SettingsText
    const FormSubmitHandler: SubmitHandler<AllInfo> = (data: AllInfo) => {
        // we need to convert the data to a json object

        fetch('http://localhost:3001/siteinfoPUT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => {
            console.log(response);
            setSnackMessage('Your updates have been saved');
            setSnackOpen(true);
        }).catch((error) => {
            console.log(error);
        }
        );
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
                <Typography variant="h2" component="h2">
                    About Page
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="About section title"
                    fullWidth
                    margin="normal"
                    {...register('titleAbout')}
                    value={watch('titleAbout')}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="About section description"                    
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
                <Typography variant="h2" component="h2">
                    Appeal Page
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Appeal section title"                    
                    fullWidth
                    margin="normal"
                    value={watch('titleAppeal')}
                    {...register('titleAppeal')}
                />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Appeal section description"
                        multiline
                        maxRows={4}
     
                        fullWidth
                        margin="normal"
                        value={watch('descriptionAppeal')}
                        {...register('descriptionAppeal')}
                    />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h2" component="h2">
                            Home Page
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Home section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('titleHome')}
                            {...register('titleHome')}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Home section description"
                            
                            fullWidth
                            margin="normal"
                            multiline
                            maxRows={4}
                            value={watch('descriptionHome')}
                            {...register('descriptionHome')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h2" component="h2">
                            Archive Page
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Archive section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('titleArchive')}
                            {...register('titleArchive')}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Archive section description"
                            
                            fullWidth
                            margin="normal"
                            multiline
                            maxRows={4}
                            value={watch('descriptionArchive')}
                            {...register('descriptionArchive')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h2" component="h2">
                            Notices Page
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Notices section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('titleNotices')}
                            {...register('titleNotices')}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Notices section description"
                            
                            fullWidth
                            margin="normal"
                            multiline
                            maxRows={4}
                            value={watch('descriptionNotices')}
                            {...register('descriptionNotices')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h2" component="h2">
                            Booking Page
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Booking section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('titleBooking')}
                            {...register('titleBooking')}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Booking section description"
                            
                            fullWidth
                            margin="normal"
                            multiline
                            maxRows={4}
                            value={watch('descriptionBooking')}
                            {...register('descriptionBooking')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h2" component="h2">
                            Members Page
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Members section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('titleMembers')}
                            {...register('titleMembers')}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Members section description"
                            
                            fullWidth
                            margin="normal"
                            multiline
                            maxRows={4}
                            value={watch('descriptionMembers')}
                            {...register('descriptionMembers')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h2" component="h2">
                            Settings Page
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Settings section title"
                            
                            fullWidth
                            margin="normal"
                            value={watch('titleSettings')}
                            {...register('titleSettings')}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Settings section description"
                            
                            fullWidth
                            margin="normal"
                            multiline
                            maxRows={4}
                            value={watch('descriptionSettings')}
                            {...register('descriptionSettings')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
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
