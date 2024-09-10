import React, { useState } from "react";
import './Home.css'; // Import the CSS for styling

const Home = () => {
  const [busId, setBusId] = useState("");
  const [buses, setBuses] = useState([
    { id: 1, regNo: "101", from: "Location A", to: "Location B" },
    { id: 2, regNo: "102", from: "Location C", to: "Location D" },
    { id: 3, regNo: "103", from: "Location E", to: "Location F" }
  ]);

  const handleSearch = () => {
    alert(`Searched for bus with ID: ${busId}`);
  };

  return (
    <div className="home-container">
      <h1 className="title">Track Your Bus</h1>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Bus by ID"
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">Search</button>
      </div>
      
      <h2 className="available-buses-title">Available Buses</h2>
      
      <div className="bus-list">
        {buses.map((bus) => (
          <div key={bus.id} className="bus-card">
            <p><strong>Bus:</strong> {bus.id}</p>
            <p><strong>Reg No:</strong> {bus.regNo}</p>
            <p><strong>From:</strong> {bus.from}</p>
            <p><strong>To:</strong> {bus.to}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
