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
  const mapRef = useRef();

  const busMarkerIcon = L.icon({
    iconUrl: busIcon,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });

  // ... (keep all the existing functions: fetchCoordinates, fetchBusInfo, useEffect, etc.)

  return (
    <div className="container">
      <div>
        <a href="https://www.sih.gov.in/" target="_blank">
          <img src={busIcon} className="logo bus" alt="Bus logo" />
        </a>
      </div>

      <h1>Track Your Bus</h1>

      <div className="main-content">
        {/* Center: Bus Search */}
        <div className="search-section">
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
            <div className="map-container">
              <MapContainer
                center={[busCoords.lat, busCoords.lng]}
                zoom={13}
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
              <button className="refresh-button" onClick={handleRefreshClick}>
                Refresh Coordinates
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Bus Information */}
        <div className="info-section">
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
