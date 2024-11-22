import React, { useEffect, useState } from 'react';
import { Typography, Paper, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { Box } from '@mui/system';
import { randomImagesGET } from '../services/queries';
import { ImageDetail, ScreenSize, getScreenSize } from '../types/types.d';

export default function About() {
  const [images1to3, setImages1to3] = useState<ImageDetail[]>([]);
  const [images4to6, setImages4to6] = useState<ImageDetail[]>([]);
  const [images, setImages] = useState<ImageDetail[]>([]);

  function srcset(image: string, width: number, rows: number, cols: number) {
    return {
      src: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=1 1x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=2 2x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=3 3x`,
    };
  }

  useEffect(() => {
    const fetchImages = async () => {
      console.log('fetchImages');
    
      const images = await randomImagesGET(6);
      if (typeof images === 'string') {
        console.error('Error:', images);
        return;
      } else {
        console.log(images);
        if (images.length > 0) {
          for (let i = 0; i < images.length; i++) {
            images[i].Caption = images[i].Caption;
            if (images[i].Filename.includes("placeholder") === false) {    
            images[i].Filename = "http://"+process.env.REACT_APP_URL+":"+process.env.REACT_APP_PORT+"/"+images[i].Filename;
            }
            console.log('Filename:', images[i].Filename);
            images[i].Rows = 1;
            images[i].Cols = 2;
            if (images[i].Width <= images[i].Height) {
              images[i].Rows = 2;
              images[i].Cols = 1;
            }
          }

          const images1to3 = images.slice(0, 3);
          const images4to6 = images.slice(3);

          setImages(images);
          setImages1to3(images1to3);
          setImages4to6(images4to6);
        }
      }
    };

    fetchImages(); // Call fetchImages only once when the component mounts
  }, []); // Empty dependency array ensures this runs only once

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={12}>
          <Paper>
            <Typography variant="h2" align="left" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
              {localStorage.getItem("AboutTitle")}
            </Typography>
          </Paper>
        </Grid2>
        <Grid2 size={12}>
          <Paper>
            <Typography variant="body1" align="center" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
              {localStorage.getItem("AboutText")}
            </Typography>
          </Paper>
        </Grid2>
        <Grid2 size={12}>
          <ImageList variant="masonry" gap={8} cols={3} rowHeight={164}>
            {images1to3.map((item, index) => (
              <ImageListItem key={index}>
                <img
                  src={srcset(item.Filename, 121, item.Rows, item.Cols).src}
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
