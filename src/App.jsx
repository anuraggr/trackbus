import { useState, useEffect, useRef } from 'react';

import './App.css';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet for custom icon

import busIcon from './assets/busicon-1.png'; // Import custom bus icon

function App() {
  const [selectedBus, setSelectedBus] = useState('');
  const [busCoords, setBusCoords] = useState(null);
  const [busInfo, setBusInfo] = useState(null); // State for bus info
  const mapRef = useRef(); // Reference to the map

  // Create custom bus marker icon
  const busMarkerIcon = L.icon({
    iconUrl: busIcon,
    iconSize: [38, 38], // Size of the icon
    iconAnchor: [19, 38], // Point of the icon that corresponds to the marker's location
    popupAnchor: [0, -38] // Point from which the popup should open relative to the iconAnchor
  });

  // Function to fetch coordinates
  const fetchCoordinates = () => {
    if (selectedBus) {
      fetch('/busCoordinates.json')
        .then((response) => response.json())
        .then((data) => {
          setBusCoords(data[selectedBus]);

          // If we have a map reference, zoom to the new coordinates
          if (mapRef.current && data[selectedBus]) {
            const { lat, lng } = data[selectedBus];
            mapRef.current.setView([lat, lng], 13); // Zoom to the marker with zoom level 13
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
          setBusInfo(data[selectedBus]);
        })
        .catch((error) => console.error('Error fetching bus info:', error));
    }
  };

  useEffect(() => {
    fetchCoordinates(); // Fetch coordinates on bus selection
    fetchBusInfo(); // Fetch bus info on bus selection
  }, [selectedBus]);

  const handleBusChange = (e) => {
    setSelectedBus(e.target.value);
  };

  const handleRefreshClick = () => {
    fetchCoordinates(); // Refresh coordinates on button click
  };

  return (
    <div className="container">
      <div>
        <a href="https://www.sih.gov.in/" target="_blank" rel="noopener noreferrer">
          <img src={busIcon} className="logo bus" alt="Bus logo" />
        </a>
      </div>

      <h1>Track Your Bus</h1>

      <div className="main-content">
        {/* Left Side: Bus Selector and Map */}
        <div className="left-side">
          <div className="card">
            <label htmlFor="busSelect">Choose a bus:</label>
            <select
              id="busSelect"
              value={selectedBus}
              onChange={handleBusChange}
            >
              <option value="">-- Select a bus --</option>
              <option value="bus1">Bus 1</option>
              <option value="bus2">Bus 2</option>
              <option value="bus3">Bus 3</option>
            </select>
          </div>

          {busCoords && (
            <div className="map-container">
              <MapContainer
                center={[busCoords.lat, busCoords.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef} // Attach the map reference here
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Marker for the bus */}
                <Marker
                  position={[busCoords.lat, busCoords.lng]}
                  icon={busMarkerIcon} // Apply custom bus icon
                >
                  <Popup>
                    {`Bus is here: ${busCoords.lat}, ${busCoords.lng}`}
                  </Popup>
                </Marker>

                {/* Circle for accuracy radius */}
                {busCoords.accuracy && (
                  <Circle
                    center={[busCoords.lat, busCoords.lng]}
                    radius={busCoords.accuracy} // Radius in meters
                    pathOptions={{ color: 'lightblue', fillColor: 'lightblue', fillOpacity: 0.2 }}
                  />
                )}
              </MapContainer>

              {/* Refresh Button near the map */}
              <button
                className="refresh-button"
                onClick={handleRefreshClick}
              >
                Refresh Coordinates
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Bus Information */}
        <div className="right-side">
          {selectedBus ? (
            <>
              <h2>Bus Information</h2>
              {busInfo ? (
                <div className="bus-info">
                  <p><strong>From:</strong> {busInfo.From}</p>
                  <p><strong>To:</strong> {busInfo.To}</p>
                  <p><strong>Departure:</strong> {busInfo.Departure}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </>
          ) : (
            <p>Select a bus to see details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
