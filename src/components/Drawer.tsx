import React, { useEffect } from 'react';
import { createTheme, styled, useTheme, ThemeProvider, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
// import the monsterrat font
// import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import MailIcon from '@mui/icons-material/Mail';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThumbsUpDownOutlinedIcon from '@mui/icons-material/ThumbsUpDownOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import InfoIcon from '@mui/icons-material/Info';
import { deepmerge } from '@mui/utils';
// import LocationCitySharpIcon from '@mui/icons-material/LocationCitySharp';
// import AccountTreeIcon from '@mui/icons-material/AccountTree';
// import DescriptionIcon from '@mui/icons-material/Description';
// import DateRangeIcon from '@mui/icons-material/DateRange';
// import KeyboardBackspaceSharpIcon from '@mui/icons-material/KeyboardBackspaceSharp';
import { Outlet, useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-native';
import Grid from '@mui/material/Grid'; // Grid version 1
import SettingsIcon from '@mui/icons-material/Settings';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CampaignIcon from '@mui/icons-material/Campaign';
// import '../styles/mgtStyles.css'
import { teal } from '@mui/material/colors';
import { siteinfo, themeDetails } from '../services/queries';
// import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
//  import LoginStyle from 'LoginStyle';
//themeDetails, boxColour, textColour, textFont, backgroundImage, textboxColour, logoimage

export default function MiniDrawer() {
  const [BoxColour, setBoxColour] = React.useState('#222222');
  const [TextColour, setTextColour] = React.useState('#222222');
  const [TextFont, setTextFont] = React.useState('Arial');
  const [TextboxColour, setTextboxColour] = React.useState('#222222');
  const [bannerColour, setBannerColour] = React.useState('#222222');
  const [menuColour, setMenuColour] = React.useState('#222222');
  const [buttonColour, setButtonColour] = React.useState('#222222');
  const [buttonHover, setButtonHover] = React.useState('#222222');
  const [buttonTextColour, setButtonTextColour] = React.useState('#222222');
  const [menuTextColour, setMenuTextColour] = React.useState('#222222');
  const [textSize, setTextSize] = React.useState(12);


  const drawerWidth = 240;
  var theme2 = createTheme({
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: menuColour,
            color: menuTextColour,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: bannerColour,
            color: menuTextColour,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: buttonTextColour,
            backgroundColor: buttonColour,
            '&:hover': {
              backgroundColor: buttonHover,
            },
          },
        },
      },
      // make the textfields filled
      MuiFilledInput: {
        styleOverrides: {
          root: {
            backgroundColor: TextboxColour,
            '&:hover': {
              backgroundColor: TextboxColour,
            },
          },
        },
      },
      // background of the boxes in the grid
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: BoxColour,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: 'red',
            backgroundColor: TextboxColour,
            '&:hover': {
              backgroundColor: teal[50],
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            color: TextColour,
            backgroundColor: TextboxColour
          },
        },
      },
    },
    typography: {
      fontFamily: TextFont,
      fontSize: textSize,
      // fontWeightLight: 400,
      // fontWeightRegular: 500,
      // fontWeightMedium: 600,
      // fontWeightBold: 700,
    },

  });


  useEffect(() => {
    // get the background image from the server
    themeDetails().then(response => {
       // console.log(response.data);
        const themeDetails = response
        setBoxColour(themeDetails.boxColour);
        setTextColour(themeDetails.textColour);
        setTextFont(themeDetails.textFont);
        // console.log("THIS IS THE FONT :"+themeDetails.textFont);
        // urlecode the filename
        var filename = encodeURIComponent(themeDetails.backgroundImage)
        setImage(imageURL(filename));
        console.log("THIS IS THE IMAGE :"+imageURL(filename));
        setTextboxColour(themeDetails.textboxColour);
        // setLogoImage(themeDetails.logoImage);
        setBannerColour(themeDetails.bannerColour);
        setMenuColour(themeDetails.menuColour);
        setButtonColour(themeDetails.buttonColour);
        setButtonHover(themeDetails.buttonHover);
        setButtonTextColour(themeDetails.buttonTextColour);
        setMenuTextColour(themeDetails.menuTextColour);
        setTextSize(themeDetails.textSize);
        getSiteDetails();
      }
      )
      .catch((error) => {
        console.log(error.response + " this is the error")
      }
      )
  }
    , []);
  
