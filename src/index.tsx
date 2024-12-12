import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';

import Home from './components/Home';
import BookingForm from './components/BookingForm';
import Notices from './components/Notices';
import Archive from './components/Archive';
import ErrorPage from './components/ErrorPage';
import Appeal from './components/Appeal';
import Settings from './components/Settings';
import Music from './components/Music';
import Members from './components/Members';
import AddMusic from './components/AddMusic';
import AddNotice from './components/AddNotice';
import EditAbout from './components/EditAbout';
import About from './components/About';
import EventAdd from './components/EventAdd';
import PlayListAdd from './components/PlaylistAdd';
import AddArchive from './components/AddArchive';
import AdminDashboard from './components/AdminDashboard';
import ViewMessages from './components/ViewMessages';
import MembersPage from './components/MembersPage';
import MiniDrawer from './components/Drawer';
import EditTheme from './components/EditTheme';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MiniDrawer />}>
          <Route index element={<Home />} />
          <Route path="Notices" element={<Notices />} />
          <Route path="Archive" element={<Archive />} />
          <Route path="Appeal" element={<Appeal />} />
          <Route path="About" element={<About />} />
          <Route path="BookingForm" element={<BookingForm />} />
          <Route path="Music" element={<Music />} />
          <Route path="Members" element={<Members />} />
          <Route path="AddMusic" element={<AddMusic />} />
          <Route path="AddNotice" element={<AddNotice />} />
          <Route path="EditAbout" element={<EditAbout />} />
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
    </BrowserRouter>
  </StrictMode>,
  rootElement
);