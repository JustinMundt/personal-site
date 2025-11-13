import { useState } from 'react'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Outlet, Link } from "react-router-dom";

const StyledList = styled(List)(({ theme }) => ({
          height: '100%',           // fill the drawer
          display: 'flex',
          flexDirection: 'column',  // stack items
          alignItems: 'center',     // optional: center horizontally too
          }));

const StyledListItem = styled(ListItem)(({ theme } ) => ({
    color:'red',
    padding:theme.spacing(2,4),
    size:theme.large,
 alignItems:'center',
}));


export default function Sidedrawer() {
    const [location, setLocation] = useState("")


const handleClick = (loc) => {
    setLocation(loc)
};


return (
        <Box>
        <Drawer variant="permanent" anchor="left">
            <StyledList>
                <StyledListItem>
                    <Button component={Link} to="/" variant='contained' onClick={() => handleClick("Home")}>Home</Button>
                </StyledListItem>
                <StyledListItem>
                    <Button component={Link} to="/projects" variant='contained' onClick={() => handleClick("Projects")}>Projects</Button>
                </StyledListItem>
                <StyledListItem>
                    <Button component={Link} to="/aboutme" variant='contained' onClick={() => handleClick("About Me")}>About Me</Button>
                </StyledListItem>
                <StyledListItem>
                    <Button component={Link} to="/d3" variant='contained' onClick={() => handleClick("D3")}>D3</Button>
                </StyledListItem>
            </StyledList>
        <div>{location}</div>
        </Drawer>
            <Box>
                <Outlet />
            </Box>
        </Box>
    )
    }


