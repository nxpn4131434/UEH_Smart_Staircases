import React from 'react';
import { useSimulation } from '../store/useSimulation';

export default function TechnicalOverlay() {
  const { showTechnicalOverlay } = useSimulation();
  
  if (!showTechnicalOverlay) return null;
  
  const steps = [
    { num: 1, title: 'QR Check-in', desc: 'Quét mã QR đầu cầu thang, xác nhận session' },
    { num: 2, title: 'Step Sensing', desc: '3 active steps/vế — piezo harvesting' },
    { num: 3, title: 'Gateway', desc: 'Tập hợp tín hiệu, đếm bước tại chiếu nghỉ' },
    { num: 4, title: 'Cloud Sync', desc: 'Real-time → dashboard & mobile app' },
    { num: 5, title: 'Leaderboard', desc: 'Cá nhân, khoa, cộng đồng — gamification' },
    { num: 6, title: 'Storage', desc: 'Lưu siêu tụ / pin dự trữ' },
  ];
  
  return (
    <div className="info-card tech-card">
      <div className="info-card-header">
        <div className="info-card-title">Kiến trúc hệ thống</div>
      </div>
      
      <div className="tech-steps-grid">
        {steps.map(step => (
          <div className="tech-step" key={step.num}>
            <div className="tech-num">{step.num}</div>
            <div className="tech-content">
              <div className="tech-step-title">{step.title}</div>
              <div className="tech-step-desc">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="tech-footer">
        <div className="tech-footer-section">
          <div className="tech-footer-title">Thiết kế bậc thang</div>
          <div className="tech-footer-text">3 active steps (giữa) · 7 dummy anti-slip · Consistent geometry · Giảm BOM</div>
        </div>
        <div className="tech-footer-divider" />
        <div className="tech-footer-section">
          <div className="tech-footer-title benefits">Lợi ích</div>
          <div className="tech-footer-text"><strong>User:</strong> Thi đua, đóng góp rõ · <strong>UEH:</strong> Giảm tải thang máy, engagement cao</div>
        </div>
      </div>
    </div>
  );
}