function getSiteDetails() {
  siteinfo().then(response => {
    
          // we need carruage returns in the text so we need to replace the \n with a carruage return
          // using the syntax response.data[0].HomeText.replace(/\\n/g, '\n')
          localStorage.setItem('HomeTitle', response.HomeTitle);
          // count the number of carruage returns in the text
          var txt: string = response.HomeText;
            const matches = txt.match(/\n/g);
            console.log(matches ? matches.length : 0);
          // in order to insert a line break inside a div we need to replace the carruage return with a <br>
          // except that in the typography component we need to replace the <br> is being displayed and so that is not working.
          // so we need to replace the carruage return with a <br> in the typography component
          
          localStorage.setItem('HomeText', txt);//.replace(/(\r\n|\r|\n)/g, '\r\n'));
          
          // if (typeof(response.data[0].HomeText) === 'string') {
          // } else {
          //   console.log(typeof(response.data[0].HomeText));
          // }
//          console.log(response.data[0].HomeText.match(/\\n/g).length);
          //console.log(response.data[0].HomeText);
          localStorage.setItem('AboutTitle', response.AboutTitle);
          localStorage.setItem('AboutText', response.AboutText.replace(/\\n/g, '\n'));
          localStorage.setItem('ArchiveTitle', response.ArchiveTitle);
          localStorage.setItem('ArchiveText', response.ArchiveText.replace(/\\n/g, '\n'));
          localStorage.setItem('NoticesTitle', response.NoticesTitle);
          localStorage.setItem('NoticesText', response.NoticesText.replace(/\\n/g, '\n'));
          localStorage.setItem('BookingTitle', response.BookingTitle);
          localStorage.setItem('BookingText', response.BookingText.replace(/\\n/g, '\n'));
          localStorage.setItem('MembersTitle', response.MembersTitle);
          localStorage.setItem('MembersText', response.MembersText.replace(/\\n/g, '\n'));
          localStorage.setItem('AppealTitle', response.AppealTitle);
          localStorage.setItem('AppealText', response.AppealText.replace(/\\n/g, '\n'));
          localStorage.setItem('SettingsTitle', response.SettingsTitle);
          localStorage.setItem('SettingsText', response.SettingsText.replace(/\\n/g, '\n'));
        }
        )
        .catch((error) => {
          console.log(error.response + " this is the error CWECWEAS")
        }
        )
  }




const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));



const [sidebar, setSidebar] = React.useState(false);
//const showSidebar = () => setSidebar(!sidebar);
const [menuName, setMenuName] = React.useState([
  { EntName: 'Home', type: 'page', icon: <HomeIcon />, link: '/home' },
  { EntName: 'About', type: 'page', icon: <InfoIcon />, link: '/About' },
  { EntName: 'Archive', type: 'page', icon: <AutoStoriesIcon />, link: '/Archive' },
  { EntName: 'Notices', type: 'page', icon: <CampaignIcon />, link: '/Notices' },
  { EntName: 'Booking', type: 'page', icon: <CalendarMonthIcon />, link: '/BookingForm' },
  { EntName: 'Members', type: 'page', icon: <GroupsIcon />, link: '/Members' },
  { EntName: 'Appeal', type: 'page', icon: <PersonAddAlt1Icon />, link: '/appeal' },
  { EntName: 'Admin', type: 'page', icon: <SettingsIcon />, link: '/Settings' },
]);
// update the button background color to yellow

