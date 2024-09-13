// This page provides a list of music titles that download the mp3 when clicked.

import React from 'react';
import { Grid, Typography, Paper, Button, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import music from '../music.json';

// we loop through there music.json file and display the music titles with the links to the mp3 files being under the key names

export default function Music() {
    const history= useNavigate();

    return (
        <Grid container spacing={2}>
            <Grid item xs={10}>
                <Paper>
                    <Typography variant="h3">Music List</Typography>
                </Paper>
            </Grid>
            <Grid item xs={2}>
                <Button onClick={() => history('/')} variant="contained">Back</Button>
            </Grid>
            <Grid item xs={12}>
                <SimpleTreeView>
                    {music.map((entry, index) => (
                        entry.id === 0) ? null : (  
                        <TreeItem itemId={index.toString()} label={entry.trackName}>
                        <Link href={entry.lyrics} >
                            <TreeItem itemId={index.toString()+"l"} label="Lyrics" >Download</TreeItem>
                        </Link>
                        <Link href={entry.piano} >
                            <TreeItem itemId={index.toString()+"p"} label="Piano" >Download</TreeItem>
                        </Link>
                        <Link href={entry.allParts} >
                            <TreeItem itemId={index.toString()+"ap"} label="All Parts" >Download</TreeItem>
                        </Link>
                        <Link href={entry.soprano} >
                            <TreeItem itemId={index.toString()+"s"} label="Soprano" >Download</TreeItem>
                        </Link>
                        <Link href={entry.alto} >
                            <TreeItem itemId={index.toString()+"a"} label="Alto" >Download</TreeItem>
                        </Link>
                        <Link href={entry.tenor} >
                            <TreeItem itemId={index.toString()+"t"} label="Tenor" >Download</TreeItem>
                        </Link>
                        </TreeItem>
                    ))}
                </SimpleTreeView>
            </Grid>
        </Grid>
    );
  }