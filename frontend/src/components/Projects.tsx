import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import {styled} from '@mui/material/styles'
import Chart from './D3.tsx'

const StyledCard = styled(Card)(({ theme }) => ({
color:"red",
  width: '300px',
  heigth: '200px',
  alightText: 'center',
  margin: '3rem',
  overflow: 'hidden',
}));

export default function Projects() {
  return <StyledCard component={Link} to="/world_population"><Card sx={{overflow: 'auto'}}><Chart/></Card></StyledCard>
}


