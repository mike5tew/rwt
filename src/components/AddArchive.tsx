//This page allows the admin user to add archive details to an event.
//The page contains a form to enter the archive details, and a table to display the images and clips that have been added to the archive.

import React, { useEffect, useState } from 'react';
import { ArchiveEntry, EmptyArchiveEntry, ImageDetail, EmptyImageDetail, Clip, EmptyClip, StringtoDate, EventDetails } from '../types/types.d';
import { DataGrid, GridColDef, GridRowId, GridCellParams } from '@mui/x-data-grid';
import db from '../services/db';

import { Button, Grid, Paper, Typography, TextField, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm, SubmitHandler, Controller, set } from 'react-hook-form';
import { BorderAll, BorderInner, CloudUpload, ImageSearch } from '@mui/icons-material';
import '../../src/App.css';
import { useNavigate } from 'react-router-dom';
import FileUploadService from '../services/FileUploadService';
import FileResizeService from '../services/ResizeImage';
// The api requess are being replaced by finctions in the queries file
import { eventArchive, updateArchiveEntry, archivePOST } from '../services/queries';
// create a style for the input file button so it is effectively hidden by making it 0.1px high and wide

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

export default function AddArchive() {
  const { register, handleSubmit, watch, setValue } = useForm<ArchiveEntry>(
    { defaultValues: EmptyArchiveEntry() }
  );
  const [eventID, setEventID] = useState<number>(0);
  const [archive, setArchive] = useState<ArchiveEntry>(EmptyArchiveEntry());
  const [images, setImages] = useState<ImageDetail[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [iconImage, setIconImage] = useState<File | undefined>();
  const [imageFilename, setImageFilename] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<File | undefined>();
  const [progress, setProgress] = useState<number>(0);
  const [eventList, setEventList] = useState<EventDetails[]>([]);

  const [Snackopen, setSnackOpen] = useState(false);
  const [SnackMessage, setSnackMessage] = useState('');
  const [action, setAction] = useState(<></>);
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
  const handleRemoveImage = (id: GridRowId) => {
    setImages(images.filter((image) => image.imageID !== id));
  };
// this page is currently not completing loading.  This is because the images and clips are not being cleared when the event is changed.  This is because the images and clips are being set before the eventID is set.  This is because the eventID is set in the handleEventChange function.  This function is called when the event is changed.  The images and clips are set before the eventID is set.  This means that the images and clips are being

  const Imagecolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'filename', headerName: 'File', flex: 2 },
    { field: 'caption', headerName: 'Caption', flex: 3},
    {
      field: 'remove', headerName: 'Remove', flex: 1, renderCell: (params: GridCellParams) => (
        <Button variant='outlined' onClick={() => handleRemoveImage(params.row.id)}>Remove</Button>
      )
    }
  ];
  const handleRemoveClip = (id: GridRowId) => {
    // convert the id to a number
    id = Number(id);
    if (id < 10000) {
      // remove the clip from the database
      db.query('DELETE FROM clips WHERE clipID = ?', [id], (err: any) => {
        if (err) {
          console.log(err);
        }
      });
    }

    setClips(clips.filter((clip) => clip.id !== id));
  };


  useEffect(() => {
    if (document.cookie === '') {
        console.log('No cookie');
        history('/Members');
    }
    db.query('SELECT eventID, location, eventDate, title FROM choirevents ', (err: any, results: any) => {
      if (err) {
        console.log(err);
      }
      setEventList(results);
    });
  }
  , []);  

  const clipColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0},
    { field: 'clipURL', headerName: 'URL', flex: 2 },
    { field: 'caption', headerName: 'Caption', flex:3 },
    {
      field: 'remove', headerName: 'Remove', flex: 1, renderCell: (params: GridCellParams) => (
        <Button variant='outlined' onClick={() => handleRemoveClip(params.row.id)}>Remove</Button>
      )
    }
  ];

  function changeFileSet(FileToAdd: File) {
    return new Promise<File>((resolve) => {
    setCurrentFile(FileToAdd);
    setValue('nextFile', FileToAdd.name);
    resolve(FileToAdd);
    });
  }

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    // is a file selected?
  //  console.log(event.target.files?.length);
  //  console.log(typeof event.target.files);
    if (typeof event.target.files?.length === 'undefined' || event.target.files?.length == 0 || event.target?.files === null || event.target.files?.length > 1) {
      // if there is no file selected then return an error message
      alert('Please select a single image to upload');
      setCurrentFile(undefined);
      setValue('nextFile', '');
      return
    }
    // set the current file to the selected file

    changeFileSet(event.target.files[0]).then((response) => {

    console.log(typeof currentFile);
    if (response) {
    FileResizeService.resizeImage(response, 90).then(
      (response) => {
        setIconImage(response.returnedFile);
      }
    );
    }
    }
    );
  }

  // function to return a resized image
  function resizeImage(originalImage: File, newWidth: number) {
    if (originalImage) {
      var ImDetails = EmptyImageDetail();
      var ImageF = new File([], '', { type: '' });
      var addr ='';

            FileResizeService.resizeImage(originalImage, newWidth).then(
              FileResizeService.dataURLtoFile).then((res) => {
                ImDetails = res.fileDetails;
                ImDetails.eventID = eventID;
                ImageF = res.returnedFile;
            }
            ).then(() => {
              FileUploadService.upload(ImageF, ImDetails.filename, eventID, ImDetails.width, ImDetails.height, ImDetails.caption, addr, (event: { loaded: number; total: number; }) => {
                setProgress(Math.round((100 * event.loaded) / event.total));
              }).then((response) => {
                console.log(response);
                if (response.data) {
                  // add the image to the images array
                  setImages([...images, response.data]);
                  setSnackMessage("Logo Image uploaded successfully")
                  setSnackOpen(true)

                }
              });
            }
            );
    }
  }



