// This page is a blog style format showing images of past events and a brief description of the event. It will have links to the full archive of past events, a calendar of upcoming events, an appeal for new members, and a contact form. It will also have a link to the choir's facebook and instagram pages.
import * as React from 'react';
// import { useState } from 'react';
// import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { purple } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import axios from 'axios';

const ColorButton = styled(Button)({
    color: 'white',
    backgroundColor: purple[500],
    '&:hover': {
        backgroundColor: purple[700],
    },
    });
    

interface ArchiveEntry {
    title: string;
    date: string;
    content: string;
    imagenames: string[];
}

export default function Archive () {
const [archive, setArchive] = React.useState<ArchiveEntry[]>([]);

React.useEffect(() => {

    // we need to use axios to get the data from the mysql  database 
    axios.get('http://localhost:3001/archive')
    .then((response) => {
        setArchive(response.data)
    })
    .catch((error) => {
        console.log(error)
    })
}
, [])



return (
    <Container>
        <Row>
            {archive && archive.map((entry, index) => (
                <Col key={index}>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={entry.imagenames[0]} />
                        <Card.Body>
                            <Card.Title>
                                <Typography variant="h2" component="h2">
                                {entry.title}
                                </Typography>
                                </Card.Title>
                            <Card.Text>{entry.date}</Card.Text>
                            <Link to={`/Archive/${index}`}>
                                <ColorButton variant="contained">Read More</ColorButton>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    </Container>
// you can write to a json file which is in the public folder but you cannot write to a json file which is in the src folder
)
}

