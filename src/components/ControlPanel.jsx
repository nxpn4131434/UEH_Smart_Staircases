import React from 'react';
import { useSimulation } from '../store/useSimulation';

export default function ControlPanel() {
  const {
    startFloor, endFloor, userType, speed, isPlaying, isPaused,
    viewMode, showLabels, showEnergyFlow, showElevator,
    showTechnicalOverlay, showAppPanel, demoMode,
    setStartFloor, setEndFloor, setUserType, setSpeed, setViewMode,
    toggleLabels, toggleEnergyFlow, toggleElevator,
    toggleTechnicalOverlay, toggleAppPanel, setDemoMode,
    startSimulation, pauseSimulation, resumeSimulation, resetSimulation,
  } = useSimulation();
  
  const floors = Array.from({ length: 15 }, (_, i) => i + 1);
  
  return (
    <div className="control-panel">
      {/* Header */}
      <div className="panel-header">
        <div className="logo-icon">⚡</div>
        <div>
          <h1>Smart Staircase</h1>
          <div className="subtitle">UEH Energy Harvesting System</div>
        </div>
      </div>
      
      {/* Simulation Setup */}
      <div className="panel-section">
        <div className="panel-section-title">Thiết lập mô phỏng</div>
        
        <div className="panel-row">
          <span className="panel-label">Tầng bắt đầu</span>
          <select 
            className="panel-select" 
            value={startFloor} 
            onChange={(e) => setStartFloor(Number(e.target.value))}
            disabled={isPlaying}
          >
            {floors.map(f => (
              <option key={f} value={f}>Tầng {f}</option>
            ))}
          </select>
        </div>
        
        <div className="panel-row">
          <span className="panel-label">Tầng kết thúc</span>
          <select 
            className="panel-select" 
            value={endFloor} 
            onChange={(e) => setEndFloor(Number(e.target.value))}
            disabled={isPlaying}
          >
            {floors.filter(f => f > startFloor).map(f => (
              <option key={f} value={f}>Tầng {f}</option>
            ))}
          </select>
        </div>
        
        <div className="panel-row">
          <span className="panel-label">Loại user</span>
          <select 
            className="panel-select" 
            value={userType} 
            onChange={(e) => setUserType(e.target.value)}
            disabled={isPlaying}
          >
            <option value="student">Sinh viên</option>
            <option value="teacher">Giảng viên</option>
          </select>
        </div>
      </div>
      
      {/* Playback Controls */}
      <div className="panel-section">
        <div className="panel-section-title">Điều khiển</div>
        
        <div className="sim-controls">
          {!isPlaying ? (
            <button className="btn btn-success btn-full" onClick={startSimulation}>
              ▶ Bắt đầu mô phỏng
            </button>
          ) : (
            <>
              {!isPaused ? (
                <button className="btn btn-warning" onClick={pauseSimulation}>⏸ Tạm dừng</button>
              ) : (
                <button className="btn btn-success" onClick={resumeSimulation}>▶ Tiếp tục</button>
              )}
              <button className="btn btn-danger" onClick={resetSimulation}>⏹ Reset</button>
            </>
          )}
        </div>
        
        <div style={{ marginTop: 8 }}>
          <div className="panel-section-title" style={{ marginBottom: 6 }}>Tốc độ</div>
          <div className="speed-row">
            {[0.5, 1, 2, 4].map(s => (
              <button 
                key={s}
                className={`speed-btn ${speed === s ? 'active' : ''}`}
                onClick={() => setSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* View Mode */}
      <div className="panel-section">
        <div className="panel-section-title">Chế độ hiển thị</div>
        <div className="btn-group">
          <button 
            className={`btn btn-sm ${viewMode === 'cutaway' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setViewMode('cutaway')}
          >
            Cutaway
          </button>
          <button 
            className={`btn btn-sm ${viewMode === 'xray' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setViewMode('xray')}
          >
            X-Ray
          </button>
        </div>
      </div>
      
      {/* Toggles — simplified, no excessive icons */}
      <div className="panel-section">
        <div className="panel-section-title">Hiển thị</div>
        <div className="toggle-list">
          <div className={`toggle-item ${showLabels ? 'active' : ''}`} onClick={toggleLabels}>
            <span>Labels</span>
            <div className="toggle-dot" />
          </div>
          <div className={`toggle-item ${showEnergyFlow ? 'active' : ''}`} onClick={toggleEnergyFlow}>
            <span>Energy Flow</span>
            <div className="toggle-dot" />
          </div>
          <div className={`toggle-item ${showElevator ? 'active' : ''}`} onClick={toggleElevator}>
            <span>So sánh Elevator</span>
            <div className="toggle-dot" />
          </div>
          <div className={`toggle-item ${showTechnicalOverlay ? 'active' : ''}`} onClick={toggleTechnicalOverlay}>
            <span>Kiến trúc kỹ thuật</span>
            <div className="toggle-dot" />
          </div>
          <div className={`toggle-item ${showAppPanel ? 'active' : ''}`} onClick={toggleAppPanel}>
            <span>App Panel</span>
            <div className="toggle-dot" />
          </div>
        </div>
      </div>
      
      {/* Demo Modes — simplified icons */}
      <div className="panel-section">
        <div className="panel-section-title">Demo Modes</div>
        <div className="demo-grid">
          <button 
            className={`demo-btn ${demoMode === 'single' ? 'active' : ''}`}
            onClick={() => {
              setDemoMode('single');
              setStartFloor(1);
              setEndFloor(5);
              startSimulation();
            }}
          >
            Single Journey
          </button>
          <button 
            className={`demo-btn ${demoMode === 'compare' ? 'active' : ''}`}
            onClick={() => setDemoMode(demoMode === 'compare' ? null : 'compare')}
          >
            Stair vs Lift
          </button>
          <button 
            className={`demo-btn ${demoMode === 'crowd' ? 'active' : ''}`}
            onClick={() => setDemoMode(demoMode === 'crowd' ? null : 'crowd')}
          >
            Crowd Sim
          </button>
          <button 
            className={`demo-btn ${demoMode === 'technical' ? 'active' : ''}`}
            onClick={() => {
              setDemoMode(demoMode === 'technical' ? null : 'technical');
              if (demoMode !== 'technical') {
                toggleTechnicalOverlay();
              }
            }}
          >
            Technical
          </button>
        </div>
      </div>
      
      {/* Info — minimal */}
      <div className="panel-section" style={{ opacity: 0.7, fontSize: 9, color: 'var(--text-muted)', lineHeight: 1.5 }}>
        Mỗi vế thang có 10 bậc: 3 active harvesting (xanh) + 7 dummy anti-slip (xám). Khi bước lên active step, năng lượng được thu hoạch và truyền về gateway.
      </div>
    </div>
  );
}
