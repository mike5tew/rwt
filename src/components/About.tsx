import { useEffect, useState } from 'react';
import { Typography, Paper, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { Box } from '@mui/system';
import { randomImagesGET } from '../services/queries';
import { ImageDetail, Clip, EmptyImageDetail } from '../types/types.d';

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
  console.log('Filename:', imgDetail.Filename);
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

function ClipItem({ clip }: { clip: Clip }) {
  if (clip.ClipURL.includes("youtube.com")) {
    const youtubeEmbedUrl = clip.ClipURL.replace("watch?v=", "embed/");
    return (
      <ImageListItem key={clip.ClipID} cols={2} rows={1}>
        <iframe width="560" height="315" src={youtubeEmbedUrl} title={clip.Caption} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        <ImageListItemBar title={clip.Caption} />
      </ImageListItem>
    );
  } else if (clip.ClipURL.includes("instagram.com")) {
    return (
      <ImageListItem key={clip.ClipID} cols={2} rows={1}>
        <div dangerouslySetInnerHTML={{ __html: clip.ClipURL }} />
        <ImageListItemBar title={clip.Caption} />
      </ImageListItem>
    );
  } else {
    return (
      <ImageListItem key={clip.ClipID} cols={2} rows={1}>
        <iframe src={clip.ClipURL + "embed"} width="400" height="480" frameBorder="0" scrolling="no"></iframe>
        <ImageListItemBar title={clip.Caption} />
      </ImageListItem>
    );
  }
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
      elements.push(<ClipItem key={clipArrayCopy[randomClipIndex].ClipID} clip={clipArrayCopy[randomClipIndex]} />);
      clipArrayCopy = clipArrayCopy.filter((_, index) => index !== randomClipIndex);
    }
    NumImages--;
  }

  return elements;
}

export default function About() {
  const [ImgArray, setImgArray] = useState<ImageDetail[]>([]);
  const [ClipArray, setClipArray] = useState<Clip[]>([]);

  useEffect(() => {
    randomImagesGET(6)
      .then(data => {
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
            {DisplayRandomImages(3, ImgArray, ClipArray)}
          </ImageList>
        </Grid2>
      </Grid2>
    </Box>
  );
}