// This page is a blog style format showing images of past events and a brief description of the event. It will have links to the full archive of past events, a calendar of upcoming events, an appeal for new members, and a contact form. It will also have a link to the choir's facebook and instagram pages.
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { purple } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

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

// open the archive.json file and display the contents in a blog style format
// each entry will have a title, date, and imagenames
// the images will be displayed in a carousel

// the archive.json file will be in the public folder
// it will be an array of objects
// each object will have a title, date, content and imagenames
// the imagenames will be an array of strings
// the images will be in the public folder
// the imagenames will be the filenames of the images
const [archive, setArchive] = useState([] as ArchiveEntry[])

useEffect(() => {
    getArchive().then(data => setArchive(data));
}, []);



    async function getArchive() {
    try {
        const response = await fetch('archive.json');
        const data = await response.json();
        return data;
    } catch (error) {
        return console.error(error);
    }

}

return (
    <Container>
        <Row>
            {archive.map((entry, index) => (
                <Col key={index}>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={entry.imagenames[0]} />
                        <Card.Body>
                            <Card.Title>{entry.title}</Card.Title>
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
)
}

