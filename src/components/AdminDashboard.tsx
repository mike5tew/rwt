// This page provides the links to the pages that are available to the admin.  It will have links to the pages that allow the admin to add notices, add events, add images, and add music.  It will also have a link to the contact form.

import React from 'react';
import { Container, Typography, Paper, Button  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Grid2 from '@mui/material/Grid2';



export default function AdminDashboard() {
    const history = useNavigate();
    if (document.cookie === '') {
        console.log('No cookie');
        history('/Members');
    }
    
    return (
        <Container>
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <Paper>
                        <Typography variant="h3">Admin Dashboard</Typography>
                    </Paper>
                </Grid2> 
                <Grid2 size={12}>
                    <Button onClick={() => history('/EventAdd')} variant="contained">Add event</Button>
                </Grid2> 
                <Grid2 size={12}>
                    <Button onClick={() => history('/playListAdd')} variant="contained">Playlist Add</Button>
                </Grid2> 
                <Grid2 size={12}>
                    <Button onClick={() => history('/AddArchive')} variant="contained">Add archive</Button>
                </Grid2> 
                <Grid2 size={12}>
                    <Button onClick={() => history('/AddMusic')} variant="contained">Add music</Button>
                </Grid2> 
                <Grid2 size={12}>
                    <Button onClick={() => history('/EditTheme')} variant="contained">Edit colours</Button>
                </Grid2> 
                <Grid2 size={12}>
                    <Button onClick={() => history('/EditAbout')} variant="contained">Edit page content</Button>
                </Grid2> 
                <Grid2 size={12}>
                    <Button onClick={() => history('/ViewMessages')} variant="contained">View messages</Button>
                </Grid2> 

            </Grid2> 
        </Container>
    );
}