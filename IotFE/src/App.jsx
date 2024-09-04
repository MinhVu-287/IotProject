import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DataSensorHistory from './pages/DataSensorHistory';
import ActionHistory from './pages/ActionHistory';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sensor-history" element={<DataSensorHistory />} />
          <Route path="/action-history" element={<ActionHistory />} />
        </Routes> 
      </div>
    </Router>
  );
}

export default App;
