// This is settings login page.  A successful login will reveal the links to create archive entries, create events, and edit the text from the about and appeal pages.  It will also have a link to the choir's facebook and instagram pages.

import React, {useState} from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Button, Typography, Link, Divider, Paper, Snackbar, TextField, Fade, Box } from '@mui/material';
import { purple } from '@mui/material/colors';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TransitionProps } from '@mui/material/transitions';

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

    const onSubmit = (data: any) => {
        if (data.username === 'admin' && data.password === 'RWTChoir') {
            handleClick();
        } else {
            setOpenError(true);
        }
    };

    return (
        <>
                <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} >
            <Grid item xs={12} sx={{ paddingBottom: 2 }}>
                <Typography variant="h2" component="h2">
                    Login
                </Typography>
            </Grid>
                        <Grid item xs={5}   >
                            <TextField
                                id="username"
                                label="Username"
                                fullWidth
                                {...register('username')}
                                error={errors.username ? true : false}
                                helperText={errors.username ? errors.username.message : ''}
                            />
                        </Grid>
                        <Grid item   xs={2}>
                            &nbsp;
                        </Grid>
                        <Grid item   xs={5}>
                            <TextField
                                id="password"
                                label="Password"
                                fullWidth
                                type="password"
                                {...register('password')}
                                error={errors.password ? true : false}
                                helperText={errors.password ? errors.password.message : ''}
                            />
                        </Grid>
                        <Grid item   xs={12}>
                            <ColorButton variant="contained" type="submit">
                                Login
                            </ColorButton>
                        </Grid>
                            { open && 
                                <>
                                <Grid item   xs={4}>
                                <Link href="/CreateArchive" >
                                    <Button>Create Archive Entry</Button>
                                </Link>
                                </Grid>
                                <Grid item   xs={4}>
                                <Link href="/CreateEvent">
                                    <Button>Create Event</Button>
                                </Link>
                                </Grid>
                                <Grid item   xs={4}>
                                <Link href="/EditAbout">
                                    <Button>Edit About</Button>
                                </Link>
                                </Grid>
                                </>                       
                            }

            </Grid>
                </form>

            <Snackbar
                open={snackOpen}
                autoHideDuration={6000}
                onClose={() => setSnackOpen(false)}
                message="Login successful"
            />
            <Snackbar
                open={openError}
                autoHideDuration={6000}
                onClose={() => setOpenError(false)}
                message="Login failed"
            />
        </>
    );
}