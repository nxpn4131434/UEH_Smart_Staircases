import React from 'react';
import { useSimulation } from '../store/useSimulation';

export default function Mascot() {
  const { mascotVisible, mascotMessage } = useSimulation();
  
  if (!mascotVisible || !mascotMessage) return null;
  
  return (
    <div className="mascot-bubble">
      <div className="mascot-avatar">🥕</div>
      <div className="mascot-text">{mascotMessage}</div>
    </div>
  );
}
