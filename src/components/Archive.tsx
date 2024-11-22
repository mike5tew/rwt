import * as React from 'react';
import { useState, useEffect } from 'react';
import { ImageList, ImageListItem, ImageListItemBar, Paper, Typography, Snackbar } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { ArchivesGET } from '../services/queries';
import { ArchiveEntry } from '../types/types.d';

export default function Archive() {
    const [archiveList, setArchiveList] = useState<ArchiveEntry[]>([]);
    const url = process.env.REACT_APP_URL;
    const port = process.env.REACT_APP_PORT;
    const [Snackopen, setSnackOpen] = useState(false);
    const [SnackMessage, setSnackMessage] = useState('');
    const handleClose = () => {
        setSnackOpen(false);
    };

    useEffect(() => {
        ArchivesGET(5)
            .then((archives) => {
                console.log(archives.length);
                archives.forEach((archive) => {
                    archive.Images = archive.Images.map((image) => {
                        image.Filename = `http://${url}:${port}/${image.Filename}`;
                        console.log('Filename:', image.Filename);
                        return image;
                    });
                });
            
                setArchiveList(archives);
            }
            )
            .catch((error) => console.log(error));
    }, []);

    function updateClipName(clipURL: string) {
        return clipURL
            .replace("https://www.youtube.com/watch?v=", "")
            .replace("watch?v=", "")
            .replace("https://youtu.be/", "")
            .replace("//", "/")
            .replace("http://", "https://");
    }

    function returnDateString(eventDate: Date) {
        const date = new Date(eventDate);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear().toString().slice(-2);
        return `${day} ${month} ${year}`;
    }

    return (
        <>
  <Grid2 container spacing={3}>
                <Grid2 size={12}>
                    <Paper>
                        <Typography variant="h2">{localStorage.getItem("ArchiveTitle")}</Typography>
                    </Paper>
                </Grid2>
                <Grid2 size={12}>
                    <Paper>
                        <Typography variant="h5" sx={{ whiteSpace: "pre-wrap" }}>
                            {localStorage.getItem("ArchiveText")}
                        </Typography>
                    </Paper>
                </Grid2>
                {archiveList && archiveList.map((item, index) => (
                    <React.Fragment key={item.ArchiveID}>
                        <Grid2 size={3}>
                            <Paper>
                                <ImageList variant="masonry" gap={8} cols={1}>
                                    {item.Images && item.Images.map((image) => (
                                        <ImageListItem key={image.ImageID}>
                                            <img src={image.Filename} loading="lazy" />
                                            <ImageListItemBar title={image.Caption} />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </Paper>
                        </Grid2>
                        <Grid2 size={12}>
                            <Paper>
                                <Typography variant="h4">
                                    {`${item.EventDetails.Title} (${returnDateString(item.EventDetails.EventDate)})`}
                                </Typography>
                                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                                    {item.Report}
                                </Typography>
                            </Paper>
                        </Grid2>
                        <Grid2 size={12}>
                            {item.Clips && item.Clips.map((clip) => (
                                <Paper key={clip.ClipID}>
                                    <Typography variant="h6">{clip.Caption}</Typography>
                                    <iframe
                                        width="100%"
                                        src={`https://www.youtube.com/embed/${updateClipName(clip.ClipURL)}`}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    ></iframe>
                                </Paper>
                            ))}
                        </Grid2>
                    </React.Fragment>
                ))}
            </Grid2>
            <Snackbar
                open={Snackopen}
                autoHideDuration={6000}
                onClose={handleClose}
                message={SnackMessage}
            />
        </>
    );
}