// this is the home page for the choir website
// it contains a carousel with images of the choir and a brief description of the choir
// It will have links to an archive of past performances, a calendar of upcoming events, an appeal for new members, and a contact form
// It will also have a link to the choir's facebook and instagram pages

import React, { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
// the filenames for the images are in a json file in the src folder
// import images from '../images.json';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { EmptyImageDetail, ImageDetail } from '../types/types.d';

function srcset(image: string, width: number, rows: number, cols: number) {   
  return {
    src: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=1 1x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=2 2x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=3 3x`,
  };
}


export default function Home() {
const [images1to3, setImages1to3] = React.useState<ImageDetail[]>([]);
const [images4to6, setImages4to6] = React.useState<ImageDetail[]>([]);
useEffect(() => {
  if (images1to3.length === 0) {
    fetch('http://localhost:3001/images/6')
    .then(response => response.json())
    .then(data => {
   //this is adding the images to the images array twice
   // this is because the images array is being set to the data array twice on lines 116 and 117
   var imagesTp: ImageDetail[] = []   
   for (let i = 0; i < data.length; i++) {
        var imgDetail= EmptyImageDetail()
        imgDetail.imageID = data[i].imageID
        imgDetail.filename = data[i].filename
        imgDetail.caption = data[i].caption
        imgDetail.eventDetails.eventID = data[i].eventID
        if (data[i].width>data[i].height) {
          imgDetail.rows = 1
          imgDetail.cols = 2
        } else {
          imgDetail.rows = 2
          imgDetail.cols = 1
      }  
      imagesTp = [...imagesTp, imgDetail]
    }
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
    )
    .catch((error) => {
      console.error('Error:', error);
    }
    )
  }
}
, []);


    return (
      <Grid container spacing={3} >
        <Grid item xs={2}>
        <ImageList variant="masonry" gap={8} cols={1}>
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
    <Grid item xs={8}>
            <Typography variant="h2" component="div" line-break='auto' display='inline-block' sx={{ whiteSpace: "pre-wrap" }}>
              {localStorage.getItem('HomeTitle')}
              {/* //?.replace(/(\r\n|\r|\n)/g, '<br>')} */}
            </Typography>
          <br/>
            <Typography variant="h4" component="h4" display='inline-block' sx={{ whiteSpace: "pre-wrap" }}>
              {localStorage.getItem('HomeText')}
            </Typography>
            </Grid>
            <Grid item xs={2}>
            <ImageList variant="masonry" gap={8} cols={1}>
      {images4to6.map((item) => (
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
    );
}


