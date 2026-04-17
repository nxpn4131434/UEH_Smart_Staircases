import React, { useState, useEffect } from 'react';
import { useSimulation } from '../store/useSimulation';

// Notification system
function NotificationToast({ notification, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  
  return (
    <div className={`phone-notification ${notification.type}`} onClick={onDismiss}>
      <div className="phone-notif-icon">{notification.icon}</div>
      <div className="phone-notif-body">
        <div className="phone-notif-title">{notification.title}</div>
        <div className="phone-notif-text">{notification.message}</div>
      </div>
      <div className="phone-notif-time">now</div>
    </div>
  );
}

function NotificationStack() {
  const { notifications, dismissNotification } = useSimulation();
  
  if (!notifications || notifications.length === 0) return null;
  
  return (
    <div className="phone-notification-stack">
      {notifications.slice(0, 3).map((n) => (
        <NotificationToast 
          key={n.id} 
          notification={n} 
          onDismiss={() => dismissNotification(n.id)} 
        />
      ))}
    </div>
  );
}

// QR Scan screen with animation
function QRScanScreen({ onClose }) {
  const [scanPhase, setScanPhase] = useState('ready'); // ready, scanning, success
  const { startSimulation, startFloor, endFloor } = useSimulation();
  
  const handleScan = () => {
    setScanPhase('scanning');
    setTimeout(() => {
      setScanPhase('success');
      setTimeout(() => {
        startSimulation();
        onClose();
      }, 1200);
    }, 1500);
  };
  
  return (
    <div className="phone-qr-screen">
      <div className="phone-qr-header">
        <button className="phone-qr-back" onClick={onClose}>← Quay lại</button>
        <span>Scan QR Check-in</span>
      </div>
      
      <div className="phone-qr-body">
        {scanPhase === 'ready' && (
          <>
            <div className="qr-viewfinder">
              <div className="qr-corner tl" />
              <div className="qr-corner tr" />
              <div className="qr-corner bl" />
              <div className="qr-corner br" />
              <div className="qr-code-placeholder">
                <div className="qr-grid">
                  {Array.from({ length: 25 }, (_, i) => (
                    <div key={i} className={`qr-cell ${[0, 2, 3, 5, 8, 9, 12, 14, 15, 18, 20, 21, 23, 24].includes(i) ? 'filled' : ''}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="qr-instruction">
              Đưa camera vào mã QR tại đầu cầu thang
            </div>
            <div className="qr-route-preview">
              <span>T{startFloor}</span>
              <div className="qr-route-arrow">→</div>
              <span>T{endFloor}</span>
            </div>
            <button className="phone-scan-action-btn" onClick={handleScan}>
              Quét mã QR
            </button>
          </>
        )}
        
        {scanPhase === 'scanning' && (
          <>
            <div className="qr-viewfinder scanning">
              <div className="qr-corner tl" />
              <div className="qr-corner tr" />
              <div className="qr-corner bl" />
              <div className="qr-corner br" />
              <div className="qr-scan-line" />
              <div className="qr-code-placeholder">
                <div className="qr-grid">
                  {Array.from({ length: 25 }, (_, i) => (
                    <div key={i} className={`qr-cell ${[0, 2, 3, 5, 8, 9, 12, 14, 15, 18, 20, 21, 23, 24].includes(i) ? 'filled' : ''}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="qr-instruction">Đang quét...</div>
          </>
        )}
        
        {scanPhase === 'success' && (
          <div className="qr-success">
            <div className="qr-check-circle">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="none" stroke="#10b981" strokeWidth="2" className="qr-check-ring" />
                <path d="M12 20l5 5 11-11" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="qr-check-mark" />
              </svg>
            </div>
            <div className="qr-success-text">Check-in thành công!</div>
            <div className="qr-success-route">T{startFloor} → T{endFloor}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function HomeScreen({ onOpenQR }) {
  const { todayTotalSteps, totalStepsWalked, isPlaying } = useSimulation();
  
  return (
    <>
      <div className="phone-app-header">
        <div className="phone-app-name">UEH StairUp</div>
        <div className="phone-app-subtitle">Smart Staircase Companion</div>
      </div>
      
      <div className="phone-card">
        <div className="phone-big-stat">
          <div className="phone-big-number">{isPlaying ? totalStepsWalked : todayTotalSteps.toLocaleString()}</div>
          <div className="phone-big-label">{isPlaying ? 'Bước hiện tại' : 'Bước hôm nay'}</div>
        </div>
      </div>
      
      <div className="phone-card">
        <h4>Thống kê nhanh</h4>
        <div className="phone-stat-row">
          <span className="phone-stat-label">Điểm tích lũy</span>
          <span className="phone-stat-value">2,450</span>
        </div>
        <div className="phone-stat-row">
          <span className="phone-stat-label">Rank tuần</span>
          <span className="phone-stat-value">#6</span>
        </div>
        <div className="phone-stat-row">
          <span className="phone-stat-label">Streak</span>
          <span className="phone-stat-value green">5 ngày</span>
        </div>
      </div>
      
      <button className="phone-scan-btn" onClick={onOpenQR}>
        Scan QR Check-in
      </button>
      
      <div className="phone-card">
        <h4>Thử thách hôm nay</h4>
        <div className="phone-stat-row">
          <span className="phone-stat-label">Leo 5 tầng</span>
          <span className="phone-stat-value green">✓</span>
        </div>
        <div className="phone-stat-row">
          <span className="phone-stat-label">Trigger 20 active steps</span>
          <span className="phone-stat-value">15/20</span>
        </div>
        <div className="phone-progress-bar">
          <div className="phone-progress-fill" style={{ width: '75%' }} />
        </div>
      </div>
    </>
  );
}

function SessionScreen() {
  const { sessionSummary, startFloor, endFloor, totalStepsWalked, activeStepsTriggered, energyGenerated, caloriesBurned, isComplete } = useSimulation();
  
  const summary = sessionSummary || {
    startFloor, endFloor,
    totalSteps: totalStepsWalked,
    activeSteps: activeStepsTriggered,
    energy: energyGenerated,
    calories: caloriesBurned,
    rank: 6,
    points: totalStepsWalked * 2 + activeStepsTriggered * 5,
    contribution: energyGenerated,
  };
  
  return (
    <>
      <div className="phone-app-header">
        <div className="phone-app-name">{isComplete ? 'Session Complete!' : 'Session Active'}</div>
        <div className="phone-app-subtitle">{isComplete ? 'Kết quả leo thang' : 'Đang theo dõi...'}</div>
      </div>
      
      <div className="phone-card">
        <h4>Session Summary</h4>
        <div className="phone-stat-row">
          <span className="phone-stat-label">Từ tầng</span>
          <span className="phone-stat-value">{summary.startFloor} → {summary.endFloor}</span>
        </div>
        <div className="phone-stat-row">
          <span className="phone-stat-label">Tổng bước</span>
          <span className="phone-stat-value">{summary.totalSteps}</span>
        </div>
        <div className="phone-stat-row">
          <span className="phone-stat-label">Active triggers</span>
          <span className="phone-stat-value green">{summary.activeSteps}</span>
        </div>
        <div className="phone-stat-row">
          <span className="phone-stat-label">Năng lượng</span>
          <span className="phone-stat-value green">{summary.energy.toFixed(4)} kWh</span>
        </div>
        <div className="phone-stat-row">
          <span className="phone-stat-label">Calories</span>
          <span className="phone-stat-value">{summary.calories.toFixed(1)} kcal</span>
        </div>
      </div>
      
      {isComplete && (
        <>
          <div className="phone-card">
            <h4>Kết quả</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
              <div className="phone-rank-badge">{summary.rank}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>Rank #{summary.rank}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{summary.points} điểm</div>
              </div>
            </div>
          </div>
          
          <div className="phone-card">
            <h4>Badges</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <span className="phone-badge">Active Climber</span>
              <span className="phone-badge">Energy Maker</span>
              <span className="phone-badge">5-Day Streak</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function LeaderboardScreen() {
  const { leaderboard } = useSimulation();
  
  return (
    <>
      <div className="phone-app-header">
        <div className="phone-app-name">Leaderboard</div>
        <div className="phone-app-subtitle">Bảng xếp hạng tuần</div>
      </div>
      
      {leaderboard.slice(0, 7).map((item) => (
        <div className="phone-card" key={item.rank} style={{ padding: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: item.rank <= 3 ? 
                item.rank === 1 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                item.rank === 2 ? 'linear-gradient(135deg, #94a3b8, #64748b)' :
                'linear-gradient(135deg, #d97706, #92400e)' :
                'rgba(51,65,85,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: 'white',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {item.rank}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{item.dept}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: "'JetBrains Mono', monospace" }}>
                {item.steps.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function CommunityScreen() {
  const { communityGoals, todayTotalEnergy, todayTotalSteps } = useSimulation();
  
  return (
    <>
      <div className="phone-app-header">
        <div className="phone-app-name">Cộng đồng</div>
        <div className="phone-app-subtitle">Đóng góp toàn trường</div>
      </div>
      
      <div className="phone-card">
        <h4>Hôm nay</h4>
        <div className="phone-stat-row">
          <span className="phone-stat-label">Tổng bước</span>
          <span className="phone-stat-value">{todayTotalSteps.toLocaleString()}</span>
        </div>
        <div className="phone-stat-row">
          <span className="phone-stat-label">Tổng điện vi mô</span>
          <span className="phone-stat-value green">{todayTotalEnergy.toFixed(2)} kWh</span>
        </div>
      </div>
      
      {communityGoals.map((goal) => (
        <div className="phone-card" key={goal.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>{goal.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600 }}>{goal.name}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{goal.reward}</div>
            </div>
          </div>
          <div className="phone-progress-bar">
            <div className="phone-progress-fill" style={{ width: `${(goal.current / goal.target * 100)}%` }} />
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>
            {goal.current.toLocaleString()} / {goal.target.toLocaleString()} bước ({Math.round(goal.current / goal.target * 100)}%)
          </div>
        </div>
      ))}
    </>
  );
}

export default function PhoneApp() {
  const { showAppPanel, appScreen, setAppScreen, isPlaying } = useSimulation();
  const [showQR, setShowQR] = useState(false);
  
  // Auto-switch to session screen when simulation starts
  useEffect(() => {
    if (isPlaying) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowQR(false);
    }
  }, [isPlaying]);

  if (!showAppPanel) return null;
  
  const screens = {
    home: <HomeScreen onOpenQR={() => setShowQR(true)} />,
    session: <SessionScreen />,
    leaderboard: <LeaderboardScreen />,
    community: <CommunityScreen />,
  };
  
  return (
    <div className="phone-panel">
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-status-bar">
          <span>9:41</span>
          <span>5G 92%</span>
        </div>
        
        {/* Notification stack */}
        <NotificationStack />
        
        <div className="phone-screen">
          {showQR ? (
            <QRScanScreen onClose={() => setShowQR(false)} />
          ) : (
            screens[appScreen]
          )}
        </div>
        <div className="phone-nav">
          <button 
            className={`phone-nav-item ${appScreen === 'home' ? 'active' : ''}`}
            onClick={() => { setAppScreen('home'); setShowQR(false); }}
          >
            <span className="phone-nav-label">Home</span>
          </button>
          <button 
            className={`phone-nav-item ${appScreen === 'session' ? 'active' : ''}`}
            onClick={() => { setAppScreen('session'); setShowQR(false); }}
          >
            <span className="phone-nav-label">Session</span>
          </button>
          <button 
            className={`phone-nav-item ${appScreen === 'leaderboard' ? 'active' : ''}`}
            onClick={() => { setAppScreen('leaderboard'); setShowQR(false); }}
          >
            <span className="phone-nav-label">Rank</span>
          </button>
          <button 
            className={`phone-nav-item ${appScreen === 'community' ? 'active' : ''}`}
            onClick={() => { setAppScreen('community'); setShowQR(false); }}
          >
            <span className="phone-nav-label">Social</span>
          </button>
        </div>
      </div>
      <div className="phone-label">UEH StairUp App</div>
    </div>
  );
}
