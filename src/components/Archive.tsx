// This page is a blog style format showing images of past events and a brief description of the event. It will have links to the full archive of past events, a calendar of upcoming events, an appeal for new members, and a contact form. It will also have a link to the choir's facebook and instagram pages.
import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
// import grid from material ui
import { Grid, ImageList, ImageListItem, ImageListItemBar, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { purple } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import axios from 'axios';
// import the archive entry interface from the types file
import { ArchiveEntry } from  '../types/types.d';
import { BorderOuter } from '@mui/icons-material';
    


export default function Archive () {
const [archive, setArchive] = React.useState<ArchiveEntry[]>([]);

React.useEffect(() => {

    // we need to use axios to get the data from the mysql  database 
    axios.get('http://localhost:3001/archives/5')
    .then((response) => {
        console.log(response.data)
        setArchive(response.data)

    })
    .catch((error) => {
        console.log(error)
    })
}
, [])



    function updateclipname(clipURL: string) {
        var clipname = clipURL.replace("https://www.youtube.com/watch?v=", "")
        clipname = clipname.replace("watch?v=", "")
        clipname = clipname.replace("https://youtu.be/", "")
        clipname = clipname.replace("//", "/")
        clipname = clipname.replace("http://", "https://")
        return clipname
    }

    function returndatestring(eventDate: Date) {
        console.log("eventDate: "+eventDate)
        var date = new Date(eventDate)
        var day = date.getDate()
        console.log("day: "+day)
        // get the month in words
        var month = date.toLocaleString('default', { month: 'long' })
        console.log("month: "+month)
        // last 2 digits of the year
        var year = date.getFullYear().toString().slice(-2)
        var datestring = day.toString()+" "+month.toString()+" "+year.toString()
        return datestring
    }

return (
    <>
    <Grid container spacing={3} >
        <Grid item xs={12}>
            <Paper>
            <Typography variant="h2">{localStorage.getItem("ArchiveTitle")}</Typography>
            </Paper>
        </Grid>
        <Grid item xs={12}>
            <Paper>
            <Typography variant="h5" sx={{ whiteSpace: "pre-wrap" }}>
                    {localStorage.getItem("ArchiveText")}</Typography>
            </Paper>
        </Grid>
            {archive && archive.map((item, index) => (
            <>    {console.log("index: "+index)}
            <Grid item md={3} key={index}>
                <Paper>
                    <ImageList variant="masonry" gap={8} cols={1}>
                        {item.images && item.images.map((image) => (
                            <ImageListItem key={image.imageID}>
                                <img src={`http://localhost:3001/images/${image.filename}`} loading="lazy" />
                                <ImageListItemBar title={image.caption} />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Paper>
                </Grid><Grid item xs={12} sm={6} md={6}>
                        <Paper>
                            <Typography variant="h4">{item.eventDetails.title+" ("+returndatestring(item.eventDetails.eventDate)+")"}</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>{item.report}</Typography>
                        </Paper>
                    </Grid><Grid item xs={12} sm={6} md={3}>
                        {item.clips && item.clips.map((clip) => (
                            <Paper>
                                <Typography variant="h6">{clip.caption}</Typography>
                                {/* Insert a thumbnail of the youtube clip */}
                                <iframe width="100%" src={`https://www.youtube.com/embed/${updateclipname(clip.clipURL)}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                            </Paper>
                        ))}
                    </Grid></>
        ))}
    </Grid>
    </> 
)
}


    




