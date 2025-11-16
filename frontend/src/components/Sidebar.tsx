import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Outlet, Link } from 'react-router-dom';

const StyledList = styled(List)(({ theme }) => ({
  alignItems: 'center',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  color: 'red',
  alignItems: 'center',
}));

export default function Sidedrawer({ drawerWidth }: { drawerWidth: number }) {
  const [location, setLocation] = useState('');

  const handleClick = (loc: string) => {
    setLocation(loc);
  };

  return (
    <Box sx={{ display: 'flex'}}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <StyledList>
          <StyledListItem>
            <Button
              component={Link}
              to="/"
              variant="contained"
              onClick={() => handleClick('Home')}
            >
              Home
            </Button>
          </StyledListItem>
          <StyledListItem>
            <Button
              component={Link}
              to="/projects"
              variant="contained"
              onClick={() => handleClick('Projects')}
            >
              Projects
            </Button>
          </StyledListItem>
          <StyledListItem>
            <Button
              component={Link}
              to="/aboutme"
              variant="contained"
              onClick={() => handleClick('About Me')}
            >
              About Me
            </Button>
          </StyledListItem>
          <StyledListItem>
            <Button
              component={Link}
              to="/d3"
              variant="contained"
              onClick={() => handleClick('D3')}
            >
              D3
            </Button>
          </StyledListItem>
        </StyledList>
        <div>{location}</div>
      </Drawer>

      {/* MAIN AREA */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

