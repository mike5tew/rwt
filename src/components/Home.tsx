import { useEffect, useState } from 'react';
import { Typography, Box, Paper, useMediaQuery, useTheme, Fade } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import { randomImagesGET } from '../services/queries';
import { processImages, processClips } from '../services/ImageHandling';

export default function Home() {
  const [leftImages, setLeftImages] = useState<JSX.Element[]>([]);
  const [rightImages, setRightImages] = useState<JSX.Element[]>([]);
  const [mobileImages, setMobileImages] = useState<JSX.Element[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  function srcset(image: string, width: number, rows: number, cols: number) {
    return {
      src: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=1 1x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=2 2x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=3 3x`,
    };
  }

  useEffect(() => {
    randomImagesGET(6)
      .then(data => {
        console.log('Data:', data);
        if (!data || typeof data === 'string') {
          console.error('Error:', data);
          return;
        }
        const screenSize = localStorage.getItem('screenSize') || 'desktop';
        const clipElements = Array.isArray(data.Clips) ? processClips(data.Clips) : [];
        const imageElements = Array.isArray(data.Images) ? processImages(data.Images, screenSize) : [];
        console.log('Image Elements:', imageElements);
        const combinedElements = [...clipElements, ...imageElements].sort(() => Math.random() - 0.5);

        setLeftImages(combinedElements.filter((_, i) => i % 2 === 0));
        setRightImages(combinedElements.filter((_, i) => i % 2 === 1));
        setMobileImages(combinedElements.slice(0, 3));
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
      overflow: 'hidden',
      //backgroundColor: '#f5f5f5',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {!isMobile && (
        <Box sx={{ width: '15%', p: 1 }}>
          <ImageList 
            variant="masonry" 
            gap={8} 
            cols={1}
            sx={{
              '& .MuiImageListItem-root': {
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: 3,
                mb: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6
                }
              },
              '& img': {
                width: '100%',
                height: 'auto',
                transition: 'all 0.3s ease'
              },
              '& iframe': {
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: 2
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
        px: isMobile ? 2 : 3,
        py: 3,
        overflow: 'auto'
      }}>
        <Fade in={true} timeout={1000}>
          <Paper elevation={3} sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 2,
            background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)'
          }}>
            <Typography variant="h2" gutterBottom sx={{ 
              whiteSpace: "pre-wrap",
              fontSize: isMobile ? '1.8rem' : '2.5rem',
              fontWeight: 600,
              color: '#2c3e50',
              textAlign: 'center'
            }}>
              {localStorage.getItem("HomeTitle")}
            </Typography>
            
            {localStorage.getItem("HomeSubtitle") && (
              <Typography variant="h4" gutterBottom sx={{ 
                whiteSpace: "pre-wrap",
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                color: '#34495e',
                textAlign: 'center',
                mb: 3
              }}>
                {localStorage.getItem("HomeSubtitle")}
              </Typography>
            )}
            
            <Typography variant="body1" sx={{ 
              whiteSpace: "pre-wrap",
              fontSize: isMobile ? '1rem' : '1.1rem',
              lineHeight: 1.8,
              color: '#2c3e50',
              textAlign: 'justify'
            }}>
              {localStorage.getItem('HomeText')}
            </Typography>
          </Paper>
        </Fade>
        
        {isMobile && (
          <Box sx={{ mt: 3 }}>
            <ImageList 
              gap={12} 
              cols={1}
              sx={{
                overflow: 'hidden',
                '& .MuiImageListItem-root': {
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: 3,
                  mb: 2,
                  overflow: 'hidden'
                },
                '& img': {
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover'
                },
                '& iframe': {
                  aspectRatio: '16/9',
                  width: '100%',
                  borderRadius: 2
                }
              }}
            >
              {mobileImages}
            </ImageList>
          </Box>
        )}
      </Box>
      
      {!isMobile && (
        <Box sx={{ width: '15%', p: 1 }}>
          <ImageList 
            variant="masonry" 
            gap={8} 
            cols={1}
            sx={{
              '& .MuiImageListItem-root': {
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: 3,
                mb: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6
                }
              },
              '& img': {
                width: '100%',
                height: 'auto',
                transition: 'all 0.3s ease'
              },
              '& iframe': {
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: 2
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
