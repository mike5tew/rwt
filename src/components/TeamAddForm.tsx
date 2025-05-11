import React, { useState, useEffect, useCallback } from 'react';
import { Team, EmptyTeam, DatURLResponse } from '../types/types.d';
import { Button, Paper, TextField, Typography, Grid, Box, CircularProgress, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CloudUpload, ImageSearch } from '@mui/icons-material';
import ResizeImage from '../services/ResizeImage';
import FileUploadService from '../services/FileUploadService';
import { NotificationSnackbar } from './shared/NotificationSnackbar';
import { memberPOST, memberPUT } from '../services/queries';

interface TeamAddFormProps {
  editingMember: Team | null;
  onSuccess?: () => void; // Callback for parent component
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const VALID_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];

export default function TeamAddForm({ editingMember, onSuccess }: TeamAddFormProps) {
  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<Team>({
    defaultValues: EmptyTeam()
  });
  const [currentFile, setCurrentFile] = useState<File | undefined>();
  const [iconURL, setIconURL] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const navigate = useNavigate();

  const memberId = watch('ID');
  const isEditing = Boolean(memberId && memberId > 0);

  // Initialize form with editingMember data
  useEffect(() => {
    if (editingMember) {
      reset(editingMember);
      console.log('Full editing member object:', editingMember);
      
      // MAJOR FIX: Match the exact same pattern used in AllImages
      // Get imageURL directly from the ImageURL property or construct it from filename
      let imageUrl = '';
      if (editingMember.Image) {
        // Use the exact same fallback mechanism as AllImages
        imageUrl = editingMember.Image.imageURL || 
          (editingMember.Image.filename ? 
            `${process.env.REACT_APP_API_URL || ''}/images/desktop/${editingMember.Image.filename}` : 
            '');
            
      }
      
      setIconURL(imageUrl);
      setCurrentFile(undefined);
    } else {
      reset(EmptyTeam());
      setIconURL('');
      setCurrentFile(undefined);
    }
  }, [editingMember, reset]);

  const handleSnackClose = useCallback(() => setSnackOpen(false), []);

  const selectFile = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      showMessage('No file selected');
      return;
    }

    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      showMessage(`Invalid file type: ${file.type}. Please select a JPG, JPEG or PNG file.`);
      return;
    }

    try {
      setCurrentFile(file);
      if (isEditing) {
        setValue('Image.imageID', 0); // Reset image ID for new upload
      }

      const resizedImageResponse = await ResizeImage.ResizeImage(file, 800, 0, "dt");
      setIconURL(URL.createObjectURL(resizedImageResponse.ReturnedFile));
      setValue('Image', {
        ...resizedImageResponse.FileDetails,
        caption: watch('Image.caption') || ''
      });
    } catch (error) {
      console.error('Error processing image:', error);
      showMessage('Error processing image');
    }
  }, [isEditing, setValue, watch]);

  const showMessage = useCallback((message: string) => {
    setSnackMessage(message);
    setSnackOpen(true);
  }, []);

  const uploadImage = useCallback(async (file: File, caption: string) => {
    try {
      // First resize the image to 800px width (desktop)
      const resizedImageResponse = await ResizeImage.ResizeImage(file, 800, 0, "dt");
      // Create form data for the 800px image
      const formData = await FileUploadService.upload(
        resizedImageResponse.ReturnedFile,
        resizedImageResponse.ReturnedFile.name,
        0,
        resizedImageResponse.FileDetails.width,
        resizedImageResponse.FileDetails.height,
        caption,
        'dt'
      );
      // send the image to the server (desktop)
      const desktopImageResponse = await FileUploadService.SendFile(formData);

      // Resize the image for mobile at 250px
      const mobileFormData = await ResizeImage.ResizeImage(file, 250, 0, "mb");
      const mobileFormDataForUpload = await FileUploadService.upload(
        mobileFormData.ReturnedFile,
        mobileFormData.ReturnedFile.name,
        0,
        mobileFormData.FileDetails.width,
        mobileFormData.FileDetails.height,
        caption,
        'mb'
      );
      // Send mobile version to the server, but ignore its response
      await FileUploadService.SendFile(mobileFormDataForUpload);

      // Return only the desktop image response (with imageID)
      return desktopImageResponse;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }, []);

  const onSubmit: SubmitHandler<Team> = useCallback(async (data) => {
    setLoading(true);
    let uploadedImageId = data.Image?.imageID || 0;

    try {
      // Upload new image if selected
      if (currentFile) {
        const imageResponse = await uploadImage(currentFile, data.Image?.caption || '');
        if (imageResponse?.imageID) {
          uploadedImageId = imageResponse.imageID;
        } else {
          console.error('Image upload failed:', imageResponse);
          throw new Error('Image upload failed');
        }
      }

      const teamMember: Team = {
        ...data, // Spread other form data (Name, Description, ID)
        Image: {
          ...(data.Image || {}), // Spread existing image details first (like width, height if set)
          imageID: uploadedImageId, // Ensure the correct ID is used (newly uploaded or original)
          caption: data.Image?.caption || '', // Ensure the current caption from the form is used
          // Note: Other properties from data.Image (like width, height) are preserved
          // if they existed, but imageID and caption are explicitly set here.
        }
      };

      const response = isEditing
        ? await memberPUT(teamMember)
        : await memberPOST(teamMember);

      if (response?.ID) {
        showMessage(`Team member ${isEditing ? 'updated' : 'added'} successfully`);
        onSuccess?.();
        if (!isEditing) formReset();
      } else {
        throw new Error(`Error ${isEditing ? 'updating' : 'saving'} team member`);
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentFile, isEditing, onSuccess, showMessage, uploadImage]); // Added formReset to dependency array

  const formReset = useCallback(() => {
    reset(EmptyTeam());
    setCurrentFile(undefined);
    setIconURL('');
  }, [reset]);

  const handleCancel = useCallback(() => {
    navigate('/AdminDashboard');
  }, [navigate]);

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" component="h1">
            {isEditing ? 'Edit Team Member' : 'Add Team Member'}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('ID')} />
          <input type="hidden" {...register('Image.imageID')} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{
                width: 250,
                height: 250,
                border: '1px dashed',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
                overflow: 'hidden',
                backgroundColor: 'background.paper',
                position: 'relative' // Added for the URL overlay
              }}>
                {iconURL && (
                  <div style={{ position: 'absolute', top: 0, left: 0, padding: '4px', 
                    backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '10px' }}>
                    URL: {iconURL.substring(0, 30)}...
                  </div>
                )}
                <img
                  src={iconURL || '/default-member.png'}
                  alt="Preview"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error('Image failed to load:', target.src);
                    // Only replace if not already the default
                    if (!target.src.includes('default-member.png')) {
                      target.onerror = null;
                      target.src = '/default-member.png';
                    }
                  }}
                />
              </Box>

              <Button
                component="label"
                variant="contained"
                startIcon={<ImageSearch />}
                sx={{ mb: 2 }}
                disabled={loading}
              >
                Select Image
                <VisuallyHiddenInput 
                  type="file" 
                  onChange={selectFile} 
                  accept={VALID_IMAGE_TYPES.join(',')} 
                />
              </Button>

              <TextField
                label="Image Caption"
                fullWidth
                {...register('Image.caption')}
                InputLabelProps={{
                  shrink: !!watch('Image.caption') // Dynamically shrink label if caption exists
                }}
                margin="normal"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                label="Name"
                fullWidth
                required
                {...register('Name', { required: 'Name is required' })}
                InputLabelProps={{
                  shrink: !!watch('Name') // Dynamically shrink label if Name exists
                }}
                error={Boolean(errors.Name)}
                helperText={errors.Name?.message}
                margin="normal"
                disabled={loading}
              />

              <TextField
                label="Bio/Description"
                fullWidth
                required
                multiline
                rows={6}
                {...register('Description', { required: 'Bio is required' })}
                InputLabelProps={{
                  shrink: !!watch('Description') // Dynamically shrink label if Description exists
                }}
                error={Boolean(errors.Description)}
                helperText={errors.Description?.message}
                margin="normal"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={isEditing ? formReset : handleCancel}
                  disabled={loading}
                >
                  {isEditing ? 'Clear Form' : 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (isEditing ? 'Update' : 'Save')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Grid>

      <NotificationSnackbar
        open={snackOpen}
        message={snackMessage}
        onClose={handleSnackClose}
      />
    </Grid>
  );
}