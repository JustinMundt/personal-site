import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import Button from '@mui/material/Button'

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

return (
        <Drawer variant="permanent" anchor="left">
            <StyledList>
                <StyledListItem>
                    <Button variant='contained'>Home</Button>
                </StyledListItem>
                <StyledListItem>
                    <Button variant='contained'>Projects</Button>
                </StyledListItem>
            </StyledList>
        </Drawer>
    )
    }


