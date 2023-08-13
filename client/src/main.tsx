import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Login from './Login.tsx';

const router = createBrowserRouter([{
  path: "/",
  element: <Login />,
}, {
  path: "/api",
  element: <Login />,
},
{
  path: "/api/login",
  element: <Login />,
},

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
