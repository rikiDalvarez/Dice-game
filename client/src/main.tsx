import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Registration from './RegistrationForm.tsx';
import { UserContextProvider } from './context/UserContext.tsx';
import App from './App.tsx';
import RegisterForm from "./components/RegisterTest.tsx"



const router = createBrowserRouter([{
  path: "/",
  element: <App />,
}, {
  path: "/api",
  element: <App />,
},
{
  path: "/login",
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
  path: "/registerform",
  element: <RegisterForm />
},

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </React.StrictMode>,
)
