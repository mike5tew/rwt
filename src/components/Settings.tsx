// This is settings login page.  A successful login will reveal the links to create archive entries, create events, and edit the text from the about and appeal pages.  It will also have a link to the choir's facebook and instagram pages.

import React, { useState } from 'react';
import { Button, Typography, Divider, Paper, TextField, Fade } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TransitionProps } from '@mui/material/transitions';
import { User, EmptyUser } from '../types/types.d';
import { useNavigate } from 'react-router-dom';
import { login } from 'src/services/queries';
import { NotificationSnackbar } from './shared/NotificationSnackbar';


const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

export default function Settings() {
  const { control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const history = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');


  const handleLogin = () => {
    const user: User = { ...EmptyUser() };
    user.Username = username;
    user.Password = password;

    login(user)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Invalid credentials');
        }
        const userData = await response.json();
        if (userData.Role === 'administrator') {
          document.cookie = `username=${userData.Username}`;
          document.cookie = `role=${userData.Role}`;
          history('/AdminDashboard');
        } else {
          setSnackMessage('Invalid username or password');
          setSnackOpen(true);
        }

      })
      .catch((error) => {
        console.error('Login error:', error);
        document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        setSnackMessage('Invalid username or password');
        setSnackOpen(true);
      });
  }

  return (

    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
      <Grid item xs={12}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Admin Login
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
      <Grid item xs={12}>
        {/* Feedback Messages */}
        <NotificationSnackbar
          open={snackOpen}
          message={snackMessage}
          onClose={() => setSnackOpen(false)}
        />
      </Grid>
    </Grid>

  );
}