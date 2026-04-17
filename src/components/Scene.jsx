import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, Environment } from '@react-three/drei';
import Building from './Building';
import { useSimulation } from '../store/useSimulation';

function SimulationLoop() {
  const frameCount = useRef(0);
  const { isPlaying, isPaused, speed, stickmanPhase, advanceStep, updatePulses, moveElevator } = useSimulation();
  
  useFrame(() => {
    if (!isPlaying || isPaused) return;
    
    frameCount.current += 1;
    
    // Advance stickman steps at intervals based on speed
    const stepInterval = Math.max(1, Math.floor(30 / speed));
    if (stickmanPhase === 'climbing' && frameCount.current % stepInterval === 0) {
      advanceStep();
    }
    
    // Update energy pulses every frame
    updatePulses();
    
    // Move elevator every 60 frames
    if (frameCount.current % 60 === 0) {
      moveElevator();
    }
  });
  
  return null;
}

function FloorLabels() {
  const showLabels = useSimulation(s => s.showLabels);
  if (!showLabels) return null;
  
  return (
    <>
      {Array.from({ length: 15 }, (_, i) => (
        <Html
          key={i}
          position={[6.5, i * 3.2 + 1.5, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="floor-label-3d">
            T{i + 1}
          </div>
        </Html>
      ))}
      
      {/* QR Check-in label */}
      <Html position={[-3.5, 2, 3.5]} center style={{ pointerEvents: 'none' }}>
        <div className="floor-label-3d" style={{ fontSize: 8, borderColor: 'rgba(34, 211, 238, 0.3)' }}>
          QR Check-in
        </div>
      </Html>
      
      {/* QR Check-out label */}
      <Html position={[-3.5, 2, -3.5]} center style={{ pointerEvents: 'none' }}>
        <div className="floor-label-3d" style={{ fontSize: 8, borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          QR Check-out
        </div>
      </Html>
      
      {/* Energy Storage label */}
      <Html position={[5, 2.2, 4]} center style={{ pointerEvents: 'none' }}>
        <div className="floor-label-3d" style={{ fontSize: 8, borderColor: 'rgba(0, 255, 136, 0.3)' }}>
          Energy Storage
        </div>
      </Html>
      
      {/* Elevator label */}
      <Html position={[4.5, 2, -3]} center style={{ pointerEvents: 'none' }}>
        <div className="floor-label-3d" style={{ fontSize: 8, borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          Elevator
        </div>
      </Html>
      
      {/* Active step callout on floor 1 */}
      <Html position={[-3.5, 1.8, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(6, 182, 212, 0.15)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: 6,
          padding: '4px 8px',
          fontSize: 8,
          color: '#22d3ee',
          textAlign: 'center',
          lineHeight: 1.4,
          maxWidth: 120,
        }}>
          3 active harvesting steps<br />
          7 dummy anti-slip covers<br />
          <span style={{ color: '#94a3b8' }}>same thickness for safety</span>
        </div>
      </Html>
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#0a0e1a' }}
    >
      <PerspectiveCamera makeDefault position={[18, 20, 18]} fov={50} />
      <OrbitControls 
        enableDamping 
        dampingFactor={0.08}
        minDistance={5}
        maxDistance={60}
        maxPolarAngle={Math.PI * 0.85}
        target={[0, 16, 0]}
      />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0e1a', 30, 80]} />
      
      <Building />
      <FloorLabels />
      <SimulationLoop />
    </Canvas>
  );
}
