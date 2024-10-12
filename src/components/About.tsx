// This page is the about page of the application. It is a simple page that displays some information about the choir.

import React, { useEffect, useState } from 'react';
import { Typography, Grid, Paper, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { Box } from '@mui/system';
import { randomImages } from '../services/queries';
import { ImageDetail, IsMobile } from '../types/types.d';

export default function About() {
    // we need to create a grid to display the information from the aboutinfo.json file.  This should also have pictures of three random images (no image appearing twice) from the images.json file (not including images one or two).
// const [images, setImages] = useState<ImageDetail[]>([]);
const [mobile, setMobile] = useState<string>(IsMobile());
const [images1to3, setImages1to3] = React.useState<ImageDetail[]>([]);
const [images4to6, setImages4to6] = React.useState<ImageDetail[]>([]);

function srcset(image: string, width: number, rows: number, cols: number) {   
    return {
      src: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=1 1x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=2 2x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=3 3x`,
    };
  }
  

// we are using axios to get the images from the database
// we are using the useEffect hook to get the images from the database
useEffect(() => {
    // we need to establish the size of the display
    // to do this we
   //this is adding the images to the images array twice
   // this is because the images array is being set to the data array twice on lines 116 and 117
   var imagesTp: ImageDetail[] = randomImages(6)
     var images1to3tp: ImageDetail[] = []
    for (let i = 0; i < imagesTp.length; i++) {
      images1to3tp = [...images1to3tp, imagesTp[i]]
      if (i === 2) {
        break
    }
  }
    setImages1to3(images1to3tp)
    var images4to6tp: ImageDetail[] = []
  if (imagesTp.length > 3) {
    for (let i = 3; i < imagesTp.length; i++) {
      images4to6tp = [...images4to6tp, imagesTp[i]]
    }    
    }
  setImages4to6(images4to6tp)
  }
  , []); // the empty array means that this will only run once when the page is loaded


// {imageID: 6, filename: 'PHOTO-2024-05-12-21-16-31.jpg', caption: '', eventID: 0}
// {imageID: 3, filename: 'charity.jpeg', caption: '', eventID: 0}

//console.log(images);
    return (
        <Box> 
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                    <Typography variant="h4" align="left" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
                        {localStorage.getItem("AboutTitle")}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper >
                        <Typography variant="body1" align="center" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
                            {localStorage.getItem("AboutText")}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
        <ImageList variant="masonry" gap={8} cols={3} rowHeight={164}>
      {//map the first three images in the images array to the carousel 
      images1to3.map((item) => (
        <ImageListItem key={item.imageID} >
          <img
            src={srcset("/images/"+item.filename, 121, item.rows, item.cols).src}
            alt={item.caption}
            loading="lazy"
          />
          <ImageListItemBar title={item.caption} />
        </ImageListItem>
      ))}
    </ImageList>
    </Grid>
            </Grid>
        </Box>
    );
}