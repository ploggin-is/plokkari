"use client"
import { AppBar, Box, Drawer, Paper, SwipeableDrawer, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import { makeStyles } from '@mui/styles';
import OpenStreetMap from '../(OpenStreetMap)/OpenStreetMap'
import ListIcon from '@mui/icons-material/List';
import { useState, useEffect } from 'react';
import Image from 'next/image';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Button } from '@mui/base';

const MainPage = () => 
{

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [increaseText, setIncreaseText] = useState("");
  const [increased, setIncreased] = useState(true);
  const [kmCleaned, setKmCleaned] = useState(0);
  useEffect(() => {
    // TODO: get these values from the back end
    setKmCleaned(10)
    const percentage = 25;

    if (percentage >= 0) {
      setIncreaseText("&#x1F805; " + percentage + "%  ");
      setIncreased(true);
    } else {
      setIncreaseText("&#x1F807; " + -percentage + "%  ");
      setIncreased(false);
    }
  }, []);

  return (
    <main>
      {/* <TopToolbar></TopToolbar>  */}
      <AppBar sx={{height:'45px', color:'black', backgroundColor:'transparent', padding:'auto', backdropFilter:'blur(5px)'}} >
        <ListIcon onClick={()=>{setDrawerOpen(true)}} sx={{height: '100%', marginLeft: '10px'}}/>
      </AppBar>
      <SwipeableDrawer 
        PaperProps={{sx: {p:2, minWidth: '300px', opacity: '1', backgroundColor:"AliceBlue", backdropFilter:'blur(5px)'}}} 
        sx={{zIndex:'9999'}} 
        onClose={()=>{setDrawerOpen(false)}} 
        open={drawerOpen}>
        
        <Button 
          style={{p: 2, display: 'flex', alignItems: 'center', verticalAlign: "middle", flexWrap:'wrap', backgroundColor:"#b0f9c2", padding:10}} 
          onClick={() => window.open('https://www.ploggin.is', "_blank", "noreferrer")}
          >
          {/* <InfoOutlinedIcon sx={{marginRight: '10px'}}  /> */}
          <Image 
            src="/ploggin_logo.jpg" 
            style={{opacity: '1', marginRight:20}}
            width={50} 
            height={50} 
            />
          <Typography sx={{fontWeight:'bold', fontSize:'18pt'}}>About us</Typography>
        </Button>
        
        {/* <Statistics /> */}
        <Card sx={{ display: 'flex', marginTop:5, alignItems: 'center'}}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography component="div" variant="h6">
                Trash picked
              </Typography>
              <Typography component="div" variant="h4" sx={{fontWeight: 'bold'}}>
                {kmCleaned} km<sup>2</sup>
              </Typography>
              

            
            <p style={{marginLeft:5, fontSize:12, textColor:"gray"}}>
              <span 
                // className={`statistics-change ${increased ? 'up' : 'down'}`} 
                style={{
                  color: increased ? '#0F0' : '#F00',
                  fontWeight: "bold",
                  fontSize:18,
                  textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}
                dangerouslySetInnerHTML={{ __html: increaseText }}
                >
              </span> 
              since last week
            </p>
            </CardContent>
          </Box>
          <CardMedia
            component="img"
            sx={{ width: 100, height: 80, justifyContent:'center' }}
            image="/iceland.png"
          />

        </Card>

        <div style={{ position: 'absolute', bottom: '65px', left: '50px' }}>
          <Image 
            src="/RU_logo.png" 
            style={{opacity: '1'}}
            width={200} 
            height={200} 
            />
      </div>
      </SwipeableDrawer>

      {/* <CleanButton changeCleanButton={ isPressed => setIsPressed(isPressed)} isPressed={isPressed}/> */}
      <div className="map-container" style={{position: 'relative'}}>
        <OpenStreetMap/>
        {/* <StartButton /> */}
      </div>
    </main>
  );
};
export default MainPage;