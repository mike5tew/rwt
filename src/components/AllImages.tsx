import React, { useEffect, useState, useCallback } from 'react';
import {
  ImageList,
  ImageListItem,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Grid,
  Skeleton,
  Modal,
  TextField, // Added TextField
  Button,    // Added Button
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
// Assuming ImageCaptionUPDATE would be added to queries.ts
import { ImagesGET, ImageDELETE /*, ImageCaptionUPDATE */ } from '../services/queries';
import { EmptyImageDetail, ImageDetail } from '../types/types.d';
import { useNavigate } from 'react-router-dom';
import { processImages } from '../services/ImageHandling';
import { Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const CustomSnackbarAlert = React.forwardRef<HTMLDivElement, AlertProps>(function CustomSnackbarAlert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between', // Changed from 'center'
  transition: 'transform 0.2s',
  minHeight: '320px', // Adjusted height to accommodate controls
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[4],
  },
  position: 'relative',
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '180px', // Adjusted image height
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
    transition: 'opacity 0.3s',
    '&:hover': {
      opacity: 0.9,
    },
  },
  // Removed absolute positioning for Typography as it's replaced by TextField in flow
  // '& .MuiTypography-root': { ... } 
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  color: theme.palette.error.main,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  '&:hover': {
    color: theme.palette.error.dark,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  transition: 'all 0.3s',
  padding: theme.spacing(0.5),
}));

