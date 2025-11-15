import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Sidedrawer from './components/Sidebar.tsx'
import Chart from './components/D3.tsx'
import Box from '@mui/material/Box';

const drawerWidth=250

const router = createBrowserRouter([
 {
 element: <Sidedrawer drawerWidth={drawerWidth} />,
 children: [
 { path: "/", element: <App /> },
 { path: "/projects", element: <App /> },
 { path: "/d3", element:  <Box sx={{width: '500vw', height: '100vh', ml:`${drawerWidth}px`}}>
  <Chart />
</Box>},
 { path: "/aboutme", element: <div>aboutme</div> },
 { path: "*", element: <div>404</div> },
 ]}])



createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
