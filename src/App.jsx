import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet'; 
import busIcon from './assets/busicon-1.png'; 

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationRequested, setLocationRequested] = useState(false);
  const [watchId, setWatchId] = useState(null); // store watchId
  const mapRef = useRef(); // ref to map
  
  const busMarkerIcon = L.icon({
    iconUrl: busIcon,
    iconSize: [38, 38], 
    iconAnchor: [19, 38], 
    popupAnchor: [0, -38] 
  });

  const zoomToUserLocation = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 17); // Adjust zoom level as needed
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      const newWatchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationRequested(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationRequested(true); // Mark as requested even on error
        }
      );
      setWatchId(newWatchId); // Save watchId in state
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLocationRequested(true);
    }
  };

  const handleUserLoc = () => {
    if (!watchId) { // If no watchId, start tracking location
      getUserLocation();
    } else if (userLocation) {
      zoomToUserLocation(); // If already tracking, just zoom to the latest location
    }
  };

  // Clean up the watchPosition when the component unmounts
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="container">
      <div style={{ height: '500px', width: '100%', position: 'relative' }}>
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lng] : [0, 0]} // Center on user if available
          zoom={17}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

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
            bottom: '10px',
            left: '10px',
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
    </div>
  );
}

export default App;
