import { useState, useEffect, useRef } from 'react';

import './App.css';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet for custom icon

import busIcon from './assets/busicon-1.png'; // Import custom bus icon

function App() {
  const [selectedBus, setSelectedBus] = useState('');
  const [busCoords, setBusCoords] = useState(null);
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

  useEffect(() => {
    fetchCoordinates(); // Fetch coordinates on bus selection
  }, [selectedBus]);

  const handleBusChange = (e) => {
    setSelectedBus(e.target.value);
  };

  const handleRefreshClick = () => {
    fetchCoordinates(); // Refresh coordinates on button click
  };

  return (
    <>
      <div>
        <a href="https://www.sih.gov.in/" target="_blank">
          <img src={busIcon} className="logo bus" alt="Bus logo" />
        </a>
        
      </div>
      <h1>Track Your Bus</h1>
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
        <div style={{ height: '500px', width: '100%', position: 'relative' }}>
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
    </>
  );
}

export default App;
