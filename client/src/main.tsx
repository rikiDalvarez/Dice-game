// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";
// import './index.css'
// import { UserContextProvider } from './context/UserContext.tsx';
// import App from './App.tsx';
// import RegisterForm from "./components/RegisterTest.tsx"


// const router = createBrowserRouter([{
//   path: "/",
//   element: <App />,
// }, {
//   path: "/api",
//   element: <App />,
// },
// {
//   path: "/login",
//   element: <App />,
// },
// {
//   path: "/api/login",
//   element: <App />,
// },
// {
//   path: "/api/players",
//   element: <RegisterForm />,
// }]);

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <UserContextProvider>
//       <RouterProvider router={router} />
//     </UserContextProvider>
//   </React.StrictMode>,
// )
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Use BrowserRouter, Routes, and Route
import './index.css';
import { UserContextProvider } from './context/UserContext';
import App from './App';
import RegisterForm from './components/RegisterTest';

// eslint-disable-next-line react-refresh/only-export-components
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/api" element={<App />} />
    <Route path="/login" element={<App />} />
    <Route path="/api/login" element={<App />} />
    <Route path="/dashboard" element={<App />} />
    <Route path="/api/players" element={<RegisterForm />} />
  </Routes>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserContextProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserContextProvider>
  </React.StrictMode>
);
