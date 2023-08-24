import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Login from './Login.tsx';
import Registration from './RegistrationForm.tsx';
import Dashboard from './Dashboard.tsx';
import { UserContextProvider } from './context/UserContext.tsx';
import App from './App.tsx';
import Register from './components/RegisterTest.tsx';


const router = createBrowserRouter([{
  path: "/",
  element: <App />,
}, {
  path: "/api",
  element: <App />,
},
{
  path: "/api/login",
  element: <App />,
},

{
  path: "/api/players",
  element: <Registration />,
},
{
  path: "/dashboard",
  element: <Dashboard />
},
{
  path: "/api/players/",
  element: <Register />
}

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </React.StrictMode>,
)
