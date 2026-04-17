import React from 'react';
import { useSimulation } from '../store/useSimulation';

export default function ElevatorPanel() {
  const { showElevator, elevatorFloor, elevatorOccupancy, elevatorMaxOccupancy, elevatorWaitTime, elevatorDirection } = useSimulation();
  
  if (!showElevator) return null;
  
  const isCrowded = elevatorOccupancy > elevatorMaxOccupancy * 0.7;
  const occupancyPct = (elevatorOccupancy / elevatorMaxOccupancy) * 100;
  const currentFloorNum = Math.floor(elevatorFloor);
  
  return (
    <div className="info-card elevator-card">
      <div className="info-card-header">
        <div className="info-card-title">Thang máy — So sánh</div>
        <div className={`elevator-status-badge ${isCrowded ? 'crowded' : 'normal'}`}>
          {isCrowded ? 'Đông' : 'Bình thường'}
        </div>
      </div>
      
      <div className="elevator-visual">
        {/* Elevator shaft visualization */}
        <div className="elevator-shaft-mini">
          {Array.from({ length: 15 }, (_, i) => {
            const floor = 15 - i;
            const isCurrent = floor === currentFloorNum;
            return (
              <div key={floor} className={`shaft-floor ${isCurrent ? 'current' : ''}`}>
                <span className="shaft-floor-num">{floor}</span>
                {isCurrent && (
                  <div className="shaft-cabin">
                    <div className="shaft-cabin-indicator">
                      {elevatorDirection === 'up' ? '▲' : elevatorDirection === 'down' ? '▼' : '●'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Stats column */}
        <div className="elevator-stats-col">
          <div className="elevator-mini-stat">
            <span className="ems-label">Vị trí</span>
            <span className="ems-value">T{currentFloorNum}</span>
          </div>
          <div className="elevator-mini-stat">
            <span className="ems-label">Hướng</span>
            <span className="ems-value">
              {elevatorDirection === 'up' ? '▲ Lên' : elevatorDirection === 'down' ? '▼ Xuống' : '— Dừng'}
            </span>
          </div>
          <div className="elevator-mini-stat">
            <span className="ems-label">Số người</span>
            <span className={`ems-value ${isCrowded ? 'text-red' : 'text-green'}`}>
              {elevatorOccupancy}/{elevatorMaxOccupancy}
            </span>
          </div>
          
          {/* Occupancy bar */}
          <div className="occupancy-bar-wrap">
            <div className="occupancy-bar">
              <div 
                className={`occupancy-fill ${isCrowded ? 'crowded' : ''}`} 
                style={{ width: `${occupancyPct}%` }} 
              />
            </div>
          </div>
          
          <div className="elevator-mini-stat">
            <span className="ems-label">Chờ TB</span>
            <span className="ems-value">~{elevatorWaitTime}s</span>
          </div>
          <div className="elevator-mini-stat">
            <span className="ems-label">ETA T5</span>
            <span className="ems-value">~{Math.abs(5 - currentFloorNum) * 8 + elevatorWaitTime}s</span>
          </div>
        </div>
      </div>
      
      <div className="elevator-tip">
        Leo cầu thang 4 tầng ≈ 80s, nhanh hơn chờ thang máy và tạo năng lượng sạch!
      </div>
    </div>
  );
}
