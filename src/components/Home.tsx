// this is the home page for the choir website
// it contains a carousel with images of the choir and a brief description of the choir
// It will have links to an archive of past performances, a calendar of upcoming events, an appeal for new members, and a contact form
// It will also have a link to the choir's facebook and instagram pages

import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Container, Row, Col } from 'react-bootstrap';
import { styled } from '@mui/material/styles';
import { Grid, Button, TextField, Typography, Link, Divider, FormControl, InputLabel, Select, MenuItem, Paper, Snackbar, List, ListItem, ListItemText, ListSubheader, DialogProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Icon, ButtonGroup,  ListItemButton, colors } from '@mui/material';
import { purple } from '@mui/material/colors';


const ColorButton = styled(Button)({
    color: 'white',
    backgroundColor: purple[500],
    '&:hover': {
        backgroundColor: purple[700],
    },
    });


export default function Home() {

    return (
    <Container>
      <Row>
        <Col>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://www.thespruce.com/thmb/7w2V9y0H3Zr4a2yVz5y6r7Z4K5Q=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/choir-56a6b6f15f9b58b7d0e4b5c6.jpg"
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>Choir</h3>
                <p>Choir is a group of people who sing together</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://www.thespruce.com/thmb/7w2V9y0H3Zr4a2yVz5y6r7Z4K5Q=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/choir-56a6b6f15f9b58b7d0e4b5c6.jpg"
                alt="Second slide"
              />
              <Carousel.Caption>
                <h3>Choir</h3>
                <p>Choir is a group of people who sing together</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://www.thespruce.com/thmb/7w2V9y0H3Zr4a2yVz5y6r7Z4K5Q=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/choir-56a6b6f15f9b58b7d0e4b5c6.jpg"
                alt="Third slide"
              />
              <Carousel.Caption>
                <h3>Choir</h3>
                <p>Choir is a group of people who sing together</p>
                </Carousel.Caption>
            </Carousel.Item>
            </Carousel>
        </Col>
        </Row>
        <Row>
          <Col>
            <Typography variant="h2" component="h2">
              Welcome to the Choir Website
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
