import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Link, Divider, Paper, Snackbar, TextField, Fade, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { User, EmptyUser } from '../types/types.d';
import { login } from 'src/services/queries';
import { NotificationSnackbar } from './shared/NotificationSnackbar';
// import the users array from the .env file

// the login is a simple form that takes in a username and password
// the username and password are stored in the state
// when the user clicks the login button, the username and password are checked
// if the username and password are correct, the user is redirected to the music repository

export default function Members() {
  const history = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const handleLogin = () => {
    const user: User = { ...EmptyUser() };
    user.Username = username;
    user.Password = password;
    user.Role = 'user';
    
    login(user)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Invalid credentials');
        }
        const userData = await response.json();
        document.cookie = `username=${userData.Username}`;
        document.cookie = `role=${userData.Role}`;
        history('/membersPage');
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
        <NotificationSnackbar
          open={snackOpen}
          message={snackMessage}
          onClose={() => setSnackOpen(false)}
        />
        <Box sx={{ height: 8 }} />
      </Grid>
    </Grid>
  );
};