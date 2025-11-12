import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Sidedrawer from './components/Sidebar.tsx'


const router = createBrowserRouter([
 {
 element: <Sidedrawer />,
 children: [
 { path: "/", element: <App /> },
 { path: "/projects", element: <App /> },
 { path: "/d3", element: <div>d3 </div>},
 { path: "/aboutme", element: <div>aboutme</div> },
 { path: "*", element: <div>404</div> },
 ]}])



createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
