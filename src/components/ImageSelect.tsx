//This component allows the user to add or select images for the logo or background image of the website.

import React, { useState, useEffect } from 'react';
import { Button, Typography, Snackbar } from '@mui/material';
import { Grid2 } from '@mui/material';
import styled from '@emotion/styled';
import { ImageSearch, CloudUpload } from '@mui/icons-material';
import { TextField, RadioGroup, FormControlLabel, Radio, IconButton } from '@mui/material';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import { EmptyImageDetail, ImageDetail } from '../types/types.d';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import UploadService from '../services/FileUploadService';
import { set } from 'react-hook-form';
import FileResizeService from '../services/ResizeImage';
import FileUploadService from '../services/FileUploadService';
import { EmptyURLdetails } from '../types/types.d';
import { deleteImageRecord, ImagesFromEvent } from '../services/queries';

interface ImagesSelectedProps {
    logoImage: string;
    backgroundImage: string;
    onSelect: (selectedImages: ImageSelection) => void;
}

export interface ImageSelection {
    logoImage: string;
    backgroundImage: string;
}

// to migrate from Grid2 to grid2 you need to change the import statement to 
// npx @mui/codemod@latest v6.0.0/grid-v2-props <path/to/your/project>

// in this case the path is ../src/components/ImageSelect.tsx

