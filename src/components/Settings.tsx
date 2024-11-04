// This is settings login page.  A successful login will reveal the links to create archive entries, create events, and edit the text from the about and appeal pages.  It will also have a link to the choir's facebook and instagram pages.

import React, {useState} from 'react';
import { styled } from '@mui/material/styles';
import { Button, Typography, Link, Divider, Paper, Snackbar, TextField, Fade, Box } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { purple } from '@mui/material/colors';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TransitionProps } from '@mui/material/transitions';
import { User, EmptyUser } from '../types/types.d';
import { useNavigate } from 'react-router-dom';
import { login } from 'src/services/queries';


const ColorButton = styled(Button)({
    color: 'white',
    backgroundColor: purple[500],
    '&:hover': {
        backgroundColor: purple[700],
    },
    });

const schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
});

export default function Settings() {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const history= useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const [snackOpen, setSnackOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [state, setState] = useState<{
        open: boolean;
        Transition: React.ComponentType<TransitionProps & {children: React.ReactElement<any, any>;}>;
      }>({
        open: false,
        Transition: Fade,
      });
    const handleClick = () => {
        setSnackOpen(true);
        setOpen(true);
        console.log(open);
    };

    const handleLogin = () => {
        const user: User = { ...EmptyUser() };
        user.Username = username;
        user.Password = password;
        user.Role = 'admin';
         // send the user info to the login endpoint
        // if the user is authenticated, redirect to the music page
        login(user).then((data) => {
          if (data) {
            document.cookie = `username=${username}`;
            history('/adminDashboard');
    
          } else {
            // show a snackbar with an error message
            document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
            setOpenError(true);
            console.log('Invalid username or password: ', data);
          }
        }
        );
      }

    return (
        <>

      <Grid2 container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
      <Grid2 size={12}>
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
      </Grid2>
    </Grid2>
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={() => setOpenError(false)}
        TransitionComponent={Fade}
        message="Invalid username or password"
      />
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message="Login successful"
      />
        
        </>

    );
}