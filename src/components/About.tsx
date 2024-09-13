// This page is the about page of the application. It is a simple page that displays some information about the choir.

import React, { useEffect, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import { Box } from '@mui/system';
import Info from "../EditInfo.json"
import axios from 'axios';

export default function About() {
    // we need to create a grid to display the information from the aboutinfo.json file.  This should also have pictures of three random images (no image appearing twice) from the images.json file (not including images one or two).
const [images, setImages] = useState<any[]>([]);
// we are using axios to get the images from the database
// we are using the useEffect hook to get the images from the database
useEffect(() => {

    axios.get('http://localhost:3001/api/images3')
    .then(response => {
        setImages(response.data)
    })

    .catch((error) => {
        console.log(error)
    }
    )
}, [])

// {id: '1', img: 'PHOTO-2024-05-12-21-15-15.jpg', caption: 'Where was this taken?'}
interface Image {
    id: string;
    img: string;
    caption: string;
}
// take the first three images from the images array
images.splice(0, 3);
// shuffle the array so that the images are in a random order
images.sort(() => Math.random() - 0.5);

console.log(images);
    return (
        <Box>
            <Typography variant="h2" align="center" gutterBottom>About Us</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" gutterBottom>{Info[0].title}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" align="center" gutterBottom>{Info[0].description}</Typography>
                </Grid>
                {/* map out the images for a maximum of three */}
                {images && images.map((entry: Image, index: number) => (
                    <Grid item xs={4} key={index}>
                        <img src={"/images/"+entry.img} alt={"/images/"+entry.caption} style={{width: "100%"}} />
                    </Grid>
                ))}

            </Grid>
        </Box>
    );
}