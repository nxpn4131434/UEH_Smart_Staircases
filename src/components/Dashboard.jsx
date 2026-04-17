import React from 'react';
import { useSimulation } from '../store/useSimulation';

export default function Dashboard() {
  const {
    currentFloor, totalStepsWalked, activeStepsTriggered, energyGenerated,
    todaySessions, currentClimbers,
    isPlaying, stickmanPhase,
  } = useSimulation();
  
  const phaseLabel = stickmanPhase === 'climbing' ? 'Đang leo' 
    : stickmanPhase === 'scanning' ? 'Quét QR' 
    : stickmanPhase === 'complete' ? 'Hoàn thành' 
    : 'Chờ';
  
  return (
    <div className="dashboard-bar">
      <div className="dash-card">
        <div className="dash-card-label">Tầng hiện tại</div>
        <div className="dash-card-value">{isPlaying ? currentFloor : '—'}</div>
        <div className="dash-card-sub">{phaseLabel}</div>
      </div>
      
      <div className="dash-card">
        <div className="dash-card-label">Bước đã đi</div>
        <div className="dash-card-value">{totalStepsWalked}</div>
        <div className="dash-card-sub">active: {activeStepsTriggered}</div>
      </div>
      
      <div className="dash-card">
        <div className="dash-card-label">Điện tạo ra</div>
        <div className="dash-card-value energy">{energyGenerated.toFixed(3)}<span style={{ fontSize: 10 }}> kWh</span></div>
        <div className="dash-card-sub">{(energyGenerated * 1000).toFixed(1)} Wh</div>
      </div>
      
      <div className="dash-card">
        <div className="dash-card-label">Sessions</div>
        <div className="dash-card-value warning">{todaySessions}</div>
        <div className="dash-card-sub">hôm nay</div>
      </div>
      
      <div className="dash-card">
        <div className="dash-card-label">Đang leo</div>
        <div className="dash-card-value climbers">{currentClimbers}</div>
        <div className="dash-card-sub">người</div>
      </div>
    </div>
  );
}