const upload = () => {
  if (typeof currentFile == 'undefined') {
    alert('Please select an image to upload');
    return;
  }
  // resize the image for desktop and wait for the upload to complete before resizing the image for mobile
  resizeImage(currentFile, 400);
 resizeImage(currentFile, 250);
 // clear the current file
  setCurrentFile(undefined); 
};



function handleEventChange(event: SelectChangeEvent<Number>) {
  // set the eventID to the value of the event
  setEventID(event.target.value as number);
  // if the id =0 then reset the images and clips
  if (event.target.value === 0) {
    clearForm();
  } else {
    setEventSelected(true);

    
  eventArchive(event.target.value as number)
    .then(response => {
      if (response) {

          // create an empty array of images and clips
          var imagesTp: ImageDetail[] = [];
          var clipsTp: Clip[] = [];
          for (let i = 0; i < response.images.length; i++) {
            var imgDetail = EmptyImageDetail();
            imgDetail.imageID = response.images[i].imageID;
            imgDetail.filename = response.images[i].filename;
            imgDetail.caption = response.images[i].caption;
            imgDetail.eventDetails.eventID = response.images[i].eventID;

            imagesTp = [...imagesTp, imgDetail];  
          }

          for (let i = 0; i < response.clips.length; i++) {
            var clip = EmptyClip();
            clip.id = response.clips[i].id  ;
            clip.clipURL = response.clips[i].clipURL;
            clip.caption = response.clips[i].caption;
            clip.eventID = response.clips[i].eventID;
            clipsTp = [...clipsTp, clip];
          }
          setImages(imagesTp);
          setClips(clipsTp);
          setValue("report", response.report);
        }
      }).catch (error => {
        console.log(error)
      });
  }
}



const handleAddClip = () => {
  var clipURL = watch('nextURL');
  var caption = watch('clipcaption');
  if (clipURL !== "" && caption !== "") {
    // we have two sets of clips. Those already saved and those being added
    // to separate these the new clips are given a clipID of 10000 or more
    //cycle through the clips to find the highest clipID
    var maxID = 0;
    clips.forEach(clip => {
      if (clip.id > maxID) {
        maxID = clip.id;
      }
    });
    if (maxID < 10000) {
      maxID = 10000;
    }
    let newClip: Clip = {
      id: maxID + 1,
      clipURL: clipURL,
      eventID: eventID,
      caption: caption
    };
    setClips([...clips, newClip]);
    setValue('nextURL', '');
    setValue('clipcaption', '');
  }
}


