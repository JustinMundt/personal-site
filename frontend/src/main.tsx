import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Sidedrawer from './components/Sidebar.tsx'
import Chart from './components/D3.tsx'


const router = createBrowserRouter([
 {
 element: <Sidedrawer />,
 children: [
 { path: "/", element: <App /> },
 { path: "/projects", element: <App /> },
 { path: "/d3", element: <div style={{ width: '50%', height: '3000px' }}>
  <Chart />
</div>},
 { path: "/aboutme", element: <div>aboutme</div> },
 { path: "*", element: <div>404</div> },
 ]}])



createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
