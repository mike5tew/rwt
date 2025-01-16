//This page allows the admin user to add archive details to an event.
//The page contains a form to enter the archive details, and a table to display the images and clips that have been added to the archive.

import React, { useEffect, useState } from 'react';
import { ArchiveEntry, EmptyArchiveEntry, ImageDetail, EmptyImageDetail, Clip, EmptyClip, StringtoDate, EventDetails, DatURLResponse } from '../types/types.d';
import { DataGrid, GridColDef, GridRowId, GridCellParams } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import { Button, Paper, Typography, TextField, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CloudUpload, ImageSearch } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ResizeImage from '../services/ResizeImage';
import { ArchivePOST, EventArchiveGET, ClipPOST, ClipDELETE, PastEventsList, ImageDELETE } from '../services/queries';
import FileUploadService from '../services/FileUploadService';

/**
 * Interface for the image table data structure
 */
interface tableDetails {
  id: number;
  filename: string;
  caption: string;
}

/**
 * Interface for the clip table data structure
 */
interface ClipTable {
  id: number;
  clipURL: string;
  caption: string;
}

// Styling constants
const styleGridLeft = {
  Grid: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    // border: '1px solid black',
  }
}

const styleGridPadded = {
  Grid: {
    // padding to space out the grid items from the left margin
    paddingLeft: '10px',
    width: '100%',
    height: '100%',
    // border: '1px solid black',
  },
}

/**
 * Creates an empty table details object
 */
function emptyTableDetails(): tableDetails {
  return { id: 0, filename: '', caption: '' };
}

/**
 * AddArchive Component
 * Allows administrators to add and manage archive entries for events
 * Handles image uploads, YouTube clips, and event reports
 */