const theme = useTheme();
const [open, setOpen] = React.useState(false);
const handleDrawerOpen = () => {
  setOpen(true);
};
//set the background image to an empty file object
const [Image, setImage] = React.useState("");
const handleDrawerClose = () => {
  setOpen(false);
};
// A menuitem is a single entry in the menu, e.g. Home, Planning, Students, etc.
interface menuItem { EntName: string, type: string, icon: any, link: string }
// a menutype contains a name and an array of menuitems
interface menuType { menuName: string, arrMenu: Array<menuItem> }
// the main menu object contains an array of menutypes
interface MenuObj {
  mainMenuListArr: Array<menuType>;
}
// create the main menu object
const mainMenuListArr: MenuObj = {
  mainMenuListArr: [
    {
      menuName: 'Main', arrMenu: [
        { EntName: 'Home', type: 'page', icon: <HomeIcon />, link: '/home' },
        { EntName: 'Archive', type: 'page', icon: <LightbulbIcon />, link: '/planning' },
        { EntName: 'Notices', type: 'page', icon: <MailIcon />, link: '/students' },
        { EntName: 'Appeal', type: 'page', icon: <TrendingUpIcon />, link: '/data' },
        { EntName: 'Calendar', type: 'page', icon: <CalendarMonthIcon />, link: '/calendar' },
        { EntName: 'Tasks', type: 'page', icon: <PlaylistAddCheckIcon />, link: '/tasks' },
        { EntName: 'SkillsOptions', type: 'menu', icon: <ThumbsUpDownOutlinedIcon />, link: 'SkillsOptions' },
        { EntName: 'Upcoming', type: 'page', icon: <EmojiPeopleIcon />, link: '/Notices' },
        // clicking on settings should replace the list of modules with a list of settings options
        { EntName: 'Settings', type: 'menu', icon: <SettingsIcon />, link: 'Settings' }
      ],
    }
  ]
}



// let activeStyle = {
//   textDecoration: "underline",
// };

// let activeClassName = "underline";

const navigate = useNavigate();

// This is the function that will be called when a menu item is clicked.
// Using the name that is passed it will either set the menuName state or call the page using the router.
const clickListener = (mItem: menuItem) => {
  if (mItem.type === 'menu') {
    // use the router to navigate to the page that is passed in the link property
    // retrieve the arrMenu array from the mainMenuListArr object that matches the menuName
    // console.log('navigate to ' + mItem.link);
    for (let i = 0; i < mainMenuListArr.mainMenuListArr.length; i++) {
      if (mainMenuListArr.mainMenuListArr[i].menuName === mItem.link) {
        // set the menuName state to the name of the menu item that was clicked
        //console.log(mainMenuListArr.mainMenuListArr[i].arrMenu);
        // setMenuName(mainMenuListArr.mainMenuListArr[i].arrMenu);
        break;
      }
    }
  } else {
    console.log('navigate to ' + mItem.link);
    navigate(mItem.link);
  }
}
//console.log("HERE "+require.resolve('fs'))
return (
  <ThemeProvider theme={theme2} >
    {/* add the musical background.png to the Box */}
    <Box sx={{
      display: 'flex',
      backgroundImage: `url(${Image})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100vw',
    }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Grid container spacing={0} columns={16}>
            <Grid item xs="auto" alignItems="center">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="left" alignItems="center">
              <Typography variant="h6" noWrap component="div">
                The Royal Wolverhampton NHS Trust Staff Choir
              </Typography>
            </Grid>
            <Grid item xs="auto" justifyContent="right" alignItems="center">
              {/* <body dir='rtl'> */}
              {/* </body> */}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent"
        open={open}
        onKeyDown={handleDrawerClose}
        onClick={handleDrawerClose}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {/* I dont know what the nav c tag does?
                   */}
        <List>
          {/* Add the items from the array that has been selected */}
          {menuName ? menuName.map((text) => (
            // pass the menuitem object to the click listener
            <ListItem key={text.EntName} onClick={() => clickListener(text)}>
              <ListItemIcon>
                {text.icon}
              </ListItemIcon>
              <ListItemText primary={text.EntName} sx={{ opacity: open ? 1 : 0 }} />
            </ListItem>
          )) : null}
        </List>
      </Drawer>
      <Box component="span" sx={{ p: 10, pt: 15, flexBasis: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  </ThemeProvider>
);
}
function imageURL(imagename: string): string {
  //
  // urlencode the filename
  // var filename = encodeURIComponent(imagename)
  // console.log("filename: " + filename)
 var filename = `http://localhost:3001/images/${imagename}`
  console.log("filename: aDASASCC " + filename)
  return filename
}



