// this page allows the usert to create a new theme for the website
// using react-hook-form
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Paper, Snackbar, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { TextField } from '@mui/material';
import { ThemeDetails } from '../types/types.d';
import { Box } from '@mui/system';
import { MenuItem, Button } from '@mui/material';
import { Select, } from '@mui/material';
import { InputLabel } from '@mui/material';
import { FormControl } from '@mui/material';
import { HexColorPicker } from "react-colorful";
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import '../styles/fonts.css';
import ImageSelect, { ImageSelection } from './ImageSelect';
import { themeDetailsGET, ThemeDetailsPUT } from '../services/queries';

// There is an error TypeError: path.split is not a function
// This is because the path is not a string.  It is an object.  We need to use path.toString() to convert it to a string on line 41 of editTheme.tsx, which should read as follows:
// const [selectedItem, setSelectedItem] = useState<string>(path.toString());

export default function EditTheme() {
    const [TextFont, setTextFont] = useState<string>("");
    const { register, handleSubmit, watch, setValue } = useForm<ThemeDetails>(
    );
    const [fontsLoaded, setFontsLoaded] = useState(false);
    // we need to create an interface to store the images
    interface ImageChoice {
        BackgroundImage: string;
        LogoImage: string;
    }

    const [imgChoices, setImgChoices] = useState<ImageChoice>({ BackgroundImage: "", LogoImage: "" });

    const [selectedItem, setSelectedItem] = useState<"BoxColour" | "TextColour" | "TextFont" | "BackgroundImage" | "TextboxColour" | "LogoImage" | "BannerColour" | "MenuColour" | "ButtonColour" | "ButtonHover" | "ButtonTextColour" | "MenuTextColour">("BoxColour");
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
        { id: 1, item: "Button Colour", colour: watch("ButtonColour"), button: "ButtonColour" },
        { id: 2, item: "Button Hover", colour: watch("ButtonHover"), button: "ButtonHover" },
        { id: 3, item: "Button Text Colour", colour: watch("ButtonTextColour"), button: "ButtonTextColour" },
        { id: 4, item: "Menu Colour", colour: watch("MenuColour"), button: "MenuColour" },
        { id: 5, item: "Menu Text Colour", colour: watch("MenuTextColour"), button: "MenuTextColour" },
        { id: 6, item: "Banner Colour", colour: watch("BannerColour"), button: "BannerColour" },
        { id: 7, item: "Background Colour", colour: watch("BoxColour"), button: "BoxColour" },
        { id: 8, item: "Text Colour", colour: watch("TextColour"), button: "TextColour" },
        { id: 9, item: "Textbox Colour", colour: watch("TextboxColour"), button: "TextboxColour" },
    ];


    const savechanges = () => {
        handleSubmit(onSubmit)();
    }
    const onSubmit = (data: ThemeDetails) => {
        // we need to use axios to post the data to the mysql database
        // we need to retrieve the logoimage, backgroundimage and the mobileimage from the imageselect component
        console.log(data)
        ThemeDetailsPUT(data).then(() => {
                //snackbar display the message using the respon.data 
                setTextFont(data.TextFont)
                setSnackMessage("Theme Saved.  Please refresh the page to see the changes")
                setSnackOpen(true)
                //console.log(respon.data)                
            })
            .catch((error) => {
                setSnackMessage("Error saving theme iuew7: "+error)
                setSnackOpen(true)
                // console.log(error)
            })
    }

    useEffect(() => {
        themeDetailsGET()
            .then((respon) => {
                console.log(respon)
                if (typeof respon.ButtonColour != null) {
                setValue("ButtonColour", respon.ButtonColour)
                }
                if (typeof respon.ButtonHover != null) {
                setValue("ButtonHover", respon.ButtonHover)
                }
                if (typeof respon.ButtonTextColour != null) {
                setValue("ButtonTextColour", respon.ButtonTextColour)
                }
                if (typeof respon.MenuColour != null) {
                setValue("MenuColour", respon.MenuColour)
                }
                if (typeof respon.MenuTextColour != null) {
                setValue("MenuTextColour", respon.MenuTextColour)
                }
                if (typeof respon.BannerColour != null) {
                setValue("BannerColour", respon.BannerColour)
                }
                if (typeof respon.BoxColour != null) {
                setValue("BoxColour", respon.BoxColour)
                }
                // console.log(watch("buttonColour"))
                if (typeof respon.TextColour != null) {
                setValue("TextColour", respon.TextColour)
                }
                if (typeof respon.TextboxColour != null) {
                setValue("TextboxColour", respon.TextboxColour)
                }
                //console.log(respon.textFont)
                if (typeof respon.TextFont != null) {
                setValue("TextFont", respon.TextFont)
                }
                var imgChoice: ImageChoice 
                if (typeof respon.BackgroundImage != null) {
                setValue("BackgroundImage", respon.BackgroundImage)
                imgChoices.BackgroundImage = respon.BackgroundImage
                } 
                if (typeof respon.LogoImage != null) {
                setValue("LogoImage", respon.LogoImage)
                imgChoices.LogoImage = respon.LogoImage
                }
                if (typeof respon.TextSize != null) {
                setValue("TextSize", respon.TextSize)
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

    useEffect(() => {
        // Load custom fonts
        Promise.all([
            new FontFace('GreyQo', `url(/assets/fonts/GreyQo.ttf)`).load(),
            new FontFace('Playwrite', `url(/assets/fonts/Playwrite.ttf)`).load(),
            new FontFace('Montserrat', `url(/assets/fonts/Montserrat.ttf)`).load(),
        ]).then(fonts => {
            fonts.forEach(font => {
                document.fonts.add(font);
            });
            setFontsLoaded(true);
        }).catch(err => {
            console.error('Error loading fonts:', err);
            setFontsLoaded(true); // Continue anyway with system fonts
        });
    }, []);

    const handleSelected = (data:ImageSelection)=>{
        setValue("BackgroundImage", data.backgroundImage)
        setValue("LogoImage", data.logoImage)
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

    const fontOptions = [
        { value: "Arial", label: "Arial (System)" },
        { value: "Times New Roman", label: "Times New Roman (System)" },
        { value: "Courier", label: "Courier (System)" },
        { value: "Verdana", label: "Verdana (System)" },
        { value: "Comic Sans MS", label: "Comic Sans (System)" },
        { value: "Impact", label: "Impact (System)" },
        { value: "Montserrat", label: "Montserrat (Custom)" },
        { value: "Baskerville", label: "Baskerville (System)" },
        { value: "GreyQo", label: "GreyQo (Custom)" },
        { value: "Playwrite", label: "Playwrite (Custom)" },
        { value: "Roboto", label: "Roboto (System)" },
    ];

    if (!fontsLoaded) {
        return <div>Loading fonts...</div>;
    }

    return (
        <>
        <Grid container spacing={3} >
            <Grid item xs={12}>
                <Paper>
                    <Typography variant="h2">Edit Theme</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} alignContent={"center"}>
                <Typography variant="h4" align="center">Select the colours for the elements of the theme</Typography>
            </Grid>
            <Grid item xs={8}>
                <DataGrid 
                    rows={tableRows} 
                    columns={tableColumns} 
                    sx={{ backgroundColor: 'white' }} 
                />
            </Grid>
            <Grid item xs={4} alignContent={"center"}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        {/* now we have the colour picker which should be aligned to the center of the box */}
                        <Paper sx={{ display: 'flex', justifyContent: 'center', alignContent: "center" }}>
                            <Typography variant="h4">Item Selected: {selectedItem}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} justifyContent={"center"}>
                        <Paper sx={{ display: 'flex', justifyContent: 'center', alignContent: "center" }}>
                            <HexColorPicker
                                // uses the selected item to set the colour in the form
                                onChange={(colour) => setValue(selectedItem, colour)}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}><Typography variant="h4" align='center'>Select the font for the text</Typography></Grid>
            <Grid item xs={6}>
                {/* Now we have the font select box */}
                <FormControl fullWidth>
                    <InputLabel id="font-select">Font</InputLabel>
                    <Select
                        labelId="font-select"
                        value={watch("TextFont") || ""}
                        label="Font"
                        {...register("TextFont")}
                    >
                        {fontOptions.map((font) => (
                            <MenuItem 
                                key={font.value} 
                                value={font.value}
                                style={{ fontFamily: font.value }}
                            >
                                {font.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} >
                <TextField
                    {...register("TextSize", {
                        valueAsNumber: true,  // Add this to ensure number conversion
                        validate: (value) => !isNaN(value)
                    })}
                    label="Text Size"
                    placeholder="Text Size"
                    type="number"
                    fullWidth
                    defaultValue={12}
                    onChange={(e) => setValue("TextSize", parseInt(e.target.value) || 12)}
                />
            </Grid>
            <Grid item xs={12} >
                <ImageSelect onSelect={handleSelected} logoImage={imgChoices.LogoImage} backgroundImage={imgChoices.BackgroundImage} />
            </Grid>
            <Grid item xs={12}>
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
