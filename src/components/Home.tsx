import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { EmptyImageDetail, ImageDetail, Clip } from '../types/types.d';
import { randomImagesGET } from '../services/queries';

const server = "http://" + process.env.REACT_APP_URL + ':' + process.env.REACT_APP_PORT;

function srcset(image: string, width: number, rows: number, cols: number) {
  return {
    src: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=1 1x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=2 2x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=3 3x`,
  };
}

function processImage(Img: ImageDetail) {
  const imgDetail = EmptyImageDetail();
  imgDetail.ImageID = Img.ImageID;
  imgDetail.Filename = server + Img.Filename;
  // console.log('Filename:', imgDetail.Filename);
  imgDetail.Caption = Img.Caption;
  imgDetail.EventID = Img.EventID;
  if (Img.Width > Img.Height) {
    imgDetail.Rows = 2;
    imgDetail.Cols = 1;
  } else {
    imgDetail.Rows = 1;
    imgDetail.Cols = 2;
  }
  return (
    <ImageListItem key={imgDetail.ImageID} cols={imgDetail.Cols} rows={imgDetail.Rows}>
      <img
        {...srcset(imgDetail.Filename, 250, imgDetail.Rows, imgDetail.Cols)}
        alt={imgDetail.Caption}
        loading="lazy"
      />
      <ImageListItemBar title={imgDetail.Caption} />
    </ImageListItem>
  );
}
// This function takes in a clip and returns a string of HTML that will be rendered in the browser.
function ClipItem(clip: Clip) {
  if (clip.ClipURL.includes("youtube.com")) {
    // const youtubeEmbedUrl = clip.ClipURL.replace("watch?v=", "embed/");

    return (
      <ImageListItem key={clip.ClipID}>
        {clip.ClipURL}
        <ImageListItemBar title={clip.Caption} />
      </ImageListItem>
    );
  } 
  if (clip.ClipURL.includes("instagram.com")) {
    // console.log('clip.ClipURL:', clip.ClipURL)
    return (
      <ImageListItem key={clip.ClipID}>
        {clip.ClipURL}
        <ImageListItemBar title={clip.Caption} />
      </ImageListItem>
      );
  }   
  return (
    <ImageListItem key={clip.ClipID}>
      {clip.ClipURL}
      <ImageListItemBar title={clip.Caption} />
    </ImageListItem>
  );
}



function DisplayRandomImages(NumImages: number, ImgArray: ImageDetail[], ClipArray: Clip[]) {
  let imgArrayCopy = [...ImgArray];
  let clipArrayCopy = [...ClipArray];
  const elements = [];

  while (NumImages > 0) {
    if (imgArrayCopy.length === 0 && clipArrayCopy.length === 0) {
      return elements;
    }

    const random = Math.random();
    if (random < 0.5 && imgArrayCopy.length > 0) {
      const randomImageIndex = Math.floor(Math.random() * imgArrayCopy.length);
      elements.push(processImage(imgArrayCopy[randomImageIndex]));
      imgArrayCopy = imgArrayCopy.filter((_, index) => index !== randomImageIndex);
    } else if (clipArrayCopy.length > 0) {
      const randomClipIndex = Math.floor(Math.random() * clipArrayCopy.length);
      elements.push(ClipItem(clipArrayCopy[randomClipIndex]));
      clipArrayCopy = clipArrayCopy.filter((_, index) => index !== randomClipIndex);
    }
    NumImages--;
  }

  return elements;
}

export default function Home() {
  const [ImgArray, setImgArray] = useState<ImageDetail[]>([]);
  const [ClipArray, setClipArray] = useState<Clip[]>([]);

  useEffect(() => {
    randomImagesGET(6)
      .then(data => {
        console.log('data:', data);
        if (!data || typeof data === 'string') {
          console.error('Error:', data);
          return;
        }
        setClipArray(data.Clips);
        setImgArray(data.Images);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <Grid2 container spacing={3}>
      <Grid2 size={2}>
        <ImageList variant="masonry" gap={8} cols={1}>
          {DisplayRandomImages(3, ImgArray, ClipArray)}
        </ImageList>
      </Grid2>
      <Grid2 size={8}>
        <Typography variant="h2" component="div" sx={{ whiteSpace: "pre-wrap" }}>
          {localStorage.getItem('HomeTitle')}
        </Typography>
        <br />
        <Typography variant="h4" component="h4" sx={{ whiteSpace: "pre-wrap" }}>
          {localStorage.getItem('HomeText')}
        </Typography>
      </Grid2>
      <Grid2 size={2}>
        <ImageList variant="masonry" gap={8} cols={1}>
          {DisplayRandomImages(3, ImgArray, ClipArray)}
        </ImageList>
      </Grid2>
    </Grid2>
  );
}