export default function AddArchive() {
  const { register, handleSubmit, watch, setValue } = useForm<ArchiveEntry>(
    { defaultValues: EmptyArchiveEntry() }
  );
  const [table, setTable] = useState<tableDetails[]>([]);
  const [eventID, setEventID] = useState<number>(0);
  const [archive, setArchive] = useState<ArchiveEntry>(EmptyArchiveEntry());
  const [images, setImages] = useState<ImageDetail[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [iconImage, setIconImage] = useState<File | undefined>();
  const [currentFile, setCurrentFile] = useState<File | undefined>();
  const [eventList, setEventList] = useState<EventDetails[]>([]);
  const [fileType, setFileType] = useState<string | null>(null);
  const [IconURL, setIconURL] = useState<string>('');
  const [Snackopen, setSnackOpen] = useState(false);
  const [SnackMessage, setSnackMessage] = useState('');
  const [action, setAction] = useState(<></>);
  const [ClTab, setClTab] = useState<ClipTable[]>([]);
  const history = useNavigate();
  const handleClose = () => {
    setSnackOpen(false);
  };
  const [eventSelected, setEventSelected] = useState<boolean>(false);
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

  /**
   * Handles removal of images from the archive
   * @param id The ID of the image to remove
   */
  const handleRemoveImage = (id: GridRowId) => {
    // convert the id to a number
    id = Number(id);
    ImageDELETE(id).then((respon) => {
    if (respon) {
      setSnackMessage("Image removed successfully")
      setImages(images.filter((image) => image.ImageID !== id))
      setTable(table.filter((image) => image.id !== id))
      setSnackOpen(true)
    }
    else {
      setSnackMessage("Error removing image")
      setSnackOpen(true)
    }
    return respon;
  }
  );
  }
  // this page is currently not completing loading.  This is because the images and clips are not being cleared when the event is changed.  This is because the images and clips are being set before the eventID is set.  This is because the eventID is set in the handleEventSelect function.  This function is called when the event is changed.  The images and clips are set before the eventID is set.  This means that the images and clips are being
  

  /**
   * Column definitions for the image grid
   */
  const Imagecolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'filename', headerName: 'File', flex: 2 },
    { field: 'caption', headerName: 'Caption', flex: 3 },
    {
      field: 'remove', headerName: 'Remove', flex: 1, renderCell: (params: GridCellParams) => (
        <Button variant='outlined' onClick={() => handleRemoveImage(params.row.id)}>Remove</Button>
      )
    }
  ];

  const handleRemoveClip = (id: GridRowId) => {
    // convert the id to a number
    id = Number(id);
    ClipDELETE(id).then((respon) => {
      if (respon) {
        if (respon.ClipID > 0) {
        setSnackMessage("Clip removed successfully")
        setSnackOpen(true)
        setClips(clips.filter((clip) => clip.ClipID !== id));
        setClTab(ClTab.filter((clip) => clip.id !== id));
      } else {

        console.log("Error removing clip " + JSON.stringify(respon))
        setSnackMessage("Error removing clip")
        setSnackOpen(true)
      }
    } else {
      // convert the respon object to a string
      console.log("Error removing clip " + JSON.stringify(respon))
      setSnackMessage("Error removing clip " + JSON.stringify(respon))
      return respon;
    }
    }
    );
  };


  useEffect(() => {
    if (document.cookie === '') {
      console.log('No cookie');
      history('/Members');
    }
    // get the event list from the database
    PastEventsList().then((res) => {
      // remove events that are in the future
      res = res.filter((event) => new Date(event.EventDate) <= new Date());

      setEventList(res);
    }
    );
  
  }
    , []);

  const clipColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0 },
    { field: 'clipURL', headerName: 'URL', flex: 2 },
    { field: 'caption', headerName: 'Caption', flex: 3 },
    {
      field: 'remove', headerName: 'Remove', flex: 1, renderCell: (params: GridCellParams) => (
        <Button variant='outlined' onClick={() => handleRemoveClip(params.row.id)}>Remove</Button>
      )
    }
  ];

  function changeFileSet(FileToAdd: File) {
    return new Promise<File>((resolve) => {
      setCurrentFile(FileToAdd);
      setValue('NextFile', FileToAdd.name);
      resolve(FileToAdd);
    });
  }

  /**
   * Handles file selection and image processing
   * Validates file type and resizes image for preview
   */
  const selectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      setSnackMessage('No file selected');
      setSnackOpen(true);
      return;
    }
  
    // Check if file is an image
    const validTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type);
      setSnackMessage(`Invalid file type: ${file.type}. Please select a JPG, JPEG or PNG file.`);
      setSnackOpen(true);
      return;
    }
  
    setFileType(file.type);
    setCurrentFile(file);
  
    try {
      const res = await changeFileSet(file);
      ResizeImage.ResizeImage(res, 100, eventID).then((res: DatURLResponse) => {
        setIconImage(res.ReturnedFile);
        const sDat = URL.createObjectURL(res.ReturnedFile);
        setIconURL(sDat);
      });
    } catch (error) {
      console.error('Error:', error);
      setSnackMessage('Error processing image');
      setSnackOpen(true);
    }
  }
  


  /**
   * Processes and uploads images
   * Creates both desktop and mobile versions
   */
  const upload = () => {
    if (typeof currentFile === 'undefined') {
        alert('Please select an image to upload');
        return;
    }
    interface ImID {
      ImageID: number;
    }
    var ImDetails = EmptyImageDetail();

    // Resize the image for desktop
    ResizeImage.ResizeImage(currentFile, 450, eventID)
        .then((res: DatURLResponse) => {
            ImDetails = res.FileDetails;
            ImDetails.Caption = watch('Imagecaption');
            console.log('Resized image for desktop:', res.FileDetails.EventID);
            // Upload the resized image
            return FileUploadService.upload(res.ReturnedFile, res.ReturnedFile.name, eventID, res.FileDetails.Width, res.FileDetails.Height, res.FileDetails.Caption);
        })
        .then((uploadRes: FormData) => {
            //console.log('File uploaded:', uploadRes);
          return FileUploadService.SendFile(uploadRes);
        }
        ).then((respon: ImID) => {
          if (respon) {
            console.log('File uploaded:', respon);
            let tb = emptyTableDetails();
            tb.id = respon.ImageID;
            tb.caption = ImDetails.Caption
            tb.filename = ImDetails.Filename;
            setTable([...table, tb]);
//            setImages((prevImages) => [...prevImages, ImDetails]);
          }
            // Resize the image for mobile
            return ResizeImage.ResizeImage(currentFile, 250, eventID);
        })
        .then((res: DatURLResponse) => {
            // console.log('Resized image for mobile:', res);
            // Upload the resized image for mobile
            return FileUploadService.upload(res.ReturnedFile, "mb"+res.ReturnedFile.name, eventID, res.FileDetails.Width, res.FileDetails.Height, res.FileDetails.Caption);
            }
            ).then((uploadRes: FormData) => {
            return FileUploadService.SendFile(uploadRes);
        }).then((respon: ImageDetail) => {
          if (respon) {
            //set the snack message to the image added successfully
            setSnackMessage("Image added successfully")
            setSnackOpen(true)
          }
        }
        )
        .catch((error) => {
            console.error('Error:', error);
        })
        .finally(() => {
            // Clear the current file
            setCurrentFile(undefined);
            // Clear the file input
            setValue('NextFile', '');
            // Clear the image caption
            setValue('Imagecaption', '');
            // Clear the icon image
            setIconImage(undefined);
        });
};


