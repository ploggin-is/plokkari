"use client"
import Image from 'next/image';
import { useEffect, useState } from "react";
import './style.css';

const Statistics = () => {
    // const [increaseText, setIncreaseText] = useState("");
    // const [increased, setIncreased] = useState(true);
    const [kmCleaned, setKmCleaned] = useState(0);
    useEffect(() => {
      // TODO: get these values from the back end
      fetch('https://plokkari-api-service.azurewebsites.net//api/Trash/statistics')
        .then(res => res.json()).then( stat => {
          if (stat !== null) {
            // console.log("here")
            // console.log(stat['areaCleaned'])
            setKmCleaned(stat['areaCleaned'].toFixed(2))                
          }
        })
      // setKmCleaned(7)
    //   const percentage = 25;
  
    //   if (percentage >= 0) {
    //     setIncreaseText("&#x1F805; " + percentage + "%  ");
    //     setIncreased(true);
    //   } else {
    //     setIncreaseText("&#x1F807; " + -percentage + "%  ");
    //     setIncreased(false);
    //   }
    }, []);

  return (
    <div className="statistics-window">
      <div className="statistics-left">
        <h3>Trash picked</h3>
        <h2> {kmCleaned} km<sup>2</sup></h2>
      </div>
      <div className="statistics-right">
        <div className="statistics-image">
          <Image 
            alt="icleand"
            src="/iceland.png" 
            width={130} 
            height={90} />
        </div>
      </div>
      {/* <div className='statistics-down'>
        <p>
          <span 
            className={`statistics-change ${increased ? 'up' : 'down'}`} 
            dangerouslySetInnerHTML={{ __html: increaseText }}>
          </span> 
          since last week
        </p>
      </div> */}
    </div>
  );
};

export default Statistics;
