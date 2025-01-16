import { useEffect, useState } from 'react';
import { Typography, Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import { randomImagesGET } from '../services/queries';
import { processImages, processClips } from '../services/ImageHandling';

export default function Home() {
  const [leftImages, setLeftImages] = useState<JSX.Element[]>([]);
  const [rightImages, setRightImages] = useState<JSX.Element[]>([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function srcset(image: string, width: number, rows: number, cols: number) {
    return {
      src: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=1 1x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=2 2x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=3 3x`,
    };
  }

  useEffect(() => {
    randomImagesGET(6)
      .then(data => {
        console.log("Random images data:", data); // new debug log
        console.log("data: ", data);
        if (!data || typeof data === 'string') {
          console.error('Error:', data);
          return;
        }
        const clipElements = Array.isArray(data.Clips) ? processClips(data.Clips) : [];
        const imageElements = Array.isArray(data.Images) ? processImages(data.Images) : [];
        const combinedArray = [...clipElements, ...imageElements].sort(() => Math.random() - 0.5);
        const leftElements: JSX.Element[] = [];
        const rightElements: JSX.Element[] = [];
        combinedArray.forEach((element, index) => {
          if (index % 2 === 0) {
            leftElements.push(element);
          } else {
            rightElements.push(element);
          }
        });
        setLeftImages(leftElements);
        setRightImages(rightElements);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', 
      flexGrow: 1, 
      marginTop: '64px',
      width: '100%',
      maxWidth: '100vw',
      overflow: 'hidden'
    }}>
      {!isMobile && (
        <Box sx={{ width: '15%' }}>
          <ImageList variant="masonry" gap={8} cols={1}>
            {leftImages}
          </ImageList>
        </Box>
      )}
      <Box sx={{ 
        width: isMobile ? '100%' : '70%', 
        mx: 'auto', 
        px: isMobile ? 1 : 2,
        overflow: 'auto'
      }}>
        <Paper sx={{ mx: isMobile ? 1 : 2 }}>
          <Typography variant="h2" gutterBottom sx={{ 
            whiteSpace: "pre-wrap",
            fontSize: isMobile ? '1.5rem' : undefined 
          }}>
            {localStorage.getItem("HomeTitle")}
          </Typography>
        </Paper>
        <br />
        <Typography variant="body1" sx={{ 
          whiteSpace: "pre-wrap",
          fontSize: isMobile ? '0.9rem' : undefined
        }}>
          {localStorage.getItem('HomeText')}
        </Typography>
      </Box>
      {!isMobile && (
        <Box sx={{ width: '15%' }}>
          <ImageList variant="masonry" gap={8} cols={1}>
            {rightImages}
          </ImageList>
        </Box>
      )}
    </Box>
  );
}
