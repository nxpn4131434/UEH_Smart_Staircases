import React, { useState } from 'react';
import { useSimulation } from '../store/useSimulation';

export default function LeaderboardPanel() {
  const { showLeaderboard, leaderboard, deptLeaderboard, communityGoals } = useSimulation();
  const [tab, setTab] = useState('individual');
  
  if (!showLeaderboard) return null;
  
  const getRankClass = (rank) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return 'normal';
  };
  
  return (
    <div className="leaderboard-panel">
      <div className="leaderboard-header">
        <h3>🏆 Bảng Xếp Hạng Tuần</h3>
      </div>
      
      <div className="leaderboard-tabs">
        <button 
          className={`lb-tab ${tab === 'individual' ? 'active' : ''}`}
          onClick={() => setTab('individual')}
        >
          Cá nhân
        </button>
        <button 
          className={`lb-tab ${tab === 'department' ? 'active' : ''}`}
          onClick={() => setTab('department')}
        >
          Khoa
        </button>
        <button 
          className={`lb-tab ${tab === 'community' ? 'active' : ''}`}
          onClick={() => setTab('community')}
        >
          Cộng đồng
        </button>
      </div>
      
      {tab === 'individual' && (
        <div className="leaderboard-list">
          {leaderboard.slice(0, 8).map((item) => (
            <div className="lb-item" key={item.rank}>
              <div className={`lb-rank ${getRankClass(item.rank)}`}>{item.rank}</div>
              <div className="lb-info">
                <div className="lb-name">{item.name}</div>
                <div className="lb-dept">{item.dept}</div>
              </div>
              <div className="lb-stats">
                <div className="lb-steps">{item.steps.toLocaleString()}</div>
                <div className="lb-energy">{item.energy} kWh</div>
                {item.badge && <div className="lb-badge">{item.badge}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {tab === 'department' && (
        <div className="leaderboard-list">
          {deptLeaderboard.map((item) => (
            <div className="lb-item" key={item.rank}>
              <div className={`lb-rank ${getRankClass(item.rank)}`}>{item.rank}</div>
              <div className="lb-info">
                <div className="lb-name">{item.name}</div>
                <div className="lb-dept">{item.members} thành viên</div>
              </div>
              <div className="lb-stats">
                <div className="lb-steps">{item.steps.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {tab === 'community' && (
        <div className="community-section" style={{ borderTop: 'none', padding: '12px' }}>
          <h4>🌍 Mục tiêu cộng đồng</h4>
          {communityGoals.map((goal) => (
            <div className="goal-item" key={goal.id}>
              <div className="goal-icon">{goal.icon}</div>
              <div className="goal-info">
                <div className="goal-name">{goal.name}</div>
                <div className="goal-bar">
                  <div 
                    className="goal-fill" 
                    style={{ width: `${(goal.current / goal.target * 100)}%` }} 
                  />
                </div>
              </div>
              <div className="goal-pct">{Math.round(goal.current / goal.target * 100)}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
