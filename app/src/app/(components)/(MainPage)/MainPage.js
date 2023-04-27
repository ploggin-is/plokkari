"use client"
import { AppBar, Box, Drawer, Paper, Typography } from '@mui/material';
// import { makeStyles } from '@mui/styles';
import OpenStreetMap from '../(OpenStreetMap)/OpenStreetMap'
import TopToolbar from '../(TopToolbar)/TopToolbar'
import ListIcon from '@mui/icons-material/List';
import { useState } from 'react';
import Image from 'next/image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Button } from '@mui/base';
import Statistics from '../(Statistics)/Statistics';

const MainPage = () => 
{

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main>
      {/* <TopToolbar></TopToolbar>  */}
      <AppBar sx={{height:'45px', color:'black', backgroundColor:'transparent', padding:'auto', backdropFilter:'blur(5px)'}} >
        <ListIcon onClick={()=>{setDrawerOpen(true)}} sx={{height: '100%', marginLeft: '10px'}}/>
      </AppBar>
      <Drawer  PaperProps={{sx: {p:2, minWidth: '300px', opacity: '1', backgroundColor:"azure", backdropFilter:'blur(5px)'}}} sx={{zIndex:'999999999'}} onClose={()=>{setDrawerOpen(false)}} open={drawerOpen}>
        
        <Button sx={{p: 2, display: 'flex', alignItems: 'center', flexWrap:'wrap'}} onClick={() => window.open('https://www.ploggin.is', "_blank", "noreferrer")}>
          <InfoOutlinedIcon sx={{marginRight: '10px'}}  />
          <Typography>About us</Typography>
        </Button>
        
        {/* <Statistics /> */}

        <div style={{ position: 'absolute', bottom: '65px', left: '50px' }}>
          <Image 
            src="/RU_logo.png" 
            style={{opacity: '1'}}
            width={200} 
            height={200} 
            />
      </div>
      </Drawer>

      {/* <CleanButton changeCleanButton={ isPressed => setIsPressed(isPressed)} isPressed={isPressed}/> */}
      <div className="map-container" style={{position: 'relative'}}>
        <OpenStreetMap zoomLvl={13} />
        {/* <StartButton /> */}
      </div>
    </main>
  );
};
export default MainPage;