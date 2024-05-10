// This is just a flat page with a title and a message. It is an appeal to visitors to join the choir or suggest to friends who might be interested. It will have a link to the contact form.

import React from 'react';
import { Container } from 'react-bootstrap';
import { Typography } from '@mui/material';
// import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function Appeal() {
    return (
        <Container>
            <Typography variant="h1">Join the Choir</Typography>
            <Typography variant="h2">We are always looking for new members</Typography>
            <Typography variant="h3">If you are interested in joining the choir, please fill out the form below</Typography>
            {/* <Button variant="contained" color="primary" component={Link} to="/BookingForm">Join the Choir</Button> */}
        </Container>
    );
}