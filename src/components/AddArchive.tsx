//This page allows the admin user to add archive details to an event.
//The page contains a form to enter the archive details, and a table to display the images and clips that have been added to the archive.

import React, { useEffect, useState } from 'react';
import { ArchiveEntry, EmptyArchiveEntry, ImageDetail, EmptyImageDetail, Clip, EmptyClip, StringtoDate, EventDetails } from '../types/types.d';
import { DataGrid, GridColDef, GridRowId, GridCellParams } from '@mui/x-data-grid';
//import db from '../services/db';
import Grid2 from '@mui/material/Grid2';
import { Button, Grid, Paper, Typography, TextField, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm, SubmitHandler, Controller, set } from 'react-hook-form';
import { BorderAll, BorderInner, CloudUpload, ImageSearch } from '@mui/icons-material';
import '../../src/App.css';
import { useNavigate } from 'react-router-dom';
import FileUploadService from '../services/FileUploadService';
import FileResizeService from '../services/ResizeImage';
// The api requess are being replaced by finctions in the queries file
import { ArchivesGET, updateArchiveEntry, ArchivePOST, EventArchiveGET, ClipPOST, ClipDELETE, EventsList } from '../services/queries';
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
    setImages(images.filter((image) => image.ImageID !== id));
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
    ClipDELETE(id).then((respon) => {
          if (respon) {
            setSnackMessage("Clip removed successfully")
            setSnackOpen(true)
            setClips(clips.filter((clip) => clip.ID !== id));
          } else {
            setSnackMessage("Error removing clip")
            setSnackOpen(true)
          }
          return respon;
        }

    );
  };


  useEffect(() => {
    if (document.cookie === '') {
        console.log('No cookie');
        history('/Members');
    }
    // get the event list from the database
    EventsList().then((res) => {
      setEventList(res);
    }
    );
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
    setValue('NextFile', FileToAdd.name);
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
      setValue('NextFile', '');
      return
    }
    // set the current file to the selected file

    changeFileSet(event.target.files[0]).then((respon) => {

    console.log(typeof currentFile);
    if (respon) {
    FileResizeService.resizeImage(respon, 90).then(
      (respon) => {
        setIconImage(respon.ReturnedFile);
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
                ImDetails = res.FileDetails;
                ImDetails.EventID = eventID;
                ImageF = res.ReturnedFile;
            }
            ).then(() => {
              FileUploadService.upload(ImageF, ImDetails.Filename, eventID, ImDetails.Width, ImDetails.Height, ImDetails.Caption, addr, (event: { loaded: number; total: number; }) => {
                setProgress(Math.round((100 * event.loaded) / event.total));
              }).then((respon) => {
                console.log(respon);
                if (respon.data) {
                  // add the image to the images array
                  setImages([...images, respon.data]);
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

    
  EventArchiveGET(event.target.value as number)
    .then(respon => {
      if (respon) {

          // create an empty array of images and clips
          var imagesTp: ImageDetail[] = [];
          var clipsTp: Clip[] = [];
          for (let i = 0; i < respon.Images.length; i++) {
            var imgDetail = EmptyImageDetail();
            imgDetail.ImageID = respon.Images[i].ImageID;
            imgDetail.Filename = respon.Images[i].Filename;
            imgDetail.Caption = respon.Images[i].Caption;
            imgDetail.EventDetails.EventID = respon.Images[i].EventID;

            imagesTp = [...imagesTp, imgDetail];  
          }

          for (let i = 0; i < respon.Clips.length; i++) {
            var clip = EmptyClip();
            clip.ID = respon.Clips[i].ID  ;
            clip.ClipURL = respon.Clips[i].ClipURL;
            clip.Caption = respon.Clips[i].Caption;
            clip.EventID = respon.Clips[i].EventID;
            clipsTp = [...clipsTp, clip];
          }
          setImages(imagesTp);
          setClips(clipsTp);
          setValue("Report", respon.Report);
        }
      }).catch (error => {
        console.log(error)
      });
  }
}



const handleAddClip = () => {
  var clipURL = watch('NextURL');
  var caption = watch('Clipcaption');
  if (clipURL !== "" && caption !== "") {
    // we have two sets of clips. Those already saved and those being added
    // to separate these the new clips are given a clipID of 10000 or more
    //cycle through the clips to find the highest clipID
    var maxID = 0;
    clips.forEach(clip => {
      if (clip.ID > maxID) {
        maxID = clip.ID;
      }
    });
    if (maxID < 10000) {
      maxID = 10000;
    }
    let newClip: Clip = {
      ID: maxID + 1,
      ClipURL: clipURL,
      EventID: eventID,
      Caption: caption
    };
    setClips([...clips, newClip]);
    setValue('NextURL', '');
    setValue('Clipcaption', '');
  }
}


function handleClick() {
  let archive2 = EmptyArchiveEntry();
  archive2.EventDetails.EventID = eventID;  
  archive2.Images = images;
  archive2.Clips = clips;
  archive2.Report = watch('Report');
  console.log(archive);

  ArchivePOST(archive2).then((respon) => {
    if (respon) {
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
    setValue('Report', '');
    setValue('NextFile', '');
    setCurrentFile(undefined);
    setValue('Imagecaption', '');
    setValue('NextURL', '');
    setValue('Clipcaption', '');
    setEventID(0);
    setEventSelected(false);
}

const FormSubmitHandler: SubmitHandler<ArchiveEntry> = (data: ArchiveEntry) => {
  console.log(data);
}


return (
  <>
    <form onSubmit={handleSubmit(FormSubmitHandler)}>
        <Grid2  container spacing={2} >
          <Grid2  size={12} sx={{ padding: 2 }}>  {/* //Title full width */}
            <Paper elevation={3}>
            <Typography variant="h2" component="h2">Add Archive Details</Typography>
            </Paper>
          </Grid2>
          <Grid2/>
          <Grid2  size={12}  sx={styleGridPadded.Grid}> {/* //Event dropdown  */}
            <FormControl fullWidth><InputLabel id="ExistingTracks">Events</InputLabel>
              <Select label="Select an event" value={eventID} onChange={handleEventChange} >
                <MenuItem value={0}>Select Event</MenuItem>
                {eventList.map((event) => (
                  <MenuItem key={event.EventID} value={event.EventID}>{event.Title + " " + StringtoDate(event.EventDate.toString())}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>
          <Grid2  size={12} >
            <TextField
              label="Event Report"
              fullWidth
              multiline
              value={watch('Report') ? watch('Report') : ''}
              rows={4}
              {...register('Report')}
            />
          </Grid2>
          <Grid2  size={12} sx={styleGridPadded.Grid}>  {/* //Image titles */}
            <Typography variant="h6">Image uploads</Typography>
          </Grid2>
          <Grid2 size={12} >   {/* image adding row */}
            {/* Use the currentFile to populate the img tag if a file is present */}
            <img src={iconImage ? URL.createObjectURL(iconImage) : 'https://via.placeholder.com/80'} alt="profile"  />
          </Grid2>
          <Grid2  size={12}  >
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
              value={watch('NextFile')}
              {...register('NextFile')}
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
          </Grid2>
          <Grid2  size={12} >
            <TextField
              label="Image caption"
              fullWidth
              multiline
              rows={4}
              {...register('Imagecaption')}
            />
          </Grid2>
          <Grid2  size={12}>
            <Button
              disabled={!currentFile}
              onClick={upload}
              startIcon={<CloudUpload />}
            >
              Upload Image
            </Button>
          </Grid2>
          <Grid2  size={12}>
            <DataGrid
              rows={images}
              initialState = {{ columns:  
              { columnVisibilityModel:  {id: false }}
              }}
              columns={Imagecolumns}
            />
          </Grid2>

          <Grid2  size={12} sx={styleGridPadded.Grid}>
            <Typography variant="h6">YouTube links</Typography>
          </Grid2>          
          <Grid2  />
          <Grid2  size={12} >
            <TextField
              label="Clip URL"
              fullWidth
              {...register('NextURL')}
            />
          </Grid2>
          <Grid2  size={12} >
            <TextField
              label="Clip Caption"
              fullWidth
              multiline
              rows={4}
              {...register('Clipcaption')}
            />
          </Grid2>
          <Grid2  size={12} >
            <Button variant="contained" disabled={!eventSelected} onClick={handleAddClip}>Add Clip</Button>
          </Grid2>
          <Grid2  size={12}>
            <DataGrid
              rows={clips}
              initialState = {{ columns:  
                { columnVisibilityModel:  {id: false }}
                }}
              columns={clipColumns}
            />
          </Grid2>
          <Grid2 />
          <Grid2  size={12} >
            <Button variant="contained" disabled={!eventSelected} fullWidth onClick={handleClick}>Save Archive</Button>
          </Grid2>
        </Grid2>
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
