import Image from 'next/image';
import './style.css';
import Statistics from '../(Statistics)/Statistics'


function MenuToolbar({ menuOpen, toggleMenu }) {
  return (
    <div className={`menutoolbar ${menuOpen ? 'open' : ''}`}>
      <h1>Menu</h1>
      <button className="close-button" onClick={toggleMenu}>
        x
      </button>
      <ul>
        <button 
          onClick={() => window.open('https://www.ploggin.is', "_blank", "noreferrer")} >
          <li> 
            <Image 
              alt="About Icon"
              src="/(icons)/about.svg" 
              width={40} 
              height={40} />
               About Us
          </li>
        </button>
        {/* <button 
          onClick= {() => alert("Show events")}>
          <li> <Image src="/(icons)/events.svg" width={30} height={20} /> Events</li>
        </button>
        <button 
          onClick= {() => alert("Show Statistics")}>
          <li> <Image src="/(icons)/statistics.svg" width={30} height={20} /> Statistics</li>
        </button> */}
      </ul>
      <Statistics />
      <div style={{ position: 'absolute', bottom: '65px', left: '50px' }}>
        <Image 
          alt="Contact Icon"
          src="/RU_logo.png" 
          width={200} 
          height={200} 
          />
      </div>
      <div className='contact-card'>
        <h2>Contact: <span  style={{ color:'green', fontStyle: 'italic' }}> hello@ploggin.is</span></h2>
      </div>
      {/* <button className="settings-button"
          onClick= {() => alert("Open Settings")}>
          <li> <Image src="/(icons)/settings.svg" width={30} height={20} /> Settings</li>
      </button> */}
    </div>
  );
}

export default MenuToolbar;
