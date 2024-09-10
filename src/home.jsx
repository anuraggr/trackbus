import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation
import './Home.css';

const Home = () => {
  const [busId, setBusId] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (busId) {
      // Redirect to App.jsx or another route after search (assuming '/app' is a valid route)
      navigate('/app');
    }
  };

  return (
    <div className="home-container">
      <h1 className="title">Track Your Bus</h1>
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search Bus by ID"
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default Home;
