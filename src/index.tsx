import React from 'react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import MiniDrawer from '../src/components/Drawer';
import Home from '../src/components/Home';
import BookingForm from '../src/components/BookingForm';
import Notices from '../src/components/Notices';
import Archive from '../src/components/Archive';
import ErrorPage from '../src/components/ErrorPage';
import Appeal from '../src/components/Appeal';
import Settings from '../src/components/Settings';
import Music from '../src/components/Music';
import Members from '../src/components/Members';
import AddMusic from '../src/components/AddMusic';
import AddNotice from '../src/components/AddNotice';
import EditAbout from '../src/components/EditAbout';
import About from '../src/components/About';
import EventAdd from '../src/components/EventAdd';
import PlayListAdd from '../src/components/playlistAdd';
import AddArchive from '../src/components/AddArchive';
import EditTheme from './components/editTheme'; 
import AdminDashboard from './components/AdminDashboard';
import ViewMessages from './components/ViewMessages';
import MembersPage from './components/MembersPage';
// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBs8J9i9EVXedPuEFMfkmq_KIIL_InZrr0",
  authDomain: "rwttest-c4005.firebaseapp.com",
  projectId: "rwttest-c4005",
  storageBucket: "rwttest-c4005.appspot.com",
  messagingSenderId: "763161592006",
  appId: "1:763161592006:web:4c05715c3f6d535763d7c7"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);

const router = createBrowserRouter([
  { path: "/", element: <MiniDrawer />, errorElement: <ErrorPage />,
    children: [
    { path: "/Notices", element: <Notices />, },
    { path: "/Archive", element: <Archive />, },
    { path: "/Appeal", element: <Appeal />, },
    { path: "/About", element: <About />,},
    { path: "/BookingForm", element: <BookingForm />, },
    { path: "/Home", element: <Home />, },
    { path: "/upload"},
    { path: "/files"},
    { path: "/Music", element: <Music />, },
    { path: "/Members", element: <Members />, },
    { path: "/AddMusic", element: <AddMusic />, },
    { path: "/AddNotice", element: <AddNotice />, },
    { path: "/EditAbout", element: <EditAbout />, }, 
    { path: "/EventAdd", element: <EventAdd />, }, 
    { path: "/PlayListAdd", element: <PlayListAdd />, }, 
    { path: "/AddArchive", element: <AddArchive />, },
    { path: "/EditTheme", element: <EditTheme />, },
    { path: "/", element: <Home />, },
    { path: "/Settings", element: <Settings />, },
    { path: "/AdminDashboard", element: <AdminDashboard />, },
    { path: "/ViewMessages", element: <ViewMessages />, },
    { path: "/MembersPage", element: <MembersPage />, },

    { path: "*", element: <ErrorPage />, },
  ],
},
  ]);

  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Failed to find the root element');
  const root = ReactDOM.createRoot(rootElement);  
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
