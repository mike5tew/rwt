import { useEffect, useState } from 'react';
import { Typography, Paper, ImageList, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/system';
import { randomImagesGET } from '../services/queries';
import { processImages, processClips } from '../services/ImageHandling';

/**
 * About page component that displays organization information and random media
 * Fetches and displays random images/clips from the server
 * Responsive layout that adapts to mobile/desktop views
 */
export default function About() {
  const [Elements, setElements] = useState<JSX.Element[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Fetches random images and clips on component mount
   * Processes and combines media into displayable elements
   * Limits display to maximum of three random elements
   */
  useEffect(() => {
    randomImagesGET(3)
      .then(data => {
        if (!data || typeof data === 'string') {
          console.error('Error:', data);
          return;
        }
        const screenSize = localStorage.getItem('screenSize') || 'desktop';
        const clipElements = Array.isArray(data.Clips) ? processClips(data.Clips) : [];
        const imageElements = Array.isArray(data.Images) ? processImages(data.Images, screenSize) : [];
        
        // Don't wrap the elements - let ImageList handle the layout
        const combinedElements = [...clipElements, ...imageElements]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        setElements(combinedElements);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  /**
   * Renders about page content in a grid layout
   * Displays title, descriptive text, and media gallery
   * Uses responsive ImageList for media display
   */
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="h2" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
              {localStorage.getItem("AboutTitle")}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="body1" align="center" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
              {localStorage.getItem("AboutText")}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <ImageList 
            gap={8} 
            cols={isMobile ? 1 : 3}
            sx={{
              overflow: 'hidden',
              '& .MuiImageListItem-root': {
                display: 'flex',
                flexDirection: 'column'
              },
              '& img': {
                width: '100%',
                height: 'auto',
                objectFit: 'cover'
              },
              '& iframe': {
                aspectRatio: '16/9',
                width: '100%'
              }
            }}
          >
            {Elements}
          </ImageList>
        </Grid>
      </Grid>
    </Box>
  );
}