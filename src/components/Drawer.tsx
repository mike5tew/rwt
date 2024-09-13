import React from 'react';
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
// import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
//  import LoginStyle from 'LoginStyle';
const drawerWidth = 240;

// const theme = createTheme({
//   palette: {
//     primary: teal
//   },
//   typography: {
//     fontFamily: 'Montserrat',
//     fontWeightLight: 400,
//     fontWeightRegular: 500,
//     fontWeightMedium: 600,
//     fontWeightBold: 700,
//   }
// })


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

export default function MiniDrawer() {

  const [sidebar, setSidebar] = React.useState(false);
  //const showSidebar = () => setSidebar(!sidebar);
  const [menuName, setMenuName] = React.useState([
    { EntName: 'Home', type: 'page', icon: <HomeIcon />, link: '/home' },
    { EntName: 'About', type: 'page', icon: <InfoIcon />, link: '/About' },
    { EntName: 'Archive', type: 'page', icon: <AutoStoriesIcon />, link: '/Archive' },
    { EntName: 'Notices', type: 'page', icon: <CampaignIcon />, link: '/' },
    { EntName: 'Booking', type: 'page', icon: <CalendarMonthIcon />, link: '/BookingForm' },
    { EntName: 'Members', type: 'page', icon: <GroupsIcon />, link: '/Members' },
    { EntName: 'Appeal', type: 'page', icon: <PersonAddAlt1Icon />, link: '/appeal' },
    { EntName: 'Admin', type: 'page', icon: <SettingsIcon />, link: '/Settings' },
  ]);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
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
          { EntName: 'Notices', type: 'page', icon: <EmojiPeopleIcon />, link: '/notices' },
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
      console.log('navigate to ' + mItem.link);
      for (let i = 0; i < mainMenuListArr.mainMenuListArr.length; i++) {
        if (mainMenuListArr.mainMenuListArr[i].menuName === mItem.link) {
          // set the menuName state to the name of the menu item that was clicked
          console.log(mainMenuListArr.mainMenuListArr[i].arrMenu);
          // setMenuName(mainMenuListArr.mainMenuListArr[i].arrMenu);
          break;
        }
      }
    } else {
      console.log('navigate to ' + mItem.link);
      navigate(mItem.link);
    }
  }

  return (
    <ThemeProvider theme={theme} >
      <Box sx={{ display: 'flex' }}>
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

