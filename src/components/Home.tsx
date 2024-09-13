// this is the home page for the choir website
// it contains a carousel with images of the choir and a brief description of the choir
// It will have links to an archive of past performances, a calendar of upcoming events, an appeal for new members, and a contact form
// It will also have a link to the choir's facebook and instagram pages

import React, { useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Container, Row, Col } from 'react-bootstrap';
import { styled } from '@mui/material/styles';
import { Grid, Button, Typography, Link, Divider, Paper, Snackbar } from '@mui/material';
import { purple } from '@mui/material/colors';
// the filenames for the images are in a json file in the src folder
// import images from '../images.json';
import Image from 'react-bootstrap/Image';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    // we want the size of the 
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}




const ColorButton = styled(Button)({
    color: 'white',
    backgroundColor: purple[500],
    '&:hover': {
        backgroundColor: purple[700],
    },
    });




export default function Home() {
const [images, setImages] = React.useState<any[]>([]);
useEffect(() => {
    fetch('http://localhost:3001/images')
    .then(response => response.json())
    .then(data => {
        setImages(data)
    })
    .catch((error) => {
        console.log(error)
    })
} , [])

// we have an array of image names from the images.json file
// we map over the array and create a carousel item for each image


    return (
    <Container>
      <Row>
        <Col>
        <ImageList variant="masonry" gap={8} cols={3}>
      {images.map((item) => (
        <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
          <img
            {...srcset("/images/"+item.img, 121, item.rows, item.cols)}
            alt={item.caption}
            loading="lazy"
          />
          <ImageListItemBar title={item.caption} />
        </ImageListItem>
      ))}
    </ImageList>

        </Col>
        </Row>
        <Row>
          <Col>
            <Typography variant="h2" component="h2">
              Welcome to our Choir Website
            </Typography>
          </Col>
        </Row>
        <Row>
          <Col>
            <Typography variant="h4" component="h4">
              We are a group of people who love to sing
            </Typography>
          </Col>
        </Row>
        <Row>
          <Col>
            <Typography variant="h4" component="h4">
              We have a lot of fun and we would love for you to join us
            </Typography>
          </Col>
        </Row>
</Container>
    );
}   