const ImageSelect = (props: ImagesSelectedProps) => {
    const { logoImage, backgroundImage, onSelect } = props;
    //console.log("pb: "+ backgroundImage)

    var BackgroundDetails: ImageDetail = EmptyImageDetail()
    var LogoDetails: ImageDetail = EmptyImageDetail()
    const [LogoImageName, setLogoImageName] = useState<string>("");
    const [BackgroundImageName, setBackgroundImageName] = useState<string>("");
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
        console.log("delete image: " + id)
        // delete the image from the database
        deleteImageRecord(id).
            then(() => {
                // remove the image from the images array
                console.log("images length before delete: " + images.length)
                const newImages = images.filter((image) => image.imageID !== id);
                setImages(newImages);

                console.log("images length after delete: " + images.length)
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
    const [progress, setProgress] = useState<number>(0);
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
    const tableRowsImages = images.map((image) => {
        //console.log("image: " + image.eventID)
        return { image: image, filename: image.filename, caption: image.caption, id: image.imageID, type: gatherType(image.eventID), width: image.width, height: image.height }
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

    function imageURL(imagename: string): string {
        //
        // urlencode the filename
        let stringURL = EmptyURLdetails()
        var filename = stringURL.url + "images/"+ encodeURIComponent(imagename)
        console.log("filename: " + filename)
        return filename
    }


    function newHeight(width: number, height: number): number {
        return 100 * height / width
    }

    useEffect(() => {
        // assign the logo and background images to the logo and background image objects
        setLogoImageName(logoImage);
        setBackgroundImageName(backgroundImage);
        ImagesFromEvent(0)
            .then((response) => {
                // console.log(response.data)
                // the data needs converting to an array of imagedetail objects
                var newImages: ImageDetail[] = []
                for (var i = 0; i < response.length; i++) {
                    var newImage: ImageDetail = EmptyImageDetail()
                    newImage.imageID = response[i].imageID
                    newImage.caption = imageURL(response[i].filename)
                    newImage.eventID = response[i].eventID
                    newImage.filename = response[i].filename
                    newImage.height = response[i].height
                    newImage.width = response[i].width
                    newImages.push(newImage)
                }
                setImages(newImages)
            })
            .catch((error) => {
                setSnackMessage("Error getting the images from the database 6784 " + error)
                setSnackOpen(true)
                //                console.log(error)
            })
    }
        , [])

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

    function BackgroundImage(BGFile: File) {
        let background = new Promise<ImageDetail>((resolve, reject) => {
            var img = new Image();
            img.src = URL.createObjectURL(BGFile);
            img.onload = () => {
                BackgroundDetails.height = img.height;
                BackgroundDetails.width = img.width;
                BackgroundDetails.filename = BGFile.name;
                BackgroundDetails.eventID = 0;
                BackgroundDetails.caption = imageURL(BGFile.name);
            }
            resolve(BackgroundDetails);
        }
        )
    }


    const upload = () => {
        if (typeof currentFile == 'undefined') {
            alert('Please select an image to upload');
            return;
        }
        var thumbnail: File;
        var background: File;
        var logo: File;
        // resize the image to thumbnail, create the imagedetail object and add this to the images array
        FileResizeService.resizeImage(currentFile, 100).then(
            FileResizeService.dataURLtoFile).then((res) => {
                var ThumbnailDetails = res.fileDetails;
                ThumbnailDetails.eventID = 0;
                ThumbnailDetails.caption = imageURL(res.fileDetails.filename);
                thumbnail = res.returnedFile;
                setImages([...images, ThumbnailDetails]);
                if (ImageSelect === "Logo") {
                    FileResizeService.resizeImage(currentFile, 250).then(
                        FileResizeService.dataURLtoFile).then((res) => {
                            var LogoDetails = res.fileDetails;
                            LogoDetails.eventID = -1;
                            logo = res.returnedFile;
                        }
                        ).then(() => {
                            UploadService.upload(logo, LogoDetails.filename, -1, LogoDetails.width, LogoDetails.height, '', 'http://localhost:3001/uploadLogo', (event: { loaded: number; total: number; }) => {
                                setProgress(Math.round((100 * event.loaded) / event.total));
                            }).then(UploadService.sendFile).then(() => {
                                setLogoImageName("")
                                setCurrentFile(undefined);
                                setNextFile('');

                                setSnackMessage("Logo Image uploaded successfully")
                                setSnackOpen(true)
                            }
                            )
                        } 
                    )
                }
                else {
                    // if it is not a logo then the image is background which is not resized.  So we need to get the size information and add this to the images array
                    FileResizeService.getSize(currentFile).then((res) => {
                        FileUploadService.upload(currentFile, res.filename, 0, res.width, res.height, '', 'http://localhost:3001/uploadBackground', (event: { loaded: number; total: number; }) => {
                            setProgress(Math.round((100 * event.loaded) / event.total));
                        } ).then(UploadService.sendFile).then(() => {
                            setBackgroundImageName("")
                            setCurrentFile(undefined);
                            setNextFile('');
                            setSnackMessage("Background Image uploaded successfully")
                            setSnackOpen(true)
                        }
                        )
                    }
                    )
                }
            }
        )
    }

    


                            return(
        <>
            <Grid2 container spacing={3} >
                <Grid2 size={12}>
                    <Typography variant="h4" align="center">Select Images</Typography>
                </Grid2>
                <Grid2 size={6}>
                    <Grid2 container spacing={3} >

                        <Grid2 size={4} alignContent="center">
                            <Button component="label"
                                role={undefined}
                                variant="contained"
                                fullWidth
                                startIcon={<ImageSearch />}>Locate Image
                                <VisuallyHiddenInput type="file" accept='image/*'
                                    // we need to run the selectFile function without triggering a re-render
                                    onChange={selectFile} />
                            </Button>
                        </Grid2>
                        <Grid2 size={8} alignContent="center">
                            <TextField
                                label="Selected image file"
                                fullWidth
                                disabled={true}
                                margin="normal"
                                // tihis is the file that is selected but is not updating when the file is selected
                                value={nextFile}
                            />
                        </Grid2>
                        <Grid2 size={4} alignContent="center">
                            <Button
                                //sx={{ marginTop: 1 }}
                                disabled={!currentFile}
                                onClick={upload}
                                fullWidth
                                startIcon={<CloudUpload />}
                            >
                                Upload Image
                            </Button>
                        </Grid2>
                        <Grid2 size={8} alignContent={"center"}>
                            <RadioGroup row aria-label="position" name="position" defaultValue="top" value={ImageSelect} onChange={handleImageSelect()}>
                                <FormControlLabel value="Logo" control={<Radio />} label="Logo" />
                                <FormControlLabel value="Background" control={<Radio />} label="Background" />
                            </RadioGroup>
                        </Grid2>
                        <Grid2 size={12}>

                            <TextField
                                id="LogoUpload"
                                label="Logo Image"
                                // make this textfield uneditable
                                disabled
                                fullWidth
                                value={LogoImageName}
                            /><br /><br />
                            <TextField
                                id="backgroundImage"
                                label="Background Image"
                                // make this textfield uneditable
                                disabled
                                fullWidth
                                value={BackgroundImageName}
                            />
                        </Grid2>
                    </Grid2>
                </Grid2>
                <Grid2 size={6}>
                    {/* table of the images */}
                    <DataGrid rows={tableRowsImages} columns={tableColsImages} autoHeight={true} disableColumnMenu={false} />
                </Grid2>

            </Grid2>
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

