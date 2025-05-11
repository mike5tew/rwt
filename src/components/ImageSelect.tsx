//This component allows the user to add or select images for the logo or background image of the website.

import React, { useState, useEffect } from 'react';
import { Button, Typography, Snackbar } from '@mui/material';
import  Grid  from '@mui/material/Grid';
import styled from '@emotion/styled';
import { ImageSearch, CloudUpload } from '@mui/icons-material';
import { TextField, RadioGroup, FormControlLabel, Radio, IconButton } from '@mui/material';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import { EmptyImageDetail, ImageDetail, EmptyDatURLResponse } from '../types/types.d';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import UploadService from '../services/FileUploadService';
import { set } from 'react-hook-form';
import FileResizeService from '../services/ResizeImage';
import FileUploadService from '../services/FileUploadService';

import { ImageDELETE, ImageBackGET } from '../services/queries';
import { flexbox } from '@mui/system';

interface ImagesSelectedProps {
    logoImage: string;
    backgroundImage: string;
    // the line below is the function that is called when the user selects an image.  It is passed in as a prop from the parent component and is used to update the logo and background images
    onSelect: (selectedImages: ImageSelection) => void;
}

export interface ImageSelection {
    logoImage: string;
    backgroundImage: string;
}

const ImageSelect = (props: ImagesSelectedProps) => {
    const { logoImage, backgroundImage, onSelect } = props;
    //console.log("pb: "+ backgroundImage)

    var BackgroundDetails: ImageDetail = EmptyImageDetail()
    var LogoDetails: ImageDetail = EmptyImageDetail()
    const [LogoImageName, setLogoImageName] = useState<string>(logoImage);
    const [BackgroundImageName, setBackgroundImageName] = useState<string>(backgroundImage);
    const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);
    const [ImageSelect, setImageSelect] = useState<string>("Logo")
    const gatherType = (imagetype: number) => {
        if (imagetype === -1) {
            return "Lg"
        } else {
            return "Bk"
        }
    }
    function DeleteImage(id: number): void {
        // console.log("delete image: " + id)
        // delete the image from the database
        ImageDELETE(id).
            then(() => {
                // remove the image from the images array
                // console.log("images length before delete: " + images.length)
                const newImages = images.filter((image) => image.imageID !== id);
                setImages(newImages);

                // console.log("images length after delete: " + images.length)
                //snackbar message to say the image has been deleted
                setSnackMessage("Image deleted successfully")
                setSnackOpen(true)
            })
            .catch(() => {
                //snackbar message to say the image has not been deleted
                setSnackMessage("Error deleting the image")
                setSnackOpen(true)
            })
    }

    const [nextFile, setNextFile] = useState<string>("");
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
    // we need to get the list of images from the database and store them in an array of imagedetails objects
    const [images, setImages] = useState<ImageDetail[]>([])
    const tableColsImages = [
        {
            field: 'image', headerName: 'Image', flex: 2, renderCell: (params: GridCellParams) =>
                (<img src={params.row.caption} width="100" height={newHeight(params.row.width, params.row.height)} />)
        },
        { field: 'filename', headerName: 'File Name', flex: 2 },
        { field: "type", headerName: "Select", flex: 1, renderCell: (params: GridCellParams) => (<Button variant="outlined" onClick={() => setImageValue(params.row.type, params.row.filename)}>{params.row.type}</Button>) },
        { field: "select", headerName: "Delete", flex: 1, renderCell: (params: GridCellParams) => (<IconButton onClick={() => DeleteImage(params.row.id)}><DeleteForeverOutlinedIcon /></IconButton>) }
    ]
    const tableRowsImages = images && images.map((image) => {
        //console.log("image: ", image)
        return { image: image, filename: image.filename, caption: image.imageURL, id: image.imageID, type: gatherType(image.eventID), width: image.width, height: image.height }
    })

    const handleImageSelect = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageSelect(event.target.value)
    }

    const setImageValue = (type: string, filename: string) => {
        if (type === "logo") {
            const ThisSelection: ImageSelection = { logoImage: filename, backgroundImage: BackgroundDetails.filename }
            setLogoImageName(filename)
            // The onSelect function is passed in as a prop from the parent component and is used to update the logo and background images
            onSelect(ThisSelection)
        } else {
            const ThisSelection: ImageSelection = { logoImage: LogoDetails.filename, backgroundImage: filename }
            setBackgroundImageName(filename)
            onSelect(ThisSelection)
        }

    }

    const processImageUrl = (filename: string | null, screensize: string): string => {
      if (!filename) return '/default-image.png'; // Handle empty filenames
      return screensize === 'mobile'
        ? `${process.env.REACT_APP_API_URL}/images/mobile/${filename}`
        : `${process.env.REACT_APP_API_URL}/images/desktop/${filename}`;
    };
    

    function processImages(Imgs: ImageDetail[]): ImageDetail[] {
        return Imgs.map(Img => {
          const imgDetail = EmptyImageDetail();
          imgDetail.imageID = Img.imageID;
          // Use the full Filename path directly without /api prefix
          imgDetail.filename = Img.filename;
          imgDetail.imageURL = processImageUrl(Img.filename, 'mobile');
          imgDetail.caption = Img.caption;
          imgDetail.eventID = Img.eventID;
          imgDetail.width = Img.width || 450;  // Add default width if not provided
          imgDetail.height = Img.height || 450;  // Add default height if not provided
          imgDetail.rows = 1;
          imgDetail.cols = 1;
            return imgDetail;
            
        });
    }

    const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        // set the current file to the file selected
        if (typeof event.target.files?.length == 'undefined' || event.target.files?.length == 0 || event.target.files == null || event.target.files.length > 1) {
            alert('Please select a single image to upload');
            setCurrentFile(undefined);
            setNextFile('');
            return
        }
        if (typeof event.target.files[0] == 'undefined') {
            // if there is no file selected then return an error message
            alert('Please select a single image to upload');
            return
        } else {
            // set the current file to the file selected
            setCurrentFile(event.target.files[0]);

            if (typeof event.target.files[0]?.name === "string") {
                // set the value of the nextFile to the name of the file
                // console.log('currentFile: ' + currentFile?.name);
                setNextFile(event.target.files[0]?.name);
                // resize the image to fit the icon and thumbnail sizes
            } else {
                alert("CurrentFilename defined as " + typeof currentFile?.name);
                return
            }
        }
    }


    function newHeight(width: number, height: number): number {
        return 100 * height / width
    }

    useEffect(() => {
        setLogoImageName(logoImage);
        setBackgroundImageName(backgroundImage);
    }, [logoImage, backgroundImage]);

    useEffect(() => {
        // assign the logo and background images to the logo and background image objects
        setLogoImageName(props.logoImage);
        setBackgroundImageName(props.backgroundImage);
        ImageBackGET()
            .then((data) => {
              
                    console.log("respon: ", data)
                    const imageElements = Array.isArray(data) ? processImages(data) : [];
                    console.log("respon: ", data)

                setImages(imageElements)
               
            }
            )
            .catch((error) => {
                console.error('Error:', error);
                setImages([]);
            });
    }, [props.logoImage, props.backgroundImage]);
    // snackbar message to say the image has been uploaded

    const [Snackopen, setSnackOpen] = useState(false);
    const [SnackMessage, setSnackMessage] = useState("");
    const handleClose = () => {
        setSnackOpen(false);
    }
    const action = (
        <Button color="secondary" size="small" onClick={handleClose}>
            Close
        </Button>
    );



    const upload = () => {
        if (!currentFile) {
            alert('Please select an image to upload');
            return;
        }
        console.log("ImageSelect: " + ImageSelect)
        if (ImageSelect === "Logo") {
            FileResizeService.ResizeImage(currentFile, 200, -1, "logo")
                .then((res) => {
                    const LogoDetails = res.FileDetails;
                    const logoFile = res.ReturnedFile;

                    return FileUploadService.upload(
                        logoFile,
                        LogoDetails.filename,
                        -1,
                        LogoDetails.width,
                        LogoDetails.height,
                        '',
                        'lg'
                    );
                })
                .then((formData) => {
                    return FileUploadService.SendFile(formData);
                })
                .then((retF) => {
                    if (!retF || typeof retF !== 'object') {
                        throw new Error('Invalid response from server');
                    }
                    setLogoImageName(retF.filename);
                    setCurrentFile(undefined);
                    setNextFile('');
                    const newLogoDetails = {
                        ...LogoDetails,
                        imageID: retF.imageID,
                        EventID: -1,
                        ImageURL: `${process.env.REACT_APP_API_URL}/${retF.imageURL}`,
                        Filename: retF.filename,
                    };
                    setImages([...images, newLogoDetails]);
                    onSelect({ logoImage: retF.filename, backgroundImage: BackgroundDetails.filename });
                    setSnackMessage("Logo Image uploaded successfully");
                    setSnackOpen(true);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setSnackMessage("Error uploading the logo image: " + error.message);
                    setSnackOpen(true);
                });
        } else {
            // Upload main background image (desktop)
            FileResizeService.getSize(currentFile)
                .then((backgroundDetails) => {
                    return FileUploadService.upload(
                        currentFile,
                        backgroundDetails.filename,
                        0,
                        backgroundDetails.width,
                        backgroundDetails.height,
                        '',
                        'bk'
                    ).then((formData) => {
                        return FileUploadService.SendFile(formData);
                    }).then((retF) => {
                        if (!retF || typeof retF !== 'object') {
                            throw new Error('Invalid response from server');
                        }
                        // Now upload a mobile version
                        FileResizeService.ResizeImage(currentFile, 200, 0, "mobile")
                            .then((res) => {
                                const mobileDetails = res.FileDetails;
                                const mobileFile = res.ReturnedFile;
                                return FileUploadService.upload(
                                    mobileFile,
                                    mobileDetails.filename,
                                    0,
                                    mobileDetails.width,
                                    mobileDetails.height,
                                    '',
                                    'mb'
                                );
                            })
                            .then((mobileFormData) => {
                                return FileUploadService.SendFile(mobileFormData);
                            })
                            .then(() => {
                                setBackgroundImageName(retF.filename);
                                setCurrentFile(undefined);
                                setNextFile('');
                                const newBackgroundDetails = {
                                    ...backgroundDetails,
                                    imageID: retF.imageID,
                                    eventID: retF.eventID,
                                    imageURL: `${process.env.REACT_APP_API_URL}/${retF.imageURL}`,
                                    filename: retF.filename,
                                };
                                setImages([...images, newBackgroundDetails]);
                                onSelect({ logoImage: LogoDetails.filename, backgroundImage: retF.filename });
                                setSnackMessage("Background Image uploaded successfully");
                                setSnackOpen(true);
                            })
                            .catch((error) => {
                                console.error('Error uploading mobile background image:', error);
                                setSnackMessage("Error uploading the mobile background image: " + error.message);
                                setSnackOpen(true);
                            });
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setSnackMessage("Error uploading the background image: " + error.message);
                    setSnackOpen(true);
                });
        }
    }

    return(
        <>
            <Grid container spacing={3} >
                <Grid item xs={12}>
                    <Typography variant="h4" align="center">Select Images</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Grid container spacing={3} >

                        <Grid item xs={4} alignContent="center">
                            <Button component="label"
                                role={undefined}
                                variant="contained"
                                fullWidth
                                startIcon={<ImageSearch />}>Locate Image
                                <VisuallyHiddenInput type="file" accept='image/*'
                                    // we need to run the selectFile function without triggering a re-render
                                    onChange={selectFile} />
                            </Button>
                        </Grid>
                        <Grid item xs={8} alignContent="center">
                            <TextField
                                label="Selected image file"
                                fullWidth
                                disabled={true}
                                margin="normal"
                                // tihis is the file that is selected but is not updating when the file is selected
                                value={nextFile}
                            />
                        </Grid>
                        <Grid item xs={4} alignContent="center">
                            <Button
                                //sx={{ marginTop: 1 }}
                                disabled={!currentFile}
                                onClick={upload}
                                fullWidth
                                startIcon={<CloudUpload />}
                            >
                                Upload Image
                            </Button>
                        </Grid>
                        <Grid item xs={8} alignContent={"center"}>
                            <RadioGroup row aria-label="position" name="position" defaultValue="top" value={ImageSelect} onChange={handleImageSelect()}>
                                <FormControlLabel value="Logo" control={<Radio />} label="Logo" />
                                <FormControlLabel value="Background" control={<Radio />} label="Background" />
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="backgroundImage"
                                label="Background Image"
                                // make this textfield uneditable
                                disabled
                                fullWidth
                                value={BackgroundImageName}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    {/* table of the images */}
                    <DataGrid 
                        rows={tableRowsImages} 
                        columns={tableColsImages} 
                        disableColumnMenu={false} 
                        sx={{ backgroundColor: 'white' }} 
                    />
                </Grid>

            </Grid>
            <Snackbar
                open={Snackopen}
                autoHideDuration={6000}
                onClose={handleClose}
                message={SnackMessage}
                action={action}
            />
        </>
    )
}
export default ImageSelect;

