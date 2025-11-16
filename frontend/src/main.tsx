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
import { styled } from '@mui/material/styles';

const drawerWidth=180

const ChartContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  width: `calc(100vw - ${drawerWidth}px)`,
  overflowY: 'hidden',
  overflowX: 'hidden',
border: '2px solid red', 
}));

const router = createBrowserRouter([

 {
 element: <Sidedrawer drawerWidth={drawerWidth} />,
 children: [
 { path: "/", element: <App /> },
 { path: "/projects", element: <App /> },
 { path: "/d3", element:  <ChartContainer>
            <Box
              sx={{
                overflowX: 'auto',
                minHeight: 200,
                backgroundColor: 'rgba(0, 250, 255, 0.15)',
              }}
            >
  <Chart />
  </Box>
</ChartContainer>},
 { path: "/aboutme", element: <div>aboutme</div> },
 { path: "*", element: <div>404</div> },
 ]}])



createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