function handleEventSelect(event: SelectChangeEvent<Number>) {
  setEventID(event.target.value as number);
  if (event.target.value === 0) {
    clearForm(0);
    setEventID(0);
    setEventSelected(false);
  } else {
    setEventSelected(true);
    console.log('EventID:', event.target.value, !eventSelected);

    EventArchiveGET(event.target.value as number)
      .then(respon => {
        if (respon) {
          if (respon.ArchiveID > 0) {
            setArchive(respon);
            var imagesTp: ImageDetail[] = [];
            var Tbtemp: tableDetails[] = [];
            var clipsTp: Clip[] = [];
            var ClTab: ClipTable[] = [];
            console.log('Images:', respon.Images.length);
            if (respon.Images && respon.Images.length) {
              for (let i = 0; i < respon.Images.length; i++) {
                var imgDetail = EmptyImageDetail();
                var tb = emptyTableDetails();
                tb.id = respon.Images[i].ImageID;
                tb.caption = respon.Images[i].ImageURL
                
                tb.filename = respon.Images[i].Filename;
                Tbtemp = [...Tbtemp, tb];
                imgDetail.ImageID = respon.Images[i].ImageID;
                imgDetail.Filename = respon.Images[i].Filename;
                imgDetail.ImageURL = respon.Images[i].ImageURL;
                imgDetail.Caption = respon.Images[i].Caption;
                imgDetail.EventID = respon.Images[i].EventID;
                imagesTp = [...imagesTp, imgDetail];
              }
            }
            if (respon.Clips && respon.Clips.length) {
              for (let i = 0; i < respon.Clips.length; i++) {
                var clip = EmptyClip();
                var ctb: ClipTable = { id: respon.Clips[i].ClipID, clipURL: respon.Clips[i].ClipURL, caption: respon.Clips[i].Caption };
                ClTab = [...ClTab, ctb];
                clip.ClipID = respon.Clips[i].ClipID;
                clip.ClipURL = respon.Clips[i].ClipURL;
                clip.Caption = respon.Clips[i].Caption;
                clip.EventID = respon.Clips[i].EventID;
                clipsTp = [...clipsTp, clip];
              }
            }
            setClTab(ClTab);
            setTable(Tbtemp);
            setImages(imagesTp);
            setClips(clipsTp);
            setValue("Report", respon.Report);
          } else {
            console.log("Error: " + (respon.Report))
            // empty archive details
            clearForm(1);

          }
        }
      }).catch(error => {
        console.log(error)
      });
  }
}


  /**
   * Handles addition of YouTube clips to the archive
   * Validates YouTube URLs and extracts video IDs
   */
  const handleAddClip = () => {
    let clipURL = watch('NextURL');
    const caption = watch('Clipcaption');
  
    if (clipURL !== "") {
      let clipID = '';
  
      // Extract the video ID from different YouTube URL formats
      const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = clipURL.match(youtubeRegex);
  
      if (match && match[1]) {
        clipID = match[1];
      } else {
        setSnackMessage("Invalid YouTube URL");
        setSnackOpen(true);
        return;
      }
  
      const newClip = EmptyClip();
      newClip.ClipURL = clipID;
      newClip.Caption = caption;
      newClip.EventID = eventID;
  
      ClipPOST(newClip).then((respon) => {
        if (respon) {
          if (respon.ClipID > 0) {
            setSnackMessage("Clip added successfully");
            setSnackOpen(true);
            newClip.ClipID = respon.ClipID;
            setClTab([...ClTab, { id: newClip.ClipID, clipURL: newClip.ClipURL, caption: newClip.Caption }]);
            setClips([...clips, newClip]);
            setValue('NextURL', '');
            setValue('Clipcaption', '');
          } else {
            const res = JSON.stringify(respon);
            console.log(res);
            setSnackMessage("Error adding clip: " + res);
            setSnackOpen(true);
          }
        } else {
          console.log("Error adding clip: " + respon);
          setSnackMessage("Error adding clip");
          setSnackOpen(true);
        }
      });
    } else {
      setSnackMessage("Clip URL is required");
      setSnackOpen(true);
    }
  }
  


  function handleSaveArchive() {
    var arc = archive;
    arc.Report = watch('Report');
    arc.EventDetails.EventID = eventID;  // <-- Add this line
    ArchivePOST(arc).then((respon) => {
      if (respon) {
        if (respon.ArchiveID > 0) {
          setSnackMessage("Archive details saved successfully")
          setSnackOpen(true)
          clearForm(0);
        } else {
          console.log("Error saving archive")
          setSnackMessage("Error saving archive")
          setSnackOpen(true)
        }
      } else {
        console.log(respon)
        setSnackMessage("Error saving archive")
      }
    }
    );
  };


  function clearForm(version: number) {
    setImages([]);
    setClips([]);
    setTable([]);
    setClTab([]);
    setValue('Report', '');
    setValue('NextFile', '');
    setCurrentFile(undefined);
    setValue('Imagecaption', '');
    setValue('NextURL', '');
    setValue('Clipcaption', '');
    if (version === 1) {
      setSnackMessage("No archive details found for this event")
      setSnackOpen(true)
    } else {
      setEventSelected(false);
    setEventID(0);
    }
    console.log('Form cleared');
  }

  const FormSubmitHandler: SubmitHandler<ArchiveEntry> = (data: ArchiveEntry) => {
    console.log(data);
  }


  return (
    <>
      <form onSubmit={handleSubmit(FormSubmitHandler)}>
        <Grid container spacing={2} >
          <Grid item xs={12} sx={{ paddingBottom: 2 }}>  {/* //Title full width */}
            <Paper elevation={3}>
              {/* align the text centrally */}
              <Typography variant="h2" component="h2" sx={{ textAlign: 'center' }} >Add Archive Details</Typography>
            </Paper>
          </Grid>
          <Grid />
          <Grid item xs={12} > {/* //Event dropdown  */}
            <FormControl fullWidth><InputLabel id="ExistingTracks">Events</InputLabel>
              <Select label="Select an event" value={eventID} onChange={handleEventSelect} fullWidth >
                <MenuItem value={0} >Select Event</MenuItem>
                {eventList && eventList.map((event) => (
                  <MenuItem key={event.EventID} value={event.EventID}>{event.Title + " " + StringtoDate(event.EventDate.toString())}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} >
            <TextField
              label="Event Report"
              fullWidth
              multiline
              value={watch('Report') ? watch('Report') : ''}
              rows={4}
              {...register('Report')}
            />
          </Grid>
          <Grid item xs={12} sx={styleGridPadded.Grid}>  {/* //Image titles */}
            <Typography variant="h6">Image uploads</Typography>
          </Grid>
          <Grid item xs={12} >   {/* image adding row */}
            {/* Use the currentFile to populate the img tag if a file is present */}
            {/* <div style={{ width: '100%', height: '100%', backgroundImage: `url(${iconImage ? URL.createObjectURL(iconImage) : ''})` }}></div> */}
            {/* <img src={ IconURL }  alt="Thumbnail" /> */}
            <img src={iconImage ? URL.createObjectURL(iconImage) : 'https://via.placeholder.com/80'} alt="profile"  />

          </Grid>
          <Grid item xs={12}>
            <Button component="label"
              disabled={!eventSelected}
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<ImageSearch />}>Locate Image
              <VisuallyHiddenInput type="file" onChange={selectFile} accept='image/*'/>
            </Button>
            <TextField
              label="Selected image file"
              fullWidth
              disabled={true}
              margin="normal"
              value={watch('NextFile')}
              {...register('NextFile')}
            />
            {currentFile && <Typography variant="body2">Selected file: {currentFile.name}</Typography>}
          </Grid>
          <Grid item xs={12} >
            <TextField
              label="Image caption"
              fullWidth
              multiline
              rows={4}
              {...register('Imagecaption')}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={!currentFile}
              onClick={upload}
              startIcon={<CloudUpload />}
            >
              Upload Image
            </Button>
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              rows={table}
              initialState={{
                columns:
                  { columnVisibilityModel: { id: false } }
              }}
              columns={Imagecolumns}
            />
          </Grid>

          <Grid item xs={12} sx={styleGridPadded.Grid}>
            <Typography variant="h6">YouTube and Instagram links</Typography>
          </Grid>
          <Grid />
          <Grid item xs={12} >
            <TextField
              label="Clip URL"
              fullWidth
              {...register('NextURL')}
            />
          </Grid>
          <Grid item xs={12} >
            <TextField
              label="Clip Caption"
              fullWidth
              multiline
              rows={4}
              {...register('Clipcaption')}
            />
          </Grid>
          <Grid item xs={12} >
            <Button variant="contained" disabled={!eventSelected} onClick={handleAddClip}>Add Clip</Button>
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              rows={ClTab}
              initialState={{
                columns:
                  { columnVisibilityModel: { id: false } }
              }}
              columns={clipColumns}
            />
          </Grid>
          <Grid />
          <Grid item xs={12} >
            <Button variant="contained" disabled={!eventSelected} fullWidth onClick={handleSaveArchive}>Save Archive</Button>
          </Grid>
        </Grid>
        <Snackbar
          open={Snackopen}
          autoHideDuration={6000}
          onClose={handleClose}
          message={SnackMessage}
          action={action}
        />

      </form>
    </>
  );
}

//
