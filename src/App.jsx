import React from 'react';
import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';
import Dashboard from './components/Dashboard';
import PhoneApp from './components/PhoneApp';
import ElevatorPanel from './components/ElevatorPanel';
import TechnicalOverlay from './components/TechnicalOverlay';
import SessionPopup from './components/SessionPopup';
import Mascot from './components/Mascot';

export default function App() {
  return (
    <div className="app-container">
      {/* Left Control Panel */}
      <ControlPanel />
      
      {/* Center: 3D Viewport + Bottom Info Panels */}
      <div className="center-column">
        {/* 3D Viewport */}
        <div className="viewport-container">
          <Scene />
          
          {/* Dashboard on top - compact */}
          <Dashboard />
          
          {/* Session popup */}
          <SessionPopup />
          
          {/* Mascot encouragement */}
          <Mascot />
          
          {/* Bottom status bar */}
          <div className="bottom-bar">
            <div className="status-pill">
              <div className="status-dot" />
              System Online
            </div>
            <div className="status-pill">
              Smart Staircase v2.0 — UEH Campus
            </div>
          </div>
        </div>
        
        {/* Bottom Info Strip — Elevator + Technical side by side, not overlapping */}
        <div className="info-strip">
          <ElevatorPanel />
          <TechnicalOverlay />
        </div>
      </div>
      
      {/* Phone App Panel on right */}
      <PhoneApp />
    </div>
  );
}
