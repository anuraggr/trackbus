import React from 'react';
import { useState, useEffect, useRef } from 'react';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; 
import busIcon from './assets/busicon-1.png'; 

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedBus, setSelectedBus] = useState('');
  const [busCoords, setBusCoords] = useState(null);
  const [busInfo, setBusInfo] = useState(null); 
  const [error, setError] = useState(''); 
  const mapRef = useRef(); // ref to map
  
  const [userLocation, setUserLocation] = useState(null);
  const [locationRequested, setLocationRequested] = useState(false);

  
  const busMarkerIcon = L.icon({
    iconUrl: busIcon,
    iconSize: [38, 38], 
    iconAnchor: [19, 38], 
    popupAnchor: [0, -38] 
  });


const getUserLocation = () => {
  if (navigator.geolocation) {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationRequested(true);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationRequested(true);
      }
    );

    // Optional: You can store this `watchId` in state if you want to later stop watching the position
    return watchId; 
  } else {
    console.error('Geolocation is not supported by this browser.');
    setLocationRequested(true);
  }
};



  const zoomToUserLocation = () => {
    if (mapRef.current && userLocation) {
    mapRef.current.setView([userLocation.lat, userLocation.lng], 17); // Adjust zoom level as needed
      }
    };
  

  const fetchCoordinates = () => {
    if (!selectedBus) return;

    fetch(`/api/firebase?busNumber=${selectedBus}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.latitude && data.longitude) {
          setBusCoords({
            lat: data.latitude,
            lng: data.longitude,
            accuracy: data.accuracy || 10,
          });
          setError(''); 

          if (mapRef.current) {
            mapRef.current.setView([data.latitude, data.longitude], 17); 
          }
        } else {
          setError('No data found for this bus');
          setBusCoords(null); 
        }
      })
      .catch((error) => {
        console.error('Error fetching coordinates:', error);
        setError('Failed to fetch coordinates');
      });
  };

  const fetchBusInfo = () => {
    if (selectedBus) {
      fetch('/busInfo.json')
        .then((response) => response.json())
        .then((data) => {
          if (data[selectedBus]) {
            setBusInfo(data[selectedBus]);
            setBusCoords(null); 
            setError(''); 
          } else {
            setError('No such bus found');
            setBusInfo(null); 
            setBusCoords(null);

            setTimeout(() => {
              setError('');
            }, 5000);
          }
        })
        .catch((error) => {
          console.error('Error fetching bus info:', error);
          setError('Failed to fetch bus info');
          setTimeout(() => {
            setError('');
          }, 5000);
        });
    }
  };

  useEffect(() => {
  if (!locationRequested) {
    getUserLocation(); // Only request if it hasn't been done yet
  }
}, [locationRequested]);

useEffect(() => {
  if (selectedBus) {
    fetchCoordinates(); 
    fetchBusInfo();
  }
}, [selectedBus]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchClick = () => {
    setSelectedBus(searchInput);
  };

  const handleRefreshClick = () => {
    fetchCoordinates(); 
  };

  const handleUserLoc = () => {
  if (!userLocation) {
    const watchId = getUserLocation(); // Starts continuous location tracking
    // You can store this watchId if needed to stop tracking later
  } else {
    zoomToUserLocation(); // If already available, just zoom to it
  }
};


  return (
    <div className="container">
      <div>
        <a href="https://www.sih.gov.in/" target="_blank">
          <img src={busIcon} className="logo bus" alt="Bus logo" />
        </a>
      </div>

      <h1>Bus Mitra</h1>

      <div className="main-content">
        <div className="left-side">
          <div className="search-container">
            <input
              id="busSearch"
              type="text"
              placeholder="Enter bus number"
              value={searchInput}
              onChange={handleSearchChange}
              className="search-bar"
            />
            <button onClick={handleSearchClick} className="search-button">Search</button>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {busCoords  && (
            <div style={{ height: '500px', width: '100%', position: 'relative' }}>
              <MapContainer
                center={[busCoords.lat, busCoords.lng]}
                zoom={17}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <Marker
                  position={[busCoords.lat, busCoords.lng]}
                  icon={busMarkerIcon}
                >
                  <Popup>
                    {`Bus is here: ${busCoords.lat}, ${busCoords.lng}`}
                  </Popup>
                </Marker>

                {/* Circle for User Location */}
                {userLocation && (
                  <Circle
                  center={[userLocation.lat, userLocation.lng]}
                  radius={5} // Adjust the radius as needed
                  pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0 }} // Blue circle
                  />
                )}

                
              </MapContainer>

              <button
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  zIndex: 1000
                }}
                onClick={handleRefreshClick}
              >
                Refresh
              </button>

              <button
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '7px',
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  zIndex: 1000
                }}
                onClick={handleUserLoc}
              >
                 Me
              </button>
            </div>
          )}
        </div>

        <div className="right-side">
          <h2>Bus Information</h2>
          {busInfo ? (
            <div className="bus-info card">
              <p><strong>Bus No:</strong> {busInfo.No}</p>
              <p><strong>From:</strong> {busInfo.From}</p>
              <p><strong>To:</strong> {busInfo.To}</p>
              <p><strong>Departure:</strong> {busInfo.Departure}</p>
              <p><strong>Bus Driver Contact:</strong> {busInfo.BusDriverContact}</p>

              <h2>Route Stops:</h2>
              <ul className="route-timeline">
  {busInfo.Route.map((stop, idx) => (
    <li key={idx} className="timeline-item">
      {idx !== 0 && (
        <div className="line-container">
          <div className="circle"></div>
          <div className="line"></div>
          <div className="circle"></div>
        </div>
      )}
      <div className="stop-details">
        <strong>{stop.StopName}</strong>
        <span>{stop.Time}</span>
      </div>
    </li>
  ))}
</ul>
            </div>
          ) : (
            <p>Search for a bus to see details.</p>
          )}
        </div>
      </div>

    <footer className="footer">
      <p>Made with ❤️ by Team Code Catalysts</p>
    </footer>
    </div>
  );
}

export default App;
