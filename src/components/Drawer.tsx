import React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
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
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import InfoIcon from '@mui/icons-material/Info';
import { Outlet, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import SettingsIcon from '@mui/icons-material/Settings';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CampaignIcon from '@mui/icons-material/Campaign';


const MiniDrawer = () => {
  const drawerWidth = 240;


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

  const [menuName, setMenuName] = React.useState([
    { EntName: 'Home', type: 'page', icon: <HomeIcon />, link: '/Home' },
    { EntName: 'About', type: 'page', icon: <InfoIcon />, link: '/About' },
    { EntName: 'Archive', type: 'page', icon: <AutoStoriesIcon />, link: '/Archive' },
    { EntName: 'Notices', type: 'page', icon: <CampaignIcon />, link: '/Notices' },
    { EntName: 'Booking', type: 'page', icon: <CalendarMonthIcon />, link: '/BookingForm' },
    { EntName: 'Appeal', type: 'page', icon: <PersonAddAlt1Icon />, link: '/appeal' },
    { EntName: 'Members', type: 'page', icon: <GroupsIcon />, link: '/Members' },
    { EntName: 'Admin', type: 'page', icon: <SettingsIcon />, link: '/Settings' },
  ]);
  // update the button background color to yellow

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  //set the background image to an empty file object
  const handleDrawerClose = () => {
    setOpen(false);
  };
  // A menuitem is a single entry in the menu, e.g. Home, Planning, Students, etc.
  interface menuItem { EntName: string, type: string, icon: any, link: string }
  // a menutype contains a name and an array of menuitems
  interface menuType { menuName: string, arrMenu: Array<menuItem> }
  

  const navigate = useNavigate();
  // This is the function that will be called when a menu item is clicked.
  // Using the name that is passed it will either set the menuName state or call the page using the router.
  const clickListener = (mItem: menuItem) => {
    //console.log('Menu item clicked:', mItem);
    if (mItem.type === 'menu') {
      for (let i = 0; i < menuName.length; i++) {
        if (menuName[i].link === mItem.link) {
          break;
        }
      }
    } else {
      //console.log('Navigating to:', mItem.link);
      navigate(mItem.link);
    }
  };
  return (
      <Box sx={{
        display: 'flex',
        backgroundImage: `url(${localStorage.getItem('BackgroundImage')})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat-y',
        alignContent: 'center',
        minWidth: '100vh',
        minHeight: '100vh', // Ensure the Box takes the full height of the viewport
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
              <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
                <Typography variant="h6" noWrap component="div">
                  The Royal Wolverhampton NHS Trust Staff Choir
                </Typography>
              </Grid>
              <Grid item xs="auto" justifyContent="flex-end" alignItems="center">
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
  );
};


export default MiniDrawer;

