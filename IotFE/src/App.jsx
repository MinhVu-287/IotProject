import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DataSensorHistory from './pages/DataSensorHistory';
import ActionHistory from './pages/ActionHistory';
import CustomAppBar from './components/CustomAppBar';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <CustomAppBar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/data-sensor-history" element={<DataSensorHistory />} />
          <Route path="/action-history" element={<ActionHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
