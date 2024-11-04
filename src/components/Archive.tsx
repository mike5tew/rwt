// This page is a blog style format showing images of past events and a brief description of the event. It will have links to the full archive of past events, a calendar of upcoming events, an appeal for new members, and a contact form. It will also have a link to the choir's facebook and instagram pages.
import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
// import grid from material ui
import { ImageList, ImageListItem, ImageListItemBar, Paper } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { purple } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
// import the archive entry interface from the types file
import { ArchiveEntry, Clip, ImageDetail, EmptyArchiveEntry, EmptyClip, EmptyEventDetails, EmptyImageDetail, EventDetails } from  '../types/types.d';
import { BorderOuter } from '@mui/icons-material';
import { ArchivesGET, ClipsFromEvent } from '../services/queries';
import { resolve } from 'dns';
import { set } from 'react-hook-form';


export default function Archive () {
const [archiveList, setArchiveList] = React.useState<ArchiveEntry[]>([]);
const [EventID, setEventID] = React.useState<number>(0);
var archives: ArchiveEntry[] = []
const url = process.env.REACT_APP_URL;
const port = process.env.REACT_APP_PORT;
React.useEffect(() => {
// get the archive data from the database and set the archiveList
ArchivesGET(5).then((archives) => { setArchiveList(archives) }).catch((error) => { console.log(error) });
}
, []);

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
    <Grid2  container spacing={3} >
        <Grid2  size={12}>
            <Paper>
            <Typography variant="h2">{localStorage.getItem("ArchiveTitle")}</Typography>
            </Paper>
        </Grid2 >
        <Grid2  size={12}>
            <Paper>
            <Typography variant="h5" sx={{ whiteSpace: "pre-wrap" }}>
                    {localStorage.getItem("ArchiveText")}</Typography>
            </Paper>
        </Grid2 >
            {archiveList && archiveList.map((item, index) => (
            <>    {console.log("index: "+index)}
            <Grid2  size={3} key={index}>
                <Paper>
                    <ImageList variant="masonry" gap={8} cols={1}>
                        {item.Images && item.Images.map((image) => (
                            <ImageListItem key={image.ImageID}>
                                <img src={`http://${url}:${port}/images/${image.Filename}`} loading="lazy" />
                                <ImageListItemBar title={image.Caption} />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Paper>
                </Grid2 >
                <Grid2  size={12} >
                        <Paper>
                            <Typography variant="h4">{item.EventDetails.Title+" ("+returndatestring(item.EventDetails.EventDate)+")"}</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>{item.Report}</Typography>
                        </Paper>
                    </Grid2 ><Grid2  size={12}>
                        {item.Clips && item.Clips.map((clip) => (
                            <Paper>
                                <Typography variant="h6">{clip.Caption}</Typography>
                                {/* Insert a thumbnail of the youtube clip */}
                                <iframe width="100%" src={`https://www.youtube.com/embed/${updateclipname(clip.ClipURL)}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                            </Paper>
                        ))}
                    </Grid2 ></>
        ))}
    </Grid2 >
    </> 
)
}





