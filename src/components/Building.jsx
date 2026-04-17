import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSimulation } from '../store/useSimulation';

const FLOOR_HEIGHT = 3.2;
const BUILDING_WIDTH = 12;
const BUILDING_DEPTH = 10;
const STAIR_WIDTH = 2.5;

// Single floor slab
function FloorSlab({ floor }) {
  const y = (floor - 1) * FLOOR_HEIGHT;
  
  return (
    <group position={[0, y, 0]}>
      {/* Floor slab */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[BUILDING_WIDTH, 0.2, BUILDING_DEPTH]} />
        <meshStandardMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.55}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Floor edges glow */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[BUILDING_WIDTH + 0.02, 0.02, BUILDING_DEPTH + 0.02]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Lobby area indicator */}
      <mesh position={[2, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 5]} />
        <meshStandardMaterial 
          color="#0f172a" 
          transparent 
          opacity={0.4}
        />
      </mesh>
      
      {/* Elevator door */}
      <mesh position={[4.5, 1.2, -3]}>
        <boxGeometry args={[1.2, 2.2, 0.1]} />
        <meshStandardMaterial 
          color="#475569" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Elevator door frame */}
      <mesh position={[4.5, 1.2, -2.95]}>
        <boxGeometry args={[1.4, 2.4, 0.05]} />
        <meshStandardMaterial 
          color="#334155" 
          metalness={0.6}
        />
      </mesh>
      
      {/* QR Check-in panel */}
      <mesh position={[-3.5, 1.3, 3.5]}>
        <boxGeometry args={[0.6, 0.8, 0.08]} />
        <meshStandardMaterial 
          color="#0f172a" 
          emissive="#22d3ee"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* QR Check-out panel */}
      <mesh position={[-3.5, 1.3, -3.5]}>
        <boxGeometry args={[0.6, 0.8, 0.08]} />
        <meshStandardMaterial 
          color="#0f172a" 
          emissive="#10b981"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Walls - transparent */}
      {/* Back wall */}
      <mesh position={[0, 1.5, -BUILDING_DEPTH/2]}>
        <boxGeometry args={[BUILDING_WIDTH, FLOOR_HEIGHT - 0.2, 0.08]} />
        <meshStandardMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-BUILDING_WIDTH/2, 1.5, 0]}>
        <boxGeometry args={[0.08, FLOOR_HEIGHT - 0.2, BUILDING_DEPTH]} />
        <meshStandardMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// middle 3 steps are active
const ACTIVE_STEPS = [3, 4, 5];

