import { useState, useEffect } from 'react';
import { ImageList, ImageListItem, Paper, Typography, Snackbar, Card, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { ArchivesGET } from '../services/queries';
import { ArchiveEntry } from '../types/types.d';
import { processImages, processClips } from '../services/ImageHandling';

export default function Archive() {
    const [archiveList, setArchiveList] = useState<JSX.Element[]>([]);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClose = () => {
        setSnackOpen(false);
    };

    function processText(Arch: ArchiveEntry): JSX.Element {
        return (
            <ImageListItem key={"A" + Arch.ArchiveID} cols={1} rows={2} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '10px' }}>
                    <Typography variant="h4">{Arch.EventDetails.Title + " (" + returnDateString(Arch.EventDetails.EventDate) + ")"}</Typography>
                    <Typography variant="h5" sx={{ whiteSpace: "pre-wrap", flexGrow: 1 }}>
                        {Arch.Report}
                    </Typography>
                </Card>
            </ImageListItem>
        );
    }

    function processArchives(archives: ArchiveEntry[]): JSX.Element[] {
        let elements: JSX.Element[] = [];
        // Map the archives to elements
        for (let i = 0; i < archives.length; i++) {
            let archElem: JSX.Element[] = [];
            archElem = [processText(archives[i])];
            const clipElements = Array.isArray(archives[i].Clips) ? processClips(archives[i].Clips) : [];
            const imageElements = Array.isArray(archives[i].Images) ? processImages(archives[i].Images) : [];
            archElem = archElem.concat(clipElements, imageElements);
            elements = elements.concat(archElem);
        }
        return elements;
    }

    useEffect(() => {
        ArchivesGET(5)
            .then((archives) => {
                // Confirm the data is an array of archives
                const elements = Array.isArray(archives) ? processArchives(archives) : [];
                setArchiveList(elements);
            })
            .catch((error) => console.log(error));
    }, []);

    function returnDateString(eventDate: Date) {
        const date = new Date(eventDate);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear().toString().slice(-2);
        return `${day} ${month} ${year}`;
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper>
                    <Typography variant="h2" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
                    {localStorage.getItem("ArchiveTitle")}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                    <Typography variant="body1" align="center" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
                    {localStorage.getItem("ArchiveText")}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <ImageList gap={8} cols={isMobile ? 1 : 3}>
                        {archiveList && archiveList.map((arch) => arch)}
                    </ImageList>
                </Grid>
            </Grid>
            <Snackbar
                open={snackOpen}
                autoHideDuration={6000}
                onClose={handleClose}
                message={snackMessage}
            />
        </>
    );
}