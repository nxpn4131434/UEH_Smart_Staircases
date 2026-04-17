import React from 'react';
import { useSimulation } from '../store/useSimulation';

export default function SessionPopup() {
  const { isPlaying, stickmanPhase, sessionSummary, startFloor, endFloor, resetSimulation } = useSimulation();
  
  // Show scanning popup — now more clear about QR process
  if (isPlaying && stickmanPhase === 'scanning') {
    const totalFloors = endFloor - startFloor;
    const estimatedSteps = totalFloors * 10;
    
    return (
      <div className="session-started-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="session-started-card">
          <div className="scan-pulse-ring" />
          <h3>Session Started!</h3>
          <div className="session-scan-indicator">
            <div className="scan-dot" />
            <span>Đang quét QR Check-in...</span>
          </div>
          <div className="session-info-row">
            <span>Tầng bắt đầu</span>
            <span>Tầng {startFloor}</span>
          </div>
          <div className="session-info-row">
            <span>Tầng đích</span>
            <span>Tầng {endFloor}</span>
          </div>
          <div className="session-info-row">
            <span>Số tầng cần leo</span>
            <span>{totalFloors} tầng</span>
          </div>
          <div className="session-info-row">
            <span>Ước tính bước</span>
            <span>~{estimatedSteps} bước</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Show completion popup
  if (sessionSummary && stickmanPhase === 'complete') {
    return (
      <div className="session-popup">
        <h2>Session Hoàn Thành!</h2>
        
        <div className="session-stat">
          <span className="session-stat-name">Từ → Đến</span>
          <span className="session-stat-val">T{sessionSummary.startFloor} → T{sessionSummary.endFloor}</span>
        </div>
        <div className="session-stat">
          <span className="session-stat-name">Tổng bước</span>
          <span className="session-stat-val">{sessionSummary.totalSteps}</span>
        </div>
        <div className="session-stat">
          <span className="session-stat-name">Active triggers</span>
          <span className="session-stat-val" style={{ color: 'var(--accent-green)' }}>{sessionSummary.activeSteps}</span>
        </div>
        <div className="session-stat">
          <span className="session-stat-name">Năng lượng</span>
          <span className="session-stat-val" style={{ color: 'var(--accent-green)' }}>{sessionSummary.energy.toFixed(4)} kWh</span>
        </div>
        <div className="session-stat">
          <span className="session-stat-name">Calories</span>
          <span className="session-stat-val">{sessionSummary.calories.toFixed(1)} kcal</span>
        </div>
        <div className="session-stat">
          <span className="session-stat-name">Rank</span>
          <span className="session-stat-val" style={{ color: 'var(--accent-yellow)' }}>#{sessionSummary.rank}</span>
        </div>
        <div className="session-stat">
          <span className="session-stat-name">Points earned</span>
          <span className="session-stat-val" style={{ color: 'var(--accent-purple)' }}>+{sessionSummary.points}</span>
        </div>
        
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: 16 }}
          onClick={resetSimulation}
        >
          Mô phỏng lại
        </button>
      </div>
    );
  }
  
  return null;
}