// Stair flight between two floors
function StairFlight({ fromFloor, side }) {
  const activeStepFlash = useSimulation(s => s.activeStepFlash);
  const currentFloor = useSimulation(s => s.currentFloor);
  const currentStep = useSimulation(s => s.currentStep);
  const isPlaying = useSimulation(s => s.isPlaying);
  
  const baseY = (fromFloor - 1) * FLOOR_HEIGHT;
  const stepHeight = (FLOOR_HEIGHT * 0.45) / 10;
  const stepDepth = 0.28;
  const xOffset = side === 'left' ? -3.5 : -3.5;
  const zStart = side === 'left' ? 2 : -2;
  const zDir = side === 'left' ? -1 : 1;
  
  const isCurrentFlight = currentFloor === fromFloor + (side === 'right' ? 0.5 : 0);
  
  const steps = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const isActive = ACTIVE_STEPS.includes(i);
      return { index: i, isActive };
    });
  }, []);
  
  return (
    <group position={[xOffset, baseY + (side === 'left' ? 0.2 : FLOOR_HEIGHT * 0.45 + 0.2), zStart]}>
      {steps.map((step) => {
        const isFlashing = activeStepFlash === step.index && isCurrentFlight && isPlaying;
        const isBeingStepped = isPlaying && isCurrentFlight && 
          (currentStep % 10) === step.index;
        const stepY = step.index * stepHeight;
        const stepZ = step.index * stepDepth * zDir;
        
        return (
          <group key={step.index} position={[0, stepY, stepZ]}>
            {/* Step */}
            <mesh position={[0, isBeingStepped ? -0.02 : 0, 0]}>
              <boxGeometry args={[STAIR_WIDTH, 0.08, stepDepth]} />
              <meshStandardMaterial 
                color={step.isActive ? '#06b6d4' : '#475569'}
                emissive={step.isActive ? '#06b6d4' : '#1e293b'}
                emissiveIntensity={isFlashing ? 2 : step.isActive ? 0.3 : 0.05}
                metalness={0.4}
                roughness={0.6}
              />
            </mesh>
            
            {/* LED strip on active steps */}
            {step.isActive && (
              <mesh position={[0, 0.05, stepDepth * 0.4]}>
                <boxGeometry args={[STAIR_WIDTH + 0.04, 0.02, 0.02]} />
                <meshStandardMaterial 
                  color="#22d3ee"
                  emissive="#22d3ee"
                  emissiveIntensity={isFlashing ? 3 : 0.5}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}
            
            {/* Step riser */}
            <mesh position={[0, -stepHeight/2, -stepDepth/2]}>
              <boxGeometry args={[STAIR_WIDTH, stepHeight, 0.04]} />
              <meshStandardMaterial 
                color={step.isActive ? '#164e63' : '#334155'}
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Handrail */}
      <mesh position={[STAIR_WIDTH/2 + 0.05, 5 * stepHeight + 0.8, 5 * stepDepth * zDir]}>
        <boxGeometry args={[0.04, 0.04, 10 * stepDepth + 0.2]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-STAIR_WIDTH/2 - 0.05, 5 * stepHeight + 0.8, 5 * stepDepth * zDir]}>
        <boxGeometry args={[0.04, 0.04, 10 * stepDepth + 0.2]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Landing platform between flights
function Landing({ floor }) {
  const gatewayFlash = useSimulation(s => s.gatewayFlash);
  const currentFloor = useSimulation(s => s.currentFloor);
  const isNear = currentFloor === floor;
  
  const y = (floor - 1) * FLOOR_HEIGHT + FLOOR_HEIGHT * 0.45 + 0.2;
  
  return (
    <group position={[-3.5, y, 0]}>
      {/* Landing platform */}
      <mesh>
        <boxGeometry args={[STAIR_WIDTH, 0.1, 2.5]} />
        <meshStandardMaterial 
          color="#1e293b"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Gateway/Controller box */}
      <mesh position={[1.5, 0.3, 0]}>
        <boxGeometry args={[0.4, 0.5, 0.3]} />
        <meshStandardMaterial 
          color="#1e293b"
          emissive={gatewayFlash && isNear ? '#22d3ee' : '#1e3a5f'}
          emissiveIntensity={gatewayFlash && isNear ? 2 : 0.3}
          metalness={0.5}
        />
      </mesh>
      
      {/* Gateway LED indicator */}
      <mesh position={[1.5, 0.6, 0.16]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial 
          color={gatewayFlash && isNear ? '#00ff88' : '#3b82f6'}
          emissive={gatewayFlash && isNear ? '#00ff88' : '#3b82f6'}
          emissiveIntensity={gatewayFlash && isNear ? 3 : 0.5}
        />
      </mesh>
    </group>
  );
}

// Energy storage unit
function EnergyStorage() {
  const energyGenerated = useSimulation(s => s.energyGenerated);
  const maxEnergy = 2; // for visualization
  const fillLevel = Math.min(energyGenerated / maxEnergy, 1);
  
  return (
    <group position={[5, 0.2, 4]}>
      {/* Battery casing */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.2, 1.5, 0.8]} />
        <meshStandardMaterial 
          color="#1e293b"
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Energy fill level */}
      <mesh position={[0, 0.1 + fillLevel * 0.7, 0]}>
        <boxGeometry args={[1.1, fillLevel * 1.4, 0.7]} />
        <meshStandardMaterial 
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.5 + fillLevel}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Connection cables */}
      <mesh position={[-0.3, 1.6, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Battery terminal */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>
    </group>
  );
}

// Elevator cabin
function ElevatorCabin() {
  const elevatorFloor = useSimulation(s => s.elevatorFloor);
  const showElevator = useSimulation(s => s.showElevator);
  
  if (!showElevator) return null;
  
  const y = (elevatorFloor - 1) * FLOOR_HEIGHT + 1.2;
  
  return (
    <group position={[4.5, y, -3]}>
      {/* Cabin body */}
      <mesh>
        <boxGeometry args={[1, 2.2, 1.2]} />
        <meshStandardMaterial 
          color="#334155"
          metalness={0.5}
          roughness={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Cabin interior light */}
      <pointLight 
        position={[0, 0.8, 0]} 
        color="#fbbf24"
        intensity={0.5}
        distance={2}
      />
      
      {/* Cable */}
      <mesh position={[0, 15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 30, 4]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  );
}

// Elevator shaft
function ElevatorShaft() {
  const showElevator = useSimulation(s => s.showElevator);
  if (!showElevator) return null;
  
  return (
    <group position={[4.5, 24, -3]}>
      <mesh>
        <boxGeometry args={[1.4, 48, 1.6]} />
        <meshStandardMaterial 
          color="#1e293b"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Guide rails */}
      <mesh position={[0.6, 0, 0]}>
        <boxGeometry args={[0.04, 48, 0.04]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      <mesh position={[-0.6, 0, 0]}>
        <boxGeometry args={[0.04, 48, 0.04]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
    </group>
  );
}

// Stickman character
function Stickman() {
  const { stickmanY, stickmanPhase, stickmanLegPhase, isPlaying } = useSimulation();
  
  if (!isPlaying && stickmanPhase === 'idle') return null;
  
  const yPos = stickmanY + 0.6;
  const legAngle = stickmanPhase === 'climbing' ? 
    (stickmanLegPhase === 0 ? 0.3 : -0.3) : 0;
  
  const armAngle = stickmanPhase === 'scanning' ? -1.2 : 
    (stickmanPhase === 'climbing' ? -legAngle * 0.5 : 0);
  
  return (
    <group position={[-3.5, yPos, 1.5]}>
      {/* Head */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial 
          color="#f59e0b" 
          emissive="#f59e0b"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.5, 8]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      {/* Left leg */}
      <group position={[-0.06, 0.1, 0]} rotation={[legAngle, 0, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} />
          <meshStandardMaterial color="#1e40af" />
        </mesh>
      </group>
      
      {/* Right leg */}
      <group position={[0.06, 0.1, 0]} rotation={[-legAngle, 0, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} />
          <meshStandardMaterial color="#1e40af" />
        </mesh>
      </group>
      
      {/* Left arm */}
      <group position={[-0.12, 0.5, 0]} rotation={[armAngle, 0, 0]}>
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.25, 6]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
      </group>
      
      {/* Right arm */}
      <group position={[0.12, 0.5, 0]} rotation={[-armAngle * 0.5, 0, 0]}>
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.25, 6]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
      </group>
      
      {/* Phone (when scanning) */}
      {stickmanPhase === 'scanning' && (
        <mesh position={[-0.12, 0.72, 0.15]}>
          <boxGeometry args={[0.06, 0.1, 0.01]} />
          <meshStandardMaterial 
            color="#0f172a"
            emissive="#22d3ee"
            emissiveIntensity={1}
          />
        </mesh>
      )}
      
      {/* Glow effect */}
      <pointLight 
        position={[0, 0.5, 0]}
        color="#3b82f6"
        intensity={0.3}
        distance={1.5}
      />
    </group>
  );
}

// Energy flow visualization
function EnergyFlowLines() {
  const showEnergyFlow = useSimulation(s => s.showEnergyFlow);
  const energyPulses = useSimulation(s => s.energyPulses);
  
  if (!showEnergyFlow) return null;
  
  return (
    <group>
      {/* Main energy conduit line from staircase to storage */}
      <mesh position={[0.5, 24, 2]}>
        <cylinderGeometry args={[0.03, 0.03, 48, 4]} />
        <meshStandardMaterial 
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.4}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Horizontal conduit to energy storage */}
      <mesh position={[2.75, 0.5, 3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 4.5, 4]} />
        <meshStandardMaterial 
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.4}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Animated pulses */}
      {energyPulses.map((pulse) => (
        <mesh 
          key={pulse.id}
          position={[0.5, pulse.progress * 48, 2]}
        >
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial 
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={3}
            transparent
            opacity={1 - pulse.progress}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main building component
export default function Building() {
  const totalFloors = 15;
  
  return (
    <group>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 10, -5]} intensity={0.3} color="#3b82f6" />
      
      {/* Point lights for atmosphere */}
      <pointLight position={[0, 25, 0]} intensity={0.5} color="#3b82f6" distance={60} />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#22d3ee" distance={15} />
      
      {/* Ground plane */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial 
          color="#0a0e1a"
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>
      
      {/* Grid on ground */}
      <gridHelper args={[30, 30, '#1e293b', '#1e293b']} position={[0, 0.01, 0]} />
      
      {/* Floor slabs */}
      {Array.from({ length: totalFloors }, (_, i) => (
        <FloorSlab key={i} floor={i + 1} />
      ))}
      
      {/* Stair flights */}
      {Array.from({ length: totalFloors - 1 }, (_, i) => (
        <React.Fragment key={i}>
          <StairFlight fromFloor={i + 1} side="left" />
          <StairFlight fromFloor={i + 1} side="right" />
          <Landing floor={i + 1} />
        </React.Fragment>
      ))}
      
      {/* Elevator */}
      <ElevatorShaft />
      <ElevatorCabin />
      
      {/* Energy storage */}
      <EnergyStorage />
      
      {/* Energy flow lines */}
      <EnergyFlowLines />
      
      {/* Stickman */}
      <Stickman />
      
      {/* Building top cap */}
      <mesh position={[0, totalFloors * FLOOR_HEIGHT, 0]}>
        <boxGeometry args={[BUILDING_WIDTH + 0.5, 0.3, BUILDING_DEPTH + 0.5]} />
        <meshStandardMaterial 
          color="#1e293b"
          metalness={0.4}
        />
      </mesh>
    </group>
  );
}
