// This page is the about page of the application. It is a simple page that displays some information about the choir.

import React, { useEffect, useState } from 'react';
import { Typography, Paper, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { Box } from '@mui/system';
import { randomImagesGET } from '../services/queries';
import { ImageDetail, IsMobile } from '../types/types.d';

export default function About() {
    // we need to create a grid to display the information from the aboutinfo.json file.  This should also have pictures of three random images (no image appearing twice) from the images.json file (not including images one or two).
// const [images, setImages] = useState<ImageDetail[]>([]);
const [mobile, setMobile] = useState<string>(IsMobile());
const [images1to3, setImages1to3] = React.useState<ImageDetail[]>([]);
const [images4to6, setImages4to6] = React.useState<ImageDetail[]>([]);
const [images, setImages] = React.useState<ImageDetail[]>([]);
function srcset(image: string, width: number, rows: number, cols: number) {   
    return {
      src: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=1 1x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=2 2x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=3 3x`,
    };
  }
  

// we are using axios to get the images from the database
// we are using the useEffect hook to get the images from the database
useEffect(() => {
  const fetchImages = async () => {
    const images = await randomImagesGET(6);
    if (images.length === 0) {
      return;
    }

    const images1to3 = images.slice(0, 3);
    const images4to6 = images.slice(3);

    setImages(images);
    setImages1to3(images1to3);
    setImages4to6(images4to6);
  };

  fetchImages();
}, []);

// {imageID: 6, filename: 'PHOTO-2024-05-12-21-16-31.jpg', caption: '', eventID: 0}
// {imageID: 3, filename: 'charity.jpeg', caption: '', eventID: 0}

//console.log(images);
    return (
        <Box> 
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <Paper>
                    <Typography variant="h4" align="left" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
                        {localStorage.getItem("AboutTitle")}</Typography>
                    </Paper>
                </Grid2>
                <Grid2 size={12}>
                    <Paper >
                        <Typography variant="body1" align="center" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
                            {localStorage.getItem("AboutText")}
                        </Typography>
                    </Paper>
                </Grid2>
                <Grid2 size={12}>
        <ImageList variant="masonry" gap={8} cols={3} rowHeight={164}>
      {//map the first three images in the images array to the carousel 
      images1to3.map((item, index) => (
        <ImageListItem key={index} >
          <img
            src={srcset("/images/"+item.Filename, 121, item.Rows, item.Cols).src}
            alt={item.Caption}
            loading="lazy"
          />
          <ImageListItemBar title={item.Caption} />
        </ImageListItem>
      ))}
    </ImageList>
    </Grid2>
            </Grid2>
        </Box>
    );
}