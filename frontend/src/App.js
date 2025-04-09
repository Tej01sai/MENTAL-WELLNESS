import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Results from './pages/Results';
import Chat from './components/Chat';

// Define your routes
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <Outlet />
      </>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'analyze', element: <Analysis /> },
      { path: 'results', element: <Results /> },
      { path: 'chat', element: <Chat /> }, // ✅ Chat.js is used here
    ],
  },
], {
  future: {
    v7_startTransition: true, // Opt into v7 startTransition behavior
    v7_relativeSplatPath: true, // Opt into v7 relative splat path behavior
  },
});

// App component
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
