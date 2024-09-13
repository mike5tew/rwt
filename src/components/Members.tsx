// The members component is a login page that allows the users to get to the music repository.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Button, Typography, Link, Divider, Paper, Snackbar, TextField, Fade, Box } from '@mui/material';

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
    if (username === 'Choir' && password === 'singing123') {
      history('/music');
    } else {
      setOpen(true);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Members
          </Typography>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
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
          <Link href="#" align="center">
            Forgot password?
          </Link>
        </Paper>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        TransitionComponent={Fade}
        message="Invalid username or password"
      />
    </Grid>
  );
};