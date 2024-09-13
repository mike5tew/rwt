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


const router = createBrowserRouter([
  { path: "/", element: <MiniDrawer />, errorElement: <ErrorPage />,
    children: [{ path: "/Notices", element: <Notices />, },
    { path: "/Archive", element: <Archive />, },
    // { path: "/Upcoming", element: <Upcoming />, },
    { path: "/Appeal", element: <Appeal />, },
    { path: "/About", element: <About />,},
    { path: "/BookingForm", element: <BookingForm />, },
    { path: "/Home", element: <Home />, },
    { path: "/Music", element: <Music />, },
    { path: "/Members", element: <Members />, },
    { path: "/AddMusic", element: <AddMusic />, },
    { path: "/AddNotice", element: <AddNotice />, },
    { path: "/EditAbout", element: <EditAbout />, }, 
    { path: "/", element: <Home />, },
    { path: "/Settings", element: <Settings />, },

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
