import React, { useEffect, useState } from 'react';
import EvidenceImage from '../assets/events/evidence.png';
import PanafricaImage from '../assets/events/panafrica.png';
import GamingImage from '../assets/events/gaming.png';
import WaterImage from '../assets/events/water.png';
import SolarImage from '../assets/events/solar.png';
import DataImage from '../assets/events/data.png';
import SharedvalueImage from '../assets/events/sharedvalue.png';
import SoftwareImage from '../assets/events/software.png';
import Banner1Image from '../assets/events/wedding.png'; // New banner
import Banner2Image from '../assets/events/outdoor.png'; // New banner
import Banner3Image from '../assets/events/conference.png'; // Existing banner
import Banner4Image from '../assets/events/events.png'; // Existing banner

import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [data, setData] = useState([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(() => {
            setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 10000); // Change banner every minute

        return () => clearInterval(intervalId);
    }, []);

    const banners = [Banner1Image, Banner2Image, Banner3Image, Banner4Image]; // All banners

    const fetchData = async () => {
        // Simulating fetching data from the backend
        const items = [
            { name: 'Africa Evidence Summit', image: EvidenceImage, width: '1000px', height: '600px' },
            { name: 'Panafrica Summit', image: PanafricaImage, width: '880px', height: '170px' },
            { name: 'Gaming Tech Summit', image: GamingImage, width: '880px', height: '170px' },
            { name: 'Global Water Summit', image: WaterImage, width: '920px', height: '160px' },
            { name: 'SDS Data Summit', image: DataImage, width: '720px', height: '200px' },
            { name: 'Software Summit', image: SoftwareImage, width: '840px', height: '140px' },
            { name: 'Solar Expo', image: SolarImage, width: '1080px', height: '190px' },
            { name: 'Shared Value Summit', image: SharedvalueImage, width: '960px', height: '160px' }
        ];
        
        setData(items);
    };

    const navigate = useNavigate();
    const handleClick = (destination) => {
        navigate(destination);
    };

    // Calculate the width and height of each image container
    const containerWidth = `calc((100% - (4 - 1) * 14px) / 0.87)`;

    const containerHeight = `calc((90vh - (2 - 1) * 14px) / 2)`;

    return (
        <div>
            {/* Header Row with Background Image */}
            <div style={{ height: '50vh', width: '100%', backgroundImage: `url(${banners[currentBannerIndex]})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', margin: '0', padding: '0' }}>
                {/* Add any content for the header row if needed */}
            </div>

            {/* Product Grid */}
            <div style={{ display: 'flex', justifyContent: 'left', height: '90vh', marginTop: '0', paddingTop: '0' }}>
                <div style={{ width: '17%', height: '100%', padding: '20px', backgroundColor: 'turquoise', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button className="btn btn-success" style={{ width: '100%', marginBottom: '20px' }}>Upcoming Events</button>
                    <div>
                        {data.map((item, index) => (
                            <h6 key={index} className="" style={{ width: '100%',borderBottom: "1px solid #008080",height:"10px, marginBottom:2px", fontSize:'24px',textAlign:"start"}} onClick={() => handleClick(`/${item.name.toLowerCase()}`)}>{item.name}</h6>
                        ))}
                    </div>
                </div>

                <div style={{ width: '66%', backgroundColor: '#008080', height: '90vh', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '14px' }}>
                    {/* Items go here */}
                    {data.map((item, index) => (
                        <div key={index} style={{ backgroundColor: 'white', border: '1px solid black', width: containerWidth, height: containerHeight, padding: '10px' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        <button className="btn btn-success" style={{ width: '100%', marginTop: '-60px' }}>{item.name}</button>
                    </div>
                    
                    ))}
                </div>
                <div style={{ width: '17%', height: '100%', padding: '20px', backgroundColor: 'turquoise', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button className="btn btn-success" style={{ width: '100%', marginTop: '10px' }}>My Past Events</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