function handleClick() {
  let archive2 = EmptyArchiveEntry();
  archive2.eventDetails.eventID = eventID;  
  archive2.images = images;
  archive2.clips = clips;
  archive2.report = watch('report');
  console.log(archive);
  archivePOST(archive2).then((response) => {
    if (response) {
      setSnackMessage("Archive details saved successfully")
      setSnackOpen(true)
      clearForm();   
    }
  }
  );
};



function clearForm() {
  setImages([]);
    setClips([]);
    setValue('report', '');
    setValue('nextFile', '');
    setCurrentFile(undefined);
    setValue('imagecaption', '');
    setValue('nextURL', '');
    setValue('clipcaption', '');
    setEventID(0);
    setEventSelected(false);
}

const FormSubmitHandler: SubmitHandler<ArchiveEntry> = (data: ArchiveEntry) => {
  console.log(data);
}


return (
  <>
    <form onSubmit={handleSubmit(FormSubmitHandler)}>
        <Grid container spacing={2} >
          <Grid item xs={12} sx={{ padding: 2 }}>  {/* //Title full width */}
            <Paper elevation={3}>
            <Typography variant="h2" component="h2">Add Archive Details</Typography>
            </Paper>
          </Grid>
          <Grid item md={2}/>
          <Grid item xs={12} md={4} sx={styleGridPadded.Grid}> {/* //Event dropdown  */}
            <FormControl fullWidth><InputLabel id="ExistingTracks">Events</InputLabel>
              <Select label="Select an event" value={eventID} onChange={handleEventChange} >
                <MenuItem value={0}>Select Event</MenuItem>
                {eventList.map((event) => (
                  <MenuItem key={event.eventID} value={event.eventID}>{event.title + " " + StringtoDate(event.eventDate.toString())}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Event Report"
              fullWidth
              multiline
              value={watch('report') ? watch('report') : ''}
              rows={4}
              {...register('report')}
            />
          </Grid>
          <Grid item xs={12} sx={styleGridPadded.Grid}>  {/* //Image titles */}
            <Typography variant="h6">Image uploads</Typography>
          </Grid>
          <Grid item sx={styleGridLeft.Grid} xs={12} md={2} >   {/* image adding row */}
            {/* Use the currentFile to populate the img tag if a file is present */}
            <img src={iconImage ? URL.createObjectURL(iconImage) : 'https://via.placeholder.com/80'} alt="profile"  />
          </Grid>
          <Grid item xs={12} md={4} >
            <Button component="label"
              disabled={!eventSelected}
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<ImageSearch />}>Locate Image
              <VisuallyHiddenInput type="file" onChange={selectFile} accept='image/*'
              />
            </Button>
            <TextField
              label="Selected image file"
              fullWidth
              disabled={true}
              margin="normal"
              value={watch('nextFile')}
              {...register('nextFile')}
            />
            {currentFile && (
              <div >
                <div
                  className="progress-bar progress-bar-info"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  style={{ width: progress + "%" }}
                >
                  {progress}%
                </div>
              </div>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Image caption"
              fullWidth
              multiline
              rows={4}
              {...register('imagecaption')}
            />
          </Grid>
          <Grid item xs={12} md={1}>
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
              rows={images}
              initialState = {{ columns:  
              { columnVisibilityModel:  {id: false }}
              }}
              columns={Imagecolumns}
            />
          </Grid>

          <Grid item xs={12} sx={styleGridPadded.Grid}>
            <Typography variant="h6">YouTube links</Typography>
          </Grid>          
          <Grid item md={2}/>
          <Grid item xs={12} md={4}>
            <TextField
              label="Clip URL"
              fullWidth
              {...register('nextURL')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Clip Caption"
              fullWidth
              multiline
              rows={4}
              {...register('clipcaption')}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button variant="contained" disabled={!eventSelected} onClick={handleAddClip}>Add Clip</Button>
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              rows={clips}
              initialState = {{ columns:  
                { columnVisibilityModel:  {id: false }}
                }}
              columns={clipColumns}
            />
          </Grid>
          <Grid item md={8}/>
          <Grid item xs={12} md={4}>
            <Button variant="contained" disabled={!eventSelected} fullWidth onClick={handleClick}>Save Archive</Button>
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
