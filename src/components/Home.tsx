import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { EmptyImageDetail, ImageDetail } from '../types/types.d';
import { randomImagesGET } from '../services/queries';

function srcset(image: string, width: number, rows: number, cols: number) {
  return {
    src: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=1 1x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=2 2x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=3 3x`,
  };
}

export default function Home() {
  const [images1to3, setImages1to3] = useState<ImageDetail[]>([]);
  const [images4to6, setImages4to6] = useState<ImageDetail[]>([]);

  useEffect(() => {
    if (images1to3.length === 0) {
      randomImagesGET(6)
        .then(data => {
          const imagesTp: ImageDetail[] = data.map((item: any) => {
            const imgDetail = EmptyImageDetail();
            imgDetail.ImageID = item.ImageID;
            imgDetail.Filename = item.Filename;
            imgDetail.Caption = item.caption;
            imgDetail.EventDetails.EventID = item.eventID;
            if (item.Width > item.Height) {
              imgDetail.Rows = 1;
              imgDetail.Cols = 2;
            } else {
              imgDetail.Rows = 2;
              imgDetail.Cols = 1;
            }
            return imgDetail;
          });

          setImages1to3(imagesTp.slice(0, 3));
          setImages4to6(imagesTp.slice(3));
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [images1to3.length]);

  return (
    <Grid2 container spacing={3}>
      <Grid2 size={2}>
        <ImageList variant="masonry" gap={8} cols={1}>
          {images1to3.map((item) => (
            <ImageListItem key={item.ImageID}>
              <img
                {...srcset(`/images/${item.Filename}`, 121, item.Rows, item.Cols)}
                alt={item.Caption}
                loading="lazy"
              />
              <ImageListItemBar title={item.Caption} />
            </ImageListItem>
          ))}
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
          {images4to6.map((item) => (
            <ImageListItem key={item.ImageID}>
              <img
                {...srcset(`/images/${item.Filename}`, 121, item.Rows, item.Cols)}
                alt={item.Caption}
                loading="lazy"
              />
              <ImageListItemBar title={item.Caption} />
            </ImageListItem>
          ))}
        </ImageList>
      </Grid2>
    </Grid2>
  );
}
