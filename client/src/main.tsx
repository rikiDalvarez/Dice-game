import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Login from './Login.tsx';
import Dashboard from './Dashboard.tsx';
import { UserContextProvider } from './context/UserContext.tsx';


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
{
  path: "/dashboard",
  element: <Dashboard />
}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </React.StrictMode>,
)
