import { useState, useEffect, useRef } from 'react';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet for custom icon
import busIcon from './assets/busicon-1.png'; // Import custom bus icon

function App() {
  const [selectedBus, setSelectedBus] = useState(''); // Store the bus name/id from search input
  const [busCoords, setBusCoords] = useState(null);   // Store bus coordinates
  const [busInfo, setBusInfo] = useState(null);       // Store bus info
  const [error, setError] = useState('');             // State for error message
  const mapRef = useRef();                            // Reference to the map

  // Create custom bus marker icon
  const busMarkerIcon = L.icon({
    iconUrl: busIcon,
    iconSize: [38, 38], 
    iconAnchor: [19, 38], 
    popupAnchor: [0, -38] 
  });

  // Function to fetch coordinates
  const fetchCoordinates = () => {
    if (selectedBus) {
      fetch('/busCoordinates.json')
        .then((response) => response.json())
        .then((data) => {
          if (data[selectedBus]) {
            setBusCoords(data[selectedBus]);
            setError('');  // Clear any previous errors
            if (mapRef.current) {
              const { lat, lng } = data[selectedBus];
              mapRef.current.setView([lat, lng], 13); 
            }
          } else {
            setError('No such bus found');
            setBusCoords(null);
          }
        })
        .catch((error) => console.error('Error fetching coordinates:', error));
    }
  };

  // Function to fetch bus info
  const fetchBusInfo = () => {
    if (selectedBus) {
      fetch('/busInfo.json')
        .then((response) => response.json())
        .then((data) => {
          if (data[selectedBus]) {
            setBusInfo(data[selectedBus]);
            setError(''); // Clear any previous errors
          } else {
            setError('No such bus found');
            setBusInfo(null);
          }
        })
        .catch((error) => console.error('Error fetching bus info:', error));
    }
  };

  const handleSearchClick = () => {
    fetchCoordinates();
    fetchBusInfo();
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
          <div className="card">
            <label htmlFor="busSearch">Search for a bus:</label>
            <input
              id="busSearch"
              type="text"
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
              placeholder="Enter bus name or ID"
            />
            <button onClick={handleSearchClick}>Search</button>
          </div>

          {/* Show map only if busCoords are available */}
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
                {/* Marker for the bus */}
                <Marker position={[busCoords.lat, busCoords.lng]} icon={busMarkerIcon}>
                  <Popup>{`Bus is here: ${busCoords.lat}, ${busCoords.lng}`}</Popup>
                </Marker>
                {/* Circle for accuracy radius */}
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

          {/* Show error message if bus not found */}
          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Right Side: Bus Information */}
        <div className="right-side">
          <h2>Bus Information</h2>
          {busInfo ? (
            <div className="bus-info">
              <p><strong>From:</strong> {busInfo.From}</p>
              <p><strong>To:</strong> {busInfo.To}</p>
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
