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
        
        archives.forEach(archive => {
            // Create a container for each archive's content
            const archiveContent = (
                <ImageListItem key={`archive-${archive.ArchiveID}`} cols={3} rows={1}>
                    <Grid container spacing={2}>
                        {/* Text Section */}
                        <Grid item xs={12}>
                            {processText(archive)}
                        </Grid>
                        
                        {/* Media Section */}
                        <Grid item xs={12}>
                            <ImageList cols={2} gap={8}>
                                {Array.isArray(archive.Clips) && processClips(archive.Clips)}
                                {Array.isArray(archive.Images) && processImages(archive.Images)}
                            </ImageList>
                        </Grid>
                    </Grid>
                </ImageListItem>
            );
            elements.push(archiveContent);
        });
        
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
            <Grid container spacing={2} sx={{ p: isMobile ? 1 : 3 }}>
                <Grid item xs={12}>
                    <Paper>
                        <Typography variant="h2" gutterBottom sx={{ 
                            whiteSpace: "pre-wrap",
                            fontSize: isMobile ? '1.5rem' : undefined 
                        }}>
                            {localStorage.getItem("ArchiveTitle")}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <Typography variant="body1" align="center" gutterBottom sx={{ 
                            whiteSpace: "pre-wrap",
                            fontSize: isMobile ? '0.9rem' : undefined
                        }}>
                            {localStorage.getItem("ArchiveText")}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <ImageList gap={isMobile ? 4 : 8} cols={1} sx={{
                        width: '100%',
                        margin: 0
                    }}>
                        {archiveList}
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