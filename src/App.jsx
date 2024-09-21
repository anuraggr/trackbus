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
  const mapRef = useRef(); // Reference to the map
  
  const busMarkerIcon = L.icon({
    iconUrl: busIcon,
    iconSize: [38, 38], 
    iconAnchor: [19, 38], 
    popupAnchor: [0, -38] 
  });

  // Function to fetch coordinates from serverless function
  const fetchCoordinates = () => {
    fetch('/api/firebase') // Assuming the serverless function endpoint is /api/firebase
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setBusCoords({
            lat: data.latitude,
            lng: data.longitude,
            accuracy: data.accuracy || 10, // Set default accuracy if not provided
          });
          setError(''); 

          if (mapRef.current) {
            mapRef.current.setView([data.latitude, data.longitude], 17); 
          }
        } else {
          setError('No data found');
          setBusCoords(null); 
        }
      })
      .catch((error) => {
        console.error('Error fetching coordinates:', error);
        setError('Failed to fetch coordinates');
      });
  };

  // Function to fetch bus info
  const fetchBusInfo = () => {
  if (selectedBus) {
    fetch('/busInfo.json')
      .then((response) => response.json())
      .then((data) => {
        if (data[selectedBus]) {
          setBusInfo(data[selectedBus]);
          setBusCoords(null); // Reset coordinates if an invalid bus was previously searched
          setError(''); 
        } else {
          setError('No such bus found');
          setBusInfo(null); 
          setBusCoords(null); // Make sure map is not shown if bus is invalid

          // Keep the error for 5 seconds
          setTimeout(() => {
            setError('');
          }, 5000);
        }
      })
      .catch((error) => {
        console.error('Error fetching bus info:', error);
        setError('Failed to fetch bus info');

        // Keep the error for 5 seconds
        setTimeout(() => {
          setError('');
        }, 5000);
      });
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
    // Assuming the search input is just used to set selectedBus and that you handle it directly
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

          {busCoords && busInfo && (
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

                {busCoords.accuracy && (
                  <Circle
                    center={[busCoords.lat, busCoords.lng]}
                    radius={busCoords.accuracy}
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

        {/* Right Side: Bus Information */}
        <div className="right-side">
          <h2>Bus Information</h2>
          {busInfo ? (
            <div className="bus-info">
              <p><strong>Bus No:</strong> {busInfo.No}</p>
              <p><strong>From:</strong> {busInfo.From}</p>
              <p><strong>To:</strong> {busInfo.To}</p>
              <p><strong>Departure:</strong> {busInfo.Departure}</p>
              <p><strong>Bus Driver Contact:</strong> {busInfo.BusDriverContact}</p>
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
