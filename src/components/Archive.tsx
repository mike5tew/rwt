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
// import the archive entry interface from the types file
import { ArchiveEntry, Clip, ImageDetail, EmptyArchiveEntry, EmptyClip, EmptyEventDetails, EmptyImageDetail, EventDetails } from  '../types/types.d';
import { BorderOuter } from '@mui/icons-material';
import {archives  } from '../services/queries';
import { resolve } from 'dns';
import db from '../services/db';


export default function Archive () {
const [archiveList, setArchiveList] = React.useState<ArchiveEntry[]>([]);

React.useEffect(() => {

var archives: ArchiveEntry[] = []
let archiveRetrieve = new Promise<ArchiveEntry[]>((resolve, reject) => {
db.query("SELECT archive.archiveID, choirevents.location, choirevents.eventDate, choirevents.title, archive.report, archive.eventID FROM choirevents join archive on archive.eventID=choirevents.eventID order by choirevents.eventDate LIMIT ?;", 5, (err: any, result: any) => {
    if(err) {
        reject("scadC "+err.message)
    } else {
        // archs is an array of archive objects
        for (var i = 0; i < result.length; i++) {
            var EventD: EventDetails = EmptyEventDetails();
            EventD.eventID = result[i].eventID;
            EventD.location = result[i].location;
            EventD.eventDate = result[i].eventDate;
            EventD.title = result[i].title;
            var archive = EmptyArchiveEntry();
            archive.archiveID = result[i].archiveID,
            archive.report= result[i].report
            archive.eventDetails = EventD;
            archives = [...archives, archive]   
        }
        resolve(archives)
        }
        for (var i = 0; i < archives.length; i++) {
            events = [...events, archives[i].eventDetails.eventID]
        }
    }
)
}
)
let events: number[] = []
// console.log(archives)
// console.log(events)
    // set up a promise to get all of the images and pass the array of events to the promise.  This requires a list of eventsID's to be passed to the promise
let imagesPromise = new Promise<ImageDetail[]>((resolve, reject) => {
    db.query("SELECT * FROM images WHERE eventID = ?", events, (err: any, result: any) => {
        if(err) {
            console.log(err)
            reject(err)
        } else {
            let images: ImageDetail[] = []
            for (var i = 0; i < result.length; i++) {
                var image = EmptyImageDetail();
                image.imageID = result[i].imageID;
                image.filename = result[i].filename;
                image.caption = result[i].caption;
                image.eventID = result[i].eventID;
                images = [...images, image]
            }
            resolve(images)
        }
    }
    )
})

const clipsPromise = new Promise<Clip[]>((resolve, reject) => {   
    db.query("SELECT * FROM clips WHERE eventID = ?", events, (err: any, result: any) => {
        if(err) {
            console.log(err)
            reject(err)
        } else {
            var clips: Clip[] = []
            for (var i = 0; i < result.length; i++) {
                var clp:Clip = EmptyClip();
                    clp.id= result[i].clipID,
                    clp.clipURL= result[i].clipURL,
                    clp.eventID= result[i].eventID,
                    clp.caption= result[i].caption
                clips = [...clips, clp]
            }
            resolve(clips)
        }
    }
    )
})

// we need to use the Promise.all() method to get the data from the promises
Promise.all([imagesPromise, clipsPromise])
.then((values) => {
    let images: ImageDetail[] = values[0];
    var clips: Clip[] = values[1];
    for (var i = 0; i < archives.length; i++) {
        for (var j = 0; j < images.length; j++) {
            if (archives[i].eventDetails.eventID == images[j].eventID) {
                archives[i].images = [...archives[i].images, images[j]]
            }
        }
        for (var j = 0; j < clips.length; j++) {
            if (archives[i].eventDetails.eventID == clips[j].eventID) {
                archives[i].clips = [...archives[i].clips, clips[j]]
            }
        }
    }
//        console.log(archives)
    setArchiveList(archives)
}
)
.catch((err) => {
    console.log(err)
    console.log("Archive not found")
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
            {archiveList && archiveList.map((item, index) => (
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


    




