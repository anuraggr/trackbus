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
  const [error, setError] = useState(''); /
  const mapRef = useRef();

  // Create custom bus marker icon
  const busMarkerIcon = L.icon({
    iconUrl: busIcon,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38] /
  });

  // fetch cords
  const fetchCoordinates = () => {
    if (selectedBus) {
      fetch('/busCoordinates.json')
        .then((response) => response.json())
        .then((data) => {
          if (data[selectedBus]) {
            setBusCoords(data[selectedBus]);
            setError(''); // Clear error

            // zoom to coords
            if (mapRef.current) {
              const { lat, lng } = data[selectedBus];
              mapRef.current.setView([lat, lng], 13);
            }
          } else {
            setError('No such bus found');
            setBusCoords(null); //remove map if no bus
          }
        })
        .catch((error) => console.error('Error fetching coordinates:', error));
    }
  };

  // fetch bus info
  const fetchBusInfo = () => {
    if (selectedBus) {
      fetch('/busInfo.json')
        .then((response) => response.json())
        .then((data) => {
          if (data[selectedBus]) {
            setBusInfo(data[selectedBus]);
            setError('');
          } else {
            setError('No such bus found');
            setBusInfo(null); 
          }
        })
        .catch((error) => console.error('Error fetching bus info:', error));
    }
  };

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
    const searchValue = `bus${searchInput}`;
    setSelectedBus(searchValue);
  };

  const handleRefreshClick = () => {
    fetchCoordinates(); 
  };

  return (
    <div className="container">
      <div>
        <a href="https://www.sih.gov.in/" target="_blank">
          <img src={busIcon} className="logo bus" alt="Bus logo" />
        </a>
      </div>

      <h1>Track Your Bus</h1>

      <div className="main-content">
        {/* Left Side: Bus Search and Map */}
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

          {busCoords && (
            <div style={{ height: '500px', width: '100%', position: 'relative' }}>
              <MapContainer
                center={[busCoords.lat, busCoords.lng]}
                zoom={13}
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

             
                {busCoords.accuracy && (
                  <Circle
                    center={[busCoords.lat, busCoords.lng]}
                    radius={busCoords.accuracy} // Radius in meters
                    pathOptions={{ color: 'lightblue', fillColor: 'lightblue', fillOpacity: 0.2 }}
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
                Refresh Coordinates
              </button>
            </div>
          )}
        </div>

        <div className="right-side">
          <h2>Bus Information</h2>
          {busInfo ? (
            <div className="bus-info">
              <p><strong>Bus No:</strong> {busInfo.No}</p>
              <p><strong>From:</strong> {busInfo.From}</p>
              <p><strong>To:</strong> {busInfo.to}</p>
              <p><strong>Departure:</strong> {busInfo.Departure}</p>
            </div>
          ) : (
            <p>Search for a bus to see details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
