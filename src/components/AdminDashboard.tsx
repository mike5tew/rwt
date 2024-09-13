// This page provides the links to the pages that are available to the admin.  It will have links to the pages that allow the admin to add notices, add events, add images, and add music.  It will also have a link to the contact form.

import React from 'react';
import { Container, Grid, Typography, Paper, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';




export default function AdminDashboard() {
    const history = useNavigate();
    if (document.cookie === '') {
        console.log('No cookie');
        history('/Members');
    }
    
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                        <Typography variant="h3">Admin Dashboard</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={() => history('/EventAdd')} variant="contained">Add event</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={() => history('/playListAdd')} variant="contained">Playlist Add</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={() => history('/AddArchive')} variant="contained">Add archive</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={() => history('/AddMusic')} variant="contained">Add music</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={() => history('/EditTheme')} variant="contained">Edit colours</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={() => history('/EditAbout')} variant="contained">Edit page content</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={() => history('/ViewMessages')} variant="contained">View messages</Button>
                </Grid>

            </Grid>
        </Container>
    );
}