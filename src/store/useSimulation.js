import { create } from 'zustand';

const STEPS_PER_FLIGHT = 10;
const ACTIVE_STEPS = [3, 4, 5]; // 0-indexed: steps 4,5,6 are active (middle 3)
const ENERGY_PER_STEP = 0.0035; // kWh per active step
const CALORIES_PER_STEP = 0.17;

const generateLeaderboard = () => [
  { name: 'Nguyễn Văn An', dept: 'CNTT', steps: 4820, energy: 5.06, rank: 1, badge: 'Top Climber' },
  { name: 'Trần Thị Bình', dept: 'Kinh tế', steps: 4510, energy: 4.73, rank: 2, badge: 'Active Week' },
  { name: 'Lê Hoàng Cường', dept: 'Quản trị', steps: 4200, energy: 4.41, rank: 3, badge: 'Green Hero' },
  { name: 'Phạm Minh Đức', dept: 'Marketing', steps: 3890, energy: 4.08, rank: 4, badge: 'No-Elevator' },
  { name: 'Võ Thị Em', dept: 'Tài chính', steps: 3650, energy: 3.83, rank: 5, badge: 'Streak 7' },
  { name: 'Hoàng Văn Phúc', dept: 'Luật', steps: 3400, energy: 3.57, rank: 6, badge: '' },
  { name: 'Đỗ Thị Giang', dept: 'CNTT', steps: 3100, energy: 3.26, rank: 7, badge: '' },
  { name: 'Bùi Văn Hải', dept: 'Kinh tế', steps: 2800, energy: 2.94, rank: 8, badge: '' },
  { name: 'Ngô Thị Iyên', dept: 'Quản trị', steps: 2500, energy: 2.63, rank: 9, badge: '' },
  { name: 'Cao Văn Kiệt', dept: 'Marketing', steps: 2200, energy: 2.31, rank: 10, badge: '' },
];

const generateDeptLeaderboard = () => [
  { name: 'Khoa CNTT', steps: 28500, members: 120, rank: 1 },
  { name: 'Khoa Kinh tế', steps: 25200, members: 150, rank: 2 },
  { name: 'Khoa Quản trị', steps: 22800, members: 95, rank: 3 },
];

const communityGoals = [
  { id: 1, name: 'Thắp sáng sảnh A', target: 50000, current: 38500, icon: '💡', reward: 'Đèn LED khu vực A' },
  { id: 2, name: 'Quỹ hỗ trợ SV', target: 100000, current: 67200, icon: '🎓', reward: '2 triệu VNĐ' },
  { id: 3, name: 'Cây xanh campus', target: 75000, current: 42100, icon: '🌳', reward: '10 cây xanh mới' },
  { id: 4, name: 'Challenge liên khoa', target: 200000, current: 128000, icon: '🏆', reward: 'Trophy + Banner' },
];

let notifId = 0;

