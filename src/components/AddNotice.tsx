// This page adds a notice to the home page.  It will have a title, date, and content.  It will also have a link to the choir's facebook and instagram pages.

import React from 'react'
import { styled } from '@mui/material/styles';  
import { Container, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { purple } from '@mui/material/colors';
import { Typography } from '@mui/material';
// import from the public folder
// import notices from '../notices.json';


const ColorButton = styled(Button)({
    color: 'white',
    backgroundColor: purple[500],
    '&:hover': {
        backgroundColor: purple[700],
    },
    });

export default function AddNotice() {

    const [notices, setNotices] = React.useState<any[]>([]);
    React.useEffect(() => {
        fetch('http://localhost:3001/notices')
        .then(response => response.json())
        .then(data => {
            setNotices(data)
        })
        .catch((error) => {
            console.log(error)
        })
    }, [])

    return (
        <Container>
            <Grid container spacing={2}>
                {notices && notices.map((entry, index) => (
                    <Grid item xs={12} key={index}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <Typography variant="h2" component="h2">
                                        {entry.Title}
                                    </Typography>
                                </Card.Title>
                                <Card.Text>{entry.Date}</Card.Text>
                                <Card.Text>{entry.Description}</Card.Text>
                                <Link to={`/AddNotice/${index}`}>
                                    <ColorButton variant="contained">Read More</ColorButton>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}