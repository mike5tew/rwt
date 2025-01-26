import { useEffect, useState } from 'react';
import { Typography, Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import { randomImagesGET } from '../services/queries';
import { processImages, processClips } from '../services/ImageHandling';

export default function Home() {
  const [leftImages, setLeftImages] = useState<JSX.Element[]>([]);
  const [rightImages, setRightImages] = useState<JSX.Element[]>([]);
  const [mobileImages, setMobileImages] = useState<JSX.Element[]>([]); // Add this state
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
        if (!data || typeof data === 'string') {
          console.error('Error:', data);
          return;
        }
        
        const clipElements = Array.isArray(data.Clips) ? processClips(data.Clips) : [];
        const imageElements = Array.isArray(data.Images) ? processImages(data.Images) : [];
        const combinedElements = [...clipElements, ...imageElements].sort(() => Math.random() - 0.5);

        // Split elements for desktop and mobile views
        setLeftImages(combinedElements.filter((_, i) => i % 2 === 0));
        setRightImages(combinedElements.filter((_, i) => i % 2 === 1));
        setMobileImages(combinedElements.slice(0, 3)); // Take first 3 for mobile
      })
      .catch(error => console.error('Error:', error));
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
          <ImageList 
            variant="masonry" 
            gap={8} 
            cols={1}
            sx={{
              '& .MuiImageListItem-root': {
                overflow: 'hidden'
              },
              '& img': {
                width: '100%',
                height: 'auto'
              },
              '& iframe': {
                width: '100%',
                aspectRatio: '16/9'
              }
            }}
          >
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

        {/* Add mobile media display */}
        {isMobile && (
          <Box sx={{ mt: 3 }}>
            <ImageList 
              gap={8} 
              cols={1}
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
              {mobileImages}
            </ImageList>
          </Box>
        )}
      </Box>
      {!isMobile && (
        <Box sx={{ width: '15%' }}>
          <ImageList 
            variant="masonry" 
            gap={8} 
            cols={1}
            sx={{
              '& .MuiImageListItem-root': {
                overflow: 'hidden'
              },
              '& img': {
                width: '100%',
                height: 'auto'
              },
              '& iframe': {
                width: '100%',
                aspectRatio: '16/9'
              }
            }}
          >
            {rightImages}
          </ImageList>
        </Box>
      )}
    </Box>
  );
}