const AllImages: React.FC = () => {
  const [images, setImages] = useState<ImageDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');
  const [selectedImage, setSelectedImage] = useState<ImageDetail | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editedCaptions, setEditedCaptions] = useState<{ [key: number]: string }>({});
  
  const theme = useTheme();
  var isMobile: boolean;
  if (localStorage.getItem("screenSize") === "mobile" || useMediaQuery(theme.breakpoints.down('sm'))) {
    isMobile = true;
  } else {
    isMobile = false;
  }
  const navigate = useNavigate();

  const itemsPerPage = isMobile ? 10 : 20;

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ImagesGET(page, itemsPerPage);
      if (!Array.isArray(response)) {
        throw new Error('Invalid response format');
      }
      // run through the response and change the caption to showe the imageid and the eventid
      response.forEach((image) => {
        image.caption = image.caption || `Image ID: ${image.imageID} Event ID: ${image.eventID}`;
      });
      setImages(prev => page === 1 ? response : [...prev, ...response]);
      setHasMore(response.length === itemsPerPage);
    } catch (error) {
      console.error('Error fetching images:', error);
      setSnackbarMessage(error instanceof Error ? error.message : 'Error fetching images');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage]);

  const handleDelete = useCallback(async (imageID: number) => {
    try {
      await ImageDELETE(imageID);
      setSnackbarMessage('Image deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setImages(prev => prev.filter(img => img.imageID !== imageID));
    } catch (error) {
      console.error('Error deleting image:', error);
      setSnackbarMessage(error instanceof Error ? error.message : 'Error deleting image');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, []);

  const handleCaptionInputChange = useCallback((imageID: number, value: string) => {
    setEditedCaptions(prev => ({
      ...prev,
      [imageID]: value,
    }));
  }, []);

  const handleUpdateCaption = useCallback(async (imageID: number) => {
    const newCaption = editedCaptions[imageID];
    const originalImage = images.find(img => img.imageID === imageID);

    if (newCaption === undefined || (originalImage && newCaption === originalImage.caption)) {
      setSnackbarMessage('No changes to save or caption is the same.');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
      return;
    }

    try {
      // TODO: Implement and uncomment the actual API call
       await ImageCaptionUPDATE(imageID, newCaption); 
      // Simulating API call for now:
      //await new Promise(resolve => setTimeout(resolve, 500));
      // if (Math.random() < 0.1) throw new Error("Simulated API error for caption update"); // Uncomment to test error

      setImages(prevImages =>
        prevImages.map(img =>
          img.imageID === imageID ? { ...img, caption: newCaption } : img
        )
      );
      setSnackbarMessage('Caption updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setEditedCaptions(prev => {
        const newState = { ...prev };
        delete newState[imageID]; // Clear the edited state for this image
        return newState;
      });
    } catch (error) {
      console.error('Error updating caption:', error);
      setSnackbarMessage(error instanceof Error ? error.message : 'Error updating caption');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [editedCaptions, images, setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen, setImages]);

  const handleSnackbarClose = useCallback((event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }, []);

  const handleImageClick = useCallback((image: ImageDetail) => {
    setSelectedImage(image);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handleLoadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <Box sx={{ 
      flexGrow: 1, 
      marginTop: '64px', 
      padding: '16px',
      minHeight: 'calc(100vh - 64px - 32px)'
    }}>
      {loading && page === 1 ? (
        <Grid container spacing={2}>
          {[...Array(itemsPerPage)].map((_, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Skeleton variant="rectangular" width="100%" height={200} />
              <Skeleton variant="text" width="80%" />
            </Grid>
          ))}
        </Grid>
      ) : images.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No images found.
        </Typography>
      ) : (
        <>
          <ImageList variant="masonry" cols={isMobile ? 2 : 4} gap={8}>
          {images.map((image) => (
  <StyledPaper key={image.imageID}>
    <img
      src={image.imageURL || `${process.env.REACT_APP_API_URL}/images/mobile/${image.filename}`}
      alt={image.caption} // Use the current caption for alt text
      loading="lazy"
                  onClick={() => handleImageClick(image)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/placeholder-image.png';
                  }}
                />
                {/* Caption editing section */}
                <Box sx={{ width: '95%', p: 1, mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <TextField
                    label="Caption"
                    variant="outlined"
                    size="small"
                    multiline
                    minRows={2}
                    maxRows={4}
                    value={editedCaptions[image.imageID] ?? image.caption}
                    onChange={(e) => handleCaptionInputChange(image.imageID, e.target.value)}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleUpdateCaption(image.imageID)}
                    disabled={editedCaptions[image.imageID] === undefined || editedCaptions[image.imageID] === image.caption}
                    fullWidth
                  >
                    Save Caption
                  </Button>
                </Box>
                
                <StyledIconButton
                  onClick={(event) => {
                    event.stopPropagation(); // Prevent image click when deleting
                    handleDelete(image.imageID);
                  }}
                  size="small"
                  aria-label={`Delete image ${image.caption || image.imageID}`}
                >
                  <Tooltip title="Delete Image" arrow>
                    <Delete fontSize="small" />
                  </Tooltip>
                </StyledIconButton>
              </StyledPaper>
            ))}
          </ImageList>

          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <IconButton 
                onClick={handleLoadMore} 
                disabled={loading}
                color="primary"
                sx={{ padding: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Load More'}
              </IconButton>
            </Box>
          )}
        </>
      )}

      {/* Image Preview Modal */}
      <Modal
        open={!!selectedImage}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}
      >
        <Box sx={{
          outline: 'none',
          maxWidth: '90vw',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          borderRadius: 1
        }}>
          {selectedImage && (
            <>
              <img
                src={`${process.env.REACT_APP_API_URL}/${selectedImage.imagePath}`}
                alt={selectedImage.caption}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '80vh',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                {selectedImage.caption}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedImage.caption}
              </Typography>
            </>
          )}
        </Box>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <CustomSnackbarAlert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </CustomSnackbarAlert>
      </Snackbar>
    </Box>
  );
};

export default AllImages;
async function ImageCaptionUPDATE(imageID: number, newCaption: string): Promise<void> {
  const apiUrl = `${process.env.REACT_APP_API_URL}/images/${imageID}/caption`;
  var image = EmptyImageDetail();
  image.imageID = imageID;
  image.caption = newCaption;
  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(image),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to update caption: ${errorMessage}`);
  }
}
