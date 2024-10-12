// this page allows the usert to create a new theme for the website
// using react-hook-form
import * as React from 'react';
import { useState, useEffect } from 'react';
import { set, useForm } from 'react-hook-form';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Paper, Snackbar, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { TextField } from '@mui/material';
import { ThemeDetails, EmptyImageDetail, ImageDetail } from '../types/types.d';
import { Box } from '@mui/system';
import { MenuItem, Button } from '@mui/material';
import { Select, } from '@mui/material';
import { InputLabel } from '@mui/material';
import { FormControl } from '@mui/material';
import { HexColorPicker } from "react-colorful";
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import { render } from '@testing-library/react';
import { CloudUpload, ImageSearch } from '@mui/icons-material';
import ImageSelect, { ImageSelection } from './ImageSelect';
import { themeDetails, themeDetailsPUT } from '../services/queries';

// There is an error TypeError: path.split is not a function
// This is because the path is not a string.  It is an object.  We need to use path.toString() to convert it to a string on line 41 of editTheme.tsx, which should read as follows:
// const [selectedItem, setSelectedItem] = useState<string>(path.toString());

export default function EditTheme() {

    const { register, handleSubmit, watch, setValue } = useForm<ThemeDetails>(
    );
    // we need to create an interface to store the images
    interface ImageChoice {
        backgroundImage: string;
        logoImage: string;
    }

    const [imgChoices, setImgChoices] = useState<ImageChoice>({ backgroundImage: "", logoImage: "" });

    const [selectedItem, setSelectedItem] = useState<"boxColour" | "textColour" | "textFont" | "backgroundImage" | "textboxColour" | "logoImage" | "bannerColour" | "menuColour" | "buttonColour" | "buttonHover" | "buttonTextColour" | "menuTextColour">("boxColour");
    // const history = useHistory();
    // we need to create a data grid to display the themedetails and to do this we need to override the renderCell function to display the colour as a coloured box
    // we also need to add a button to select the item to change
    const tableColumns = [
        { field: 'item', headerName: 'Item', flex: 2 },
        {
            field: 'colour', headerName: 'Colour', flex: 2, renderCell: (params: GridCellParams) =>
                (<Box sx={{ backgroundColor: params.row.colour }}>{params.row.colour}</Box>)
        },
        {
            field: 'button', headerName: 'Select', flex: 1, renderCell: (params: GridCellParams) => (
                <Button variant='outlined' onClick={() => setSelectedItem(params.row.button)}>Select</Button>
            )
        }
    ];
    const tableRows = [
        { id: 1, item: "Button Colour", colour: watch("buttonColour"), button: "buttonColour" },
        { id: 2, item: "Button Hover", colour: watch("buttonHover"), button: "buttonHover" },
        { id: 3, item: "Button Text Colour", colour: watch("buttonTextColour"), button: "buttonTextColour" },
        { id: 4, item: "Menu Colour", colour: watch("menuColour"), button: "menuColour" },
        { id: 5, item: "Menu Text Colour", colour: watch("menuTextColour"), button: "menuTextColour" },
        { id: 6, item: "Banner Colour", colour: watch("bannerColour"), button: "bannerColour" },
        { id: 7, item: "Background Colour", colour: watch("boxColour"), button: "boxColour" },
        { id: 8, item: "Text Colour", colour: watch("textColour"), button: "textColour" },
        { id: 9, item: "Textbox Colour", colour: watch("textboxColour"), button: "textboxColour" },
    ];


    const savechanges = () => {
        handleSubmit(onSubmit)();
    }
    const onSubmit = (data: ThemeDetails) => {
        // we need to use axios to post the data to the mysql database
        // we need to retrieve the logoimage, backgroundimage and the mobileimage from the imageselect component
        console.log(data)
        themeDetailsPUT(data).then(() => {
                //snackbar display the message using the response.data 
                setSnackMessage("Theme Saved.  Please refresh the page to see the changes")
                setSnackOpen(true)
                //console.log(response.data)                
            })
            .catch((error) => {
                setSnackMessage("Error saving theme iuew7: "+error)
                setSnackOpen(true)
                // console.log(error)
            })
    }



    // this useeffect is being run twice.  This is because the page is being rendered twice.  The first time it is rendered, the default values are set.  The second time it is rendered, the values are set from the database
    useEffect(() => {
        // we need to use axios to get the data from the mysql  database 
        themeDetails()
            .then((response) => {
                //console.log(response.data)
                if (typeof response.buttonColour != null) {
                setValue("buttonColour", response.buttonColour)
                }
                if (typeof response.buttonHover != null) {
                setValue("buttonHover", response.buttonHover)
                }
                if (typeof response.buttonTextColour != null) {
                setValue("buttonTextColour", response.buttonTextColour)
                }
                if (typeof response.menuColour != null) {
                setValue("menuColour", response.menuColour)
                }
                if (typeof response.menuTextColour != null) {
                setValue("menuTextColour", response.menuTextColour)
                }
                if (typeof response.bannerColour != null) {
                setValue("bannerColour", response.bannerColour)
                }
                if (typeof response.boxColour != null) {
                setValue("boxColour", response.boxColour)
                }
                // console.log(watch("buttonColour"))
                if (typeof response.textColour != null) {
                setValue("textColour", response.textColour)
                }
                if (typeof response.textboxColour != null) {
                setValue("textboxColour", response.textboxColour)
                }
                //console.log(response.textFont)
                if (typeof response.textFont != null) {
                setValue("textFont", response.textFont)
                }
                var imgChoice: ImageChoice 
                if (typeof response.backgroundImage != null) {
                setValue("backgroundImage", response.backgroundImage)
                imgChoices.backgroundImage = response.backgroundImage
                } 
                if (typeof response.logoImage != null) {
                setValue("logoImage", response.logoImage)
                imgChoices.logoImage = response.logoImage
                }
                if (typeof response.textSize != null) {
                setValue("textSize", response.textSize)
                }
            })
            .catch((error) => {
                setSnackMessage("Error getting theme details enkjhf76")
                setSnackOpen(true)
                // console.log(error)
            })
        //get a list of images from the database
    }
    // we need to rerender when the theme is submitted.  This is because the theme is being saved to the database
    // to do this we need a value that changes when the save button is clicked.  We can use the save button as the value by adding it to the dependency array
        , [])

    const handleSelected = (data:ImageSelection)=>{
        setValue("backgroundImage", data.backgroundImage)
        setValue("logoImage", data.logoImage)
        //console.log("logo name returned: "+data.backgroundImage + " " + data.logoImage)
    }
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


    return (
        <>
        <Grid container spacing={3} >
            <Grid size={12}>
                <Paper>
                    <Typography variant="h2">Edit Theme</Typography>
                </Paper>
            </Grid>
            <Grid size={12} alignContent={"center"}>
                <Typography variant="h4" align="center">Select the colours for the elements of the theme</Typography>
            </Grid>
            <Grid size={8}>
                <DataGrid rows={tableRows} columns={tableColumns} autoHeight={true} />
            </Grid>
            <Grid size={4} alignContent={"center"}>
                <Grid container spacing={1}>
                    <Grid size={12}>
                        {/* now we have the colour picker which should be aligned to the center of the box */}
                        <Paper sx={{ display: 'flex', justifyContent: 'center', alignContent: "center" }}>
                            <Typography variant="h4">Item Selected: {selectedItem}</Typography>
                        </Paper>
                    </Grid>
                    <Grid size={12} justifyContent={"center"}>
                        <Paper sx={{ display: 'flex', justifyContent: 'center', alignContent: "center" }}>
                            <HexColorPicker
                                // uses the selected item to set the colour in the form
                                onChange={(colour) => setValue(selectedItem, colour)}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={12}><Typography variant="h4" align='center'>Select the font for the text</Typography></Grid>
            <Grid size={6}>
                {/* Now we have the font select box */}
                <FormControl fullWidth>
                    <InputLabel id="font-select">Font</InputLabel>
                    <Select
                        labelId="font-select"
                        value={watch("textFont")}
                        label=""
                        placeholder='Font'
                        {...register("textFont")}
                    >
                        <MenuItem value={"Arial"}>Arial</MenuItem>
                        <MenuItem value={"Times New Roman"}>Times New Roman</MenuItem>
                        <MenuItem value={"Courier"}>Courier</MenuItem>
                        <MenuItem value={"Verdana"}>Verdana</MenuItem>
                        <MenuItem value={"Comic Sans MS"}>Comic Sans</MenuItem>
                        <MenuItem value={"Impact"}>Impact</MenuItem>
                        <MenuItem value={"Montserrat"}>Montserrat</MenuItem>
                        <MenuItem value={"Baskerville"}>Baskerville</MenuItem>
                        <MenuItem value={"GreyQo"}>GreyQo</MenuItem>
                        <MenuItem value={"Playwrite"}>Playwrite</MenuItem>
                        <MenuItem value={"Roboto"}>Roboto</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={6} >
                <TextField
                    {...register("textSize")}
                    label="Text Size"
                    placeholder="Text Size"
                    type="number"
                    fullWidth
                    value={watch("textSize") ?? 12}
                />
            </Grid>
            <Grid size={12} >
                <ImageSelect onSelect={handleSelected} logoImage={imgChoices.logoImage} backgroundImage={imgChoices.backgroundImage} />
            </Grid>
            <Grid size={12}>
                <Button onClick={savechanges}>Save Change</Button>
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


// function colouredBox(arg0: string) {
//     throw new Error('Function not implemented.');
// }
