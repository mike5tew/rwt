import React, { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import Home from './components/Home';
import BookingForm from './components/BookingForm';
import Notices from './components/Notices';
import Archive from './components/Archive';
import ErrorPage from './components/ErrorPage';
import Appeal from './components/Appeal';
import Settings from './components/Settings';
import Members from './components/Members';
import Music from './components/Music';
import AddMusic from './components/AddMusic';
import AddNotice from './components/AddNotice';
import EditAbout from './components/EditAbout';
import About from './components/About';
import EventAdd from './components/EventAdd';
import PlayListAdd from './components/PlaylistAdd';
import AddArchive from './components/AddArchive';
import AdminDashboard from './components/AdminDashboard';
import AllImages from './components/AllImages';
import ViewMessages from './components/ViewMessages';
import MembersPage from './components/MembersPage';
import MiniDrawer from './components/Drawer';
import EditTheme from './components/EditTheme';
import { getScreenSize, ThemeDetails } from 'src/types/types';
import { SiteInfoGET, themeDetailsGET } from './services/queries';
import MeetTheTeam from './components/MeetTheTeam';
import TeamAdd from './components/TeamAdd';

/**
 * Main application component that handles theme management and routing
 * Fetches site information and theme details on mount
 * Provides theme context to all child components
 */
export default function App() {
  const [themeDetails, setThemeDetails] = useState<ThemeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  // establish if the screen is a mobile device
  function getScreenSize() {
    var screen = "mobile"; 
    if (window.innerWidth > 600) {
      screen = "desktop";
    }
    return screen;
  }


  /**
   * Fetches site information and theme details from the server
   * Stores site information in localStorage for global access
   * Updates theme details state for dynamic theme generation
   */
  useEffect(() => {
    const fetchThemeDetails = async () => {
      try {
        const siteInfoRes = await SiteInfoGET();
        if (siteInfoRes) {
          localStorage.setItem('screenSize', getScreenSize());
          console.log("Site info fetched:", siteInfoRes);
          localStorage.setItem('HomeTitle', siteInfoRes.HomeTitle);
          localStorage.setItem('HomeText', siteInfoRes.HomeText);
          localStorage.setItem('AboutTitle', siteInfoRes.AboutTitle);
          localStorage.setItem('AboutText', siteInfoRes.AboutText);
          localStorage.setItem('ArchiveTitle', siteInfoRes.ArchiveTitle);
          localStorage.setItem('ArchiveText', siteInfoRes.ArchiveText);
          localStorage.setItem('NoticesTitle', siteInfoRes.NoticesTitle);
          localStorage.setItem('NoticesText', siteInfoRes.NoticesText);
          localStorage.setItem('BookingTitle', siteInfoRes.BookingTitle);
          localStorage.setItem('BookingText', siteInfoRes.BookingText);
          localStorage.setItem('MembersTitle', siteInfoRes.MembersTitle);
          localStorage.setItem('MembersText', siteInfoRes.MembersText);
          localStorage.setItem('AppealTitle', siteInfoRes.AppealTitle);
          localStorage.setItem('AppealText', siteInfoRes.AppealText);
          localStorage.setItem('SettingsTitle', siteInfoRes.SettingsTitle);
          localStorage.setItem('SettingsText', siteInfoRes.SettingsText);
        } else {
          console.log("No site info found");
        }

        const themeRes = await themeDetailsGET();
        if (themeRes) {
          //urlencode the image path to avoid issues with spaces in the path
          const bgImg = `${process.env.REACT_APP_API_URL}/${themeRes.BackgroundImage}`;
          // console.log("Setting background image to:", bgImg);
          localStorage.setItem('BackgroundImage', bgImg);
          // is the screensize a mobile device?
          if (getScreenSize() === "mobile") {
            // we take the font size and divide it by 2
            themeRes.TextSize = themeRes.TextSize / 2;
          }
          setThemeDetails(themeRes);
        } else {
          console.log("No theme details found");
        }
      } catch (error) {
        console.error("Error fetching theme details or site info:", error);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    fetchThemeDetails();
  }, []);

  /**
   * Generates MUI theme based on user preferences
   * Applies custom colors, typography, and component styles
   * Memoized to prevent unnecessary recalculations
   */
  const theme = React.useMemo(() => {
    if (!themeDetails) {
      console.log("Using default theme");
      return createTheme();
    }

    return createTheme({
      components: {
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: themeDetails.MenuColour || '#fff',
              color: themeDetails.MenuTextColour || '#000',
              '& .MuiListItemIcon-root': {
                color: themeDetails.MenuTextColour || '#000',
              },
              '& .MuiDivider-root': {
                borderColor: themeDetails.MenuTextColour || 'rgba(0, 0, 0, 0.12)',
              },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: themeDetails.BannerColour,
              color: themeDetails.MenuTextColour,
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              color: themeDetails.ButtonTextColour,
              backgroundColor: themeDetails.ButtonColour,
              '&:hover': {
                backgroundColor: themeDetails.ButtonHover,
              },
            },
          },
        },
        MuiFilledInput: {
          styleOverrides: {
            root: {
              backgroundColor: themeDetails.TextboxColour,
              '&:hover': {
                backgroundColor: themeDetails.TextboxColour,
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: themeDetails.BoxColour,
            },
          },
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              color: themeDetails.TextColour,
              backgroundColor: themeDetails.TextboxColour,
              '&:hover': {
                backgroundColor: themeDetails.TextboxColour,
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              color: themeDetails.TextColour,
              backgroundColor: themeDetails.TextboxColour,
            },
          },
        },
      },
      // The font size is retrieved from the db but needs to be adjusted for mobile devices
      typography: {
        fontFamily: themeDetails.TextFont,
        fontSize: themeDetails.TextSize, // Base font size in pixels
        h2: {
          textAlign: 'center',
          padding: '10px',
          fontStyle: 'Bold',
          fontSize: `${(themeDetails.TextSize * 1.5) / 16}rem`,
        },
        h4: {
          textAlign: 'center',
          padding: '10px',
          fontStyle: 'Bold',
          fontSize: `${(themeDetails.TextSize * 1.25) / 16}rem`,
        },
        body1: {
          fontFamily: themeDetails.TextFont,
          textAlign: 'center',
          padding: '10px',
          fontSize: `${themeDetails.TextSize / 16}rem`,
        },
      },
    });
  }, [themeDetails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route element={<MiniDrawer />}>
          <Route path="/" element={<Home />} />
          <Route path="Home" element={<Home />} />
          <Route path="Notices" element={<Notices />} />
          <Route path="Archive" element={<Archive />} />
          <Route path="Appeal" element={<Appeal />} />
          <Route path="About" element={<About />} />
          <Route path="BookingForm" element={<BookingForm />} />
          <Route path="Members" element={<Members />} />
          <Route path="AddMusic" element={<AddMusic />} />
          <Route path="AddNotice" element={<AddNotice />} />
          <Route path="EditAbout" element={<EditAbout />} />
          <Route path="MeetTheTeam" element={<MeetTheTeam />} />
          <Route path="AllImages" element={<AllImages />} />
          <Route path="TeamAdd" element={<TeamAdd />} />
          <Route path="Music" element={<Music />} />
          <Route path="EventAdd" element={<EventAdd />} />
          <Route path="PlayListAdd" element={<PlayListAdd />} />
          <Route path="AddArchive" element={<AddArchive />} />
          <Route path="EditTheme" element={<EditTheme />} />
          <Route path="Settings" element={<Settings />} />
          <Route path="AdminDashboard" element={<AdminDashboard />} />
          <Route path="ViewMessages" element={<ViewMessages />} />
          <Route path="MembersPage" element={<MembersPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}


