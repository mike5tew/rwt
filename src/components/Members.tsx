// The members component is a login page that allows the users to get to the music repository.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Button, Typography, Link, Divider, Paper, Snackbar, TextField, Fade, Box } from '@mui/material';
import { User, EmptyUser } from '../types/types.d';
// import the users array from the .env file

// the login is a simple form that takes in a username and password
// the username and password are stored in the state
// when the user clicks the login button, the username and password are checked
// if the username and password are correct, the user is redirected to the music repository


export default function Members() {
const history= useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);

  const handleLogin = () => {
    const user: User = { ...EmptyUser() };
    user.username = username;
    user.password = password;
    user.role = 'user';
     // send the user info to the login endpoint
    // if the user is authenticated, redirect to the music page
    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    }).then((response) => {
      if (response.status === 200) {
        // set a cookie to remember the user
        document.cookie = `username=${username}`;
        history('/membersPage');

      } else {
        // show a snackbar with an error message and delete the cookie
        // the snackbar is not currently working because the state is not updating
        document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        setOpen(true);
        console.log('Invalid username or password: '+response.status + ' ' + open);
      }
    });
  }
  
  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Choir Members
          </Typography>
          <TextField
            label="Username"
            
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
            Login
          </Button>
          <Divider sx={{ marginY: 2 }} />
          {/* <Link href="#" align="center">
            Forgot password?
          </Link> */}
        </Paper>
      </Grid>
      <Box sx={{ height: 8 }} />
      <Grid item xs={12}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        TransitionComponent={Fade}
        message="Invalid username or password"
      />
      <Box sx={{ height: 8 }} />
      </Grid>
    </Grid>
  );
};