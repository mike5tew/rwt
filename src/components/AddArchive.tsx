//This page allows the admin user to add archive details to an event.
//The page contains a form to enter the archive details, and a table to display the images and clips that have been added to the archive.

import React, { useEffect, useState } from 'react';
import { ArchiveEntry, EmptyArchiveEntry, ImageDetail, EmptyImageDetail, Clip, EmptyClip, StringtoDate, EventDetails, DatURLResponse } from '../types/types.d';
import { DataGrid, GridColDef, GridRowId, GridCellParams } from '@mui/x-data-grid';
//import db from '../services/db';
import Grid2 from '@mui/material/Grid2';
import { Button, Paper, Typography, TextField, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm, SubmitHandler, Controller, set } from 'react-hook-form';
import { BorderAll, BorderInner, CloudUpload, ImageSearch, Send } from '@mui/icons-material';
import '../../src/App.css';
import { useNavigate } from 'react-router-dom';
import ResizeImage from '../services/ResizeImage';
// The api requess are being replaced by finctions in the queries file
import { ArchivesGET, updateArchiveEntry, ArchivePOST, EventArchiveGET, ClipPOST, ClipDELETE, EventsList, ImageDELETE } from '../services/queries';
import FileUploadService from '../services/FileUploadService';
import { json } from 'stream/consumers';
import { textAlign } from '@mui/system';
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
interface tableDetails {
  id: number;
  filename: string;
  caption: string
}
interface ClipTable {
  id: number;
  clipURL: string;
  caption: string;
}
function emptyTableDetails(): tableDetails {
  return { id: 0, filename: '', caption: '' };
}

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
  const [progress, setProgress] = useState<number>(0);
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
    EventsList().then((res) => {
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

  const selectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      alert('No file selected');
      return;
    }
  
    if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
      setFileType(file.type); // Assuming setFileType is a state setter
      setCurrentFile(file);
    } else {
      alert('Please select a valid image file');
      return;
    }
  
    try {
      const res = await changeFileSet(file);
        ResizeImage.ResizeImage(res, 100, eventID).then((res: DatURLResponse) => {

        setIconImage(res.ReturnedFile);
        var sDat = URL.createObjectURL(res.ReturnedFile);
        console.log('sDat:', sDat);
        setIconURL(sDat);
      }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }

  


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
//            setImages((prevImages) => [...prevImages, ImDetails]);

            // Upload the resized image
            //setIconURL(res.FileDetails.ImageURL);
            return FileUploadService.upload(res.ReturnedFile, res.ReturnedFile.name, eventID, res.FileDetails.Width, res.FileDetails.Height, res.FileDetails.Caption, setProgress);
        })
        .then((uploadRes: FormData) => {
            //console.log('File uploaded:', uploadRes);
            //setImages((prevImages) => [...prevImages, ImDetails]);
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
            return FileUploadService.upload(res.ReturnedFile, "mb"+res.ReturnedFile.name, eventID, res.FileDetails.Width, res.FileDetails.Height, res.FileDetails.Caption, (event: { loaded: number; total: number; }) => {
              setProgress(Math.round((100 * event.loaded) / event.total ));
            }
            );
        }
        )
        
        .then((uploadRes: FormData) => {
            //console.log('File uploaded:', uploadRes);
            return FileUploadService.SendFile(uploadRes);


            //console.log('File uploaded:', uploadRes);
            //setImages((prevImages) => [...prevImages, uploadRes.FileDetails]);
        }).then((respon: ImageDetail) => {
          if (respon) {
           // console.log('Mobile File uploaded:', respon);
         //   setImages((prevImages) => [...prevImages, respon]);
          }
        }
        )
        .catch((error) => {
            console.error('Error:', error);
        })
        .finally(() => {
            // Clear the current file
            setCurrentFile(undefined);
        });
};


  function handleEventSelect(event: SelectChangeEvent<Number>) {
    // set the eventID to the value of the event
    setEventID(event.target.value as number);
    // if the id =0 then reset the images and clips
    if (event.target.value === 0) {
      clearForm();
    } else {
      setEventSelected(true);
      console.log('EventID:', event.target.value);

      EventArchiveGET(event.target.value as number)
        .then(respon => {
          if (respon) {
            if (respon.ArchiveID > 0) {
            // set the report value
            setArchive(respon);
            // create an empty array of images and clips
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
                tb.caption = respon.Images[i].Caption
                tb.filename = respon.Images[i].Filename;
                // console.log('Image:', tb.filename);
                Tbtemp = [...Tbtemp, tb];
                imgDetail.ImageID = respon.Images[i].ImageID;
                imgDetail.Filename = respon.Images[i].Filename;
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
            console.log("Error: "+ (respon.Report))
            clearForm();
          }
        }
        }).catch(error => {
          console.log(error)
        });
    }
  }



  const handleAddClip = () => {
    var clipURL = watch('NextURL');
    var caption = watch('Clipcaption');
    if (clipURL !== "") {
      var newClip = EmptyClip();
      newClip.ClipURL = clipURL;
      newClip.Caption = caption;
      newClip.EventID = eventID;
      ClipPOST(newClip).then((respon) => {
        if (respon) {
          if (respon.ClipID > 0) {
          setSnackMessage("Clip added successfully")
          setSnackOpen(true)
          newClip.ClipID = respon.ClipID;
      setClTab([...ClTab, { id: newClip.ClipID, clipURL: newClip.ClipURL, caption: newClip.Caption }]);
      setClips([...clips, newClip]);
      setValue('NextURL', '');
      setValue('Clipcaption', '');
        } else {
          // convert the respon object to a string
          const res = JSON.stringify(respon);
          console.log(res)
          setSnackMessage("Error adding clip 1 " + res)
          setSnackOpen(true)
        }
      } else {
        console.log("Error adding clip" + respon)
        setSnackMessage("Error adding clip")
        setSnackOpen(true)
      }
      }
      );
    } else {
      setSnackMessage("Clip URL is required")
      setSnackOpen(true)
    }
  }



  function handleSaveArchive() {
    
    archive.Report = watch('Report');
    //console.log(archive);
    ArchivePOST(archive).then((respon) => {
      if (respon) {
        if (respon.ArchiveID > 0) {
          setSnackMessage("Archive details saved successfully")
          setSnackOpen(true)
          clearForm();
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


  function clearForm() {
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
    setEventID(0);
    setEventSelected(false);
  }

  const FormSubmitHandler: SubmitHandler<ArchiveEntry> = (data: ArchiveEntry) => {
    console.log(data);
  }


  return (
    <>
      <form onSubmit={handleSubmit(FormSubmitHandler)}>
        <Grid2 container spacing={2} >
          <Grid2 size={12} sx={{ paddingBottom: 2 }}>  {/* //Title full width */}
            <Paper elevation={3}>
              {/* align the text centrally */}
              <Typography variant="h2" component="h2" sx={{ textAlign: 'center' }} >Add Archive Details</Typography>
            </Paper>
          </Grid2>
          <Grid2 />
          <Grid2 size={12} > {/* //Event dropdown  */}
            <FormControl fullWidth><InputLabel id="ExistingTracks">Events</InputLabel>
              <Select label="Select an event" value={eventID} onChange={handleEventSelect} fullWidth >
                <MenuItem value={0} >Select Event</MenuItem>
                {eventList.map((event) => (
                  <MenuItem key={event.EventID} value={event.EventID}>{event.Title + " " + StringtoDate(event.EventDate.toString())}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={12} >
            <TextField
              label="Event Report"
              fullWidth
              multiline
              value={watch('Report') ? watch('Report') : ''}
              rows={4}
              {...register('Report')}
            />
          </Grid2>
          <Grid2 size={12} sx={styleGridPadded.Grid}>  {/* //Image titles */}
            <Typography variant="h6">Image uploads</Typography>
          </Grid2>
          <Grid2 size={12} >   {/* image adding row */}
            {/* Use the currentFile to populate the img tag if a file is present */}
            {/* <div style={{ width: '100%', height: '100%', backgroundImage: `url(${iconImage ? URL.createObjectURL(iconImage) : ''})` }}></div> */}
            {/* <img src={ IconURL }  alt="Thumbnail" /> */}
            <img src={iconImage ? URL.createObjectURL(iconImage) : 'https://via.placeholder.com/80'} alt="profile"  />

          </Grid2>
          <Grid2 size={12}>
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
          <Grid2 size={12} >
            <TextField
              label="Image caption"
              fullWidth
              multiline
              rows={4}
              {...register('Imagecaption')}
            />
          </Grid2>
          <Grid2 size={12}>
            <Button
              disabled={!currentFile}
              onClick={upload}
              startIcon={<CloudUpload />}
            >
              Upload Image
            </Button>
          </Grid2>
          <Grid2 size={12}>
            <DataGrid
              rows={table}
              initialState={{
                columns:
                  { columnVisibilityModel: { id: false } }
              }}
              columns={Imagecolumns}
            />
          </Grid2>

          <Grid2 size={12} sx={styleGridPadded.Grid}>
            <Typography variant="h6">YouTube and Instagram links</Typography>
          </Grid2>
          <Grid2 />
          <Grid2 size={12} >
            <TextField
              label="Clip URL"
              fullWidth
              {...register('NextURL')}
            />
          </Grid2>
          <Grid2 size={12} >
            <TextField
              label="Clip Caption"
              fullWidth
              multiline
              rows={4}
              {...register('Clipcaption')}
            />
          </Grid2>
          <Grid2 size={12} >
            <Button variant="contained" disabled={!eventSelected} onClick={handleAddClip}>Add Clip</Button>
          </Grid2>
          <Grid2 size={12}>
            <DataGrid
              rows={ClTab}
              initialState={{
                columns:
                  { columnVisibilityModel: { id: false } }
              }}
              columns={clipColumns}
            />
          </Grid2>
          <Grid2 />
          <Grid2 size={12} >
            <Button variant="contained" disabled={!eventSelected} fullWidth onClick={handleSaveArchive}>Save Archive</Button>
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

// 