export const useSimulation = create((set, get) => ({
  // Simulation state
  isPlaying: false,
  isPaused: false,
  isComplete: false,
  speed: 1,
  startFloor: 1,
  endFloor: 5,
  userType: 'student',
  
  // Stickman state
  currentFloor: 1,
  currentStep: 0,
  totalStepsWalked: 0,
  activeStepsTriggered: 0,
  energyGenerated: 0,
  caloriesBurned: 0,
  
  // Stickman animation state
  stickmanPhase: 'idle', // idle, scanning, climbing, resting, checkout, complete
  stickmanY: 0,
  stickmanLegPhase: 0,
  
  // Active step effects
  activeStepFlash: null,
  energyPulses: [],
  gatewayFlash: false,
  
  // Building / view
  viewMode: 'cutaway',
  focusFloor: null,
  showLabels: true,
  showEnergyFlow: true,
  showLeaderboard: false, // removed from viewport, only in phone
  showElevator: true,
  showTechnicalOverlay: false,
  showAppPanel: true,
  
  // Elevator
  elevatorFloor: 1,
  elevatorDirection: 'idle',
  elevatorOccupancy: 8,
  elevatorMaxOccupancy: 15,
  elevatorWaitTime: 45,
  elevatorETA: {},
  
  // Dashboard data
  todaySessions: 147,
  todayTotalSteps: 38500,
  todayTotalEnergy: 40.43,
  currentClimbers: 12,
  
  // Leaderboard
  leaderboard: generateLeaderboard(),
  deptLeaderboard: generateDeptLeaderboard(),
  communityGoals: communityGoals,
  
  // Session summary
  sessionSummary: null,
  
  // App phone state
  appScreen: 'home',
  
  // Demo mode
  demoMode: null,
  
  // Mascot
  mascotMessage: null,
  mascotVisible: false,
  
  // Notifications (shown on phone)
  notifications: [],
  
  // Floor heatmap data
  floorHeatmap: Array.from({ length: 15 }, (_, i) => ({
    floor: i + 1,
    climbCount: Math.floor(Math.random() * 200) + 50,
    energyGenerated: (Math.random() * 5 + 1).toFixed(2),
    elevatorWait: Math.floor(Math.random() * 60) + 15,
  })),
  
  // Actions
  setStartFloor: (floor) => set({ startFloor: floor }),
  setEndFloor: (floor) => set({ endFloor: floor }),
  setUserType: (type) => set({ userType: type }),
  setSpeed: (speed) => set({ speed }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setFocusFloor: (floor) => set({ focusFloor: floor }),
  toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),
  toggleEnergyFlow: () => set((s) => ({ showEnergyFlow: !s.showEnergyFlow })),
  toggleLeaderboard: () => set((s) => ({ showLeaderboard: !s.showLeaderboard })),
  toggleElevator: () => set((s) => ({ showElevator: !s.showElevator })),
  toggleTechnicalOverlay: () => set((s) => ({ showTechnicalOverlay: !s.showTechnicalOverlay })),
  toggleAppPanel: () => set((s) => ({ showAppPanel: !s.showAppPanel })),
  setAppScreen: (screen) => set({ appScreen: screen }),
  setDemoMode: (mode) => set({ demoMode: mode }),
  
  // Push notification to phone
  pushNotification: (title, message, type = 'info', icon = '📌') => {
    const id = ++notifId;
    set((s) => ({
      notifications: [...s.notifications, { id, title, message, type, icon, time: Date.now() }],
    }));
    // Auto-dismiss after 5s
    setTimeout(() => {
      get().dismissNotification(id);
    }, 5000);
  },
  
  dismissNotification: (id) => {
    set((s) => ({
      notifications: s.notifications.filter(n => n.id !== id),
    }));
  },
  
  showMascot: (message) => {
    set({ mascotVisible: true, mascotMessage: message });
    setTimeout(() => set({ mascotVisible: false, mascotMessage: null }), 3000);
  },
  
  startSimulation: () => {
    const state = get();
    set({
      isPlaying: true,
      isPaused: false,
      isComplete: false,
      currentFloor: state.startFloor,
      currentStep: 0,
      totalStepsWalked: 0,
      activeStepsTriggered: 0,
      energyGenerated: 0,
      caloriesBurned: 0,
      stickmanPhase: 'scanning',
      stickmanY: (state.startFloor - 1) * 3.2,
      sessionSummary: null,
      activeStepFlash: null,
      energyPulses: [],
      gatewayFlash: false,
      appScreen: 'session',
    });
    
    // Push notification
    setTimeout(() => {
      get().pushNotification(
        'Check-in thành công',
        `Session T${state.startFloor} → T${state.endFloor} đã bắt đầu`,
        'success',
        '✅'
      );
    }, 300);
    
    // Show mascot
    setTimeout(() => {
      get().showMascot('Bắt đầu leo thang! Cố lên! 💪');
    }, 500);
    
    // After scanning animation, start climbing
    setTimeout(() => {
      set({ stickmanPhase: 'climbing' });
      get().pushNotification(
        'Đang leo thang',
        'Mỗi bước trên active step sẽ thu năng lượng!',
        'info',
        '🏃'
      );
    }, 2000 / state.speed);
  },
  
  pauseSimulation: () => set({ isPaused: true }),
  resumeSimulation: () => set({ isPaused: false }),
  
  resetSimulation: () => set({
    isPlaying: false,
    isPaused: false,
    isComplete: false,
    currentFloor: 1,
    currentStep: 0,
    totalStepsWalked: 0,
    activeStepsTriggered: 0,
    energyGenerated: 0,
    caloriesBurned: 0,
    stickmanPhase: 'idle',
    stickmanY: 0,
    sessionSummary: null,
    activeStepFlash: null,
    energyPulses: [],
    gatewayFlash: false,
    demoMode: null,
    notifications: [],
  }),
  
  // Called each animation frame during climbing
  advanceStep: () => {
    const state = get();
    if (!state.isPlaying || state.isPaused || state.isComplete) return;
    if (state.stickmanPhase !== 'climbing') return;
    
    const nextStep = state.currentStep + 1;
    const isActiveStep = ACTIVE_STEPS.includes(state.currentStep % STEPS_PER_FLIGHT);
    
    let updates = {
      currentStep: nextStep,
      totalStepsWalked: state.totalStepsWalked + 1,
      caloriesBurned: state.caloriesBurned + CALORIES_PER_STEP,
      stickmanLegPhase: (state.stickmanLegPhase + 1) % 2,
    };
    
    if (isActiveStep) {
      updates.activeStepsTriggered = state.activeStepsTriggered + 1;
      updates.energyGenerated = +(state.energyGenerated + ENERGY_PER_STEP).toFixed(4);
      updates.activeStepFlash = state.currentStep % STEPS_PER_FLIGHT;
      updates.gatewayFlash = true;
      
      // Add energy pulse
      updates.energyPulses = [...state.energyPulses, {
        id: Date.now(),
        fromStep: state.currentStep % STEPS_PER_FLIGHT,
        progress: 0,
      }];
      
      // Push energy notification (throttled — only every 3rd active step)
      if (updates.activeStepsTriggered % 3 === 0) {
        get().pushNotification(
          'Năng lượng thu hoạch!',
          `+${ENERGY_PER_STEP * 3} kWh từ 3 active steps`,
          'energy',
          '⚡'
        );
      }
      
      // Clear flash after delay
      setTimeout(() => {
        set({ activeStepFlash: null, gatewayFlash: false });
      }, 500 / state.speed);
    }
    
    // Update Y position
    updates.stickmanY = (state.currentFloor - 1) * 3.2 + (nextStep % STEPS_PER_FLIGHT) * 0.28;
    
    // Check if completed a flight (10 steps)
    if (nextStep % STEPS_PER_FLIGHT === 0 && nextStep > 0) {
      const newFloor = state.currentFloor + 1;
      
      if (newFloor > state.endFloor) {
        // Reached destination
        updates.stickmanPhase = 'checkout';
        updates.currentFloor = state.endFloor;
        
        setTimeout(() => {
          const s = get();
          const summary = {
            startFloor: s.startFloor,
            endFloor: s.endFloor,
            totalSteps: s.totalStepsWalked,
            activeSteps: s.activeStepsTriggered,
            energy: s.energyGenerated,
            calories: s.caloriesBurned,
            rank: 6 - Math.min(5, Math.floor(s.totalStepsWalked / 10)),
            points: s.totalStepsWalked * 2 + s.activeStepsTriggered * 5,
            contribution: s.energyGenerated,
          };
          set({
            isComplete: true,
            stickmanPhase: 'complete',
            sessionSummary: summary,
            appScreen: 'session',
            todaySessions: s.todaySessions + 1,
            todayTotalSteps: s.todayTotalSteps + s.totalStepsWalked,
            todayTotalEnergy: +(s.todayTotalEnergy + s.energyGenerated).toFixed(2),
          });
          
          // Push completion notification
          s.pushNotification(
            'Session hoàn thành!',
            `+${summary.points} điểm · ${summary.energy.toFixed(4)} kWh · Rank #${summary.rank}`,
            'success',
            '🎉'
          );
          
          s.showMascot('Hoàn thành! Bạn thật tuyệt vời! 🎉');
        }, 1500 / state.speed);
      } else {
        updates.currentFloor = newFloor;
        updates.stickmanPhase = 'resting';
        updates.stickmanY = (newFloor - 1) * 3.2;
        
        // Push floor notification
        get().pushNotification(
          `Đến tầng ${newFloor}`,
          `Còn ${state.endFloor - newFloor} tầng nữa`,
          'info',
          '🏢'
        );
        
        // Show mascot at midway
        const totalFloors = state.endFloor - state.startFloor;
        const floorsClimbed = newFloor - state.startFloor;
        if (floorsClimbed === Math.floor(totalFloors / 2)) {
          get().showMascot(`Cố lên, còn ${state.endFloor - newFloor} tầng nữa!`);
        }
        
        // Resume climbing after rest
        setTimeout(() => {
          set({ stickmanPhase: 'climbing' });
        }, 800 / state.speed);
      }
    }
    
    set(updates);
  },
  
  // Update energy pulses
  updatePulses: () => {
    set((s) => ({
      energyPulses: s.energyPulses
        .map(p => ({ ...p, progress: p.progress + 0.02 * s.speed }))
        .filter(p => p.progress < 1),
    }));
  },
  
  // Elevator animation
  moveElevator: () => {
    set((s) => {
      const targetFloor = Math.floor(Math.random() * 15) + 1;
      if (s.elevatorFloor < targetFloor) {
        return { elevatorFloor: s.elevatorFloor + 0.05, elevatorDirection: 'up' };
      } else if (s.elevatorFloor > targetFloor) {
        return { elevatorFloor: s.elevatorFloor - 0.05, elevatorDirection: 'down' };
      }
      return { elevatorDirection: 'idle' };
    });
  },
}));
