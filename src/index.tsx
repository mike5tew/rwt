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


const router = createBrowserRouter([
  { path: "/", element: <MiniDrawer />, errorElement: <ErrorPage />,
    children: [{ path: "/Notices", element: <Notices />, },
    { path: "/Archive", element: <Archive />, },
    // { path: "/Upcoming", element: <Upcoming />, },
    { path: "/Appeal", element: <Appeal />, },
    { path: "/BookingForm", element: <BookingForm />, },
    { path: "/Home", element: <Home />, },

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
