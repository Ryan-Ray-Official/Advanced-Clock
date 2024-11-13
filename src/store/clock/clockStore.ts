import { create } from 'zustand';
import { ClockState, ClockDisplayMode, TimeZone, LapTime } from './types';

const defaultTimeZone: TimeZone = {
  id: 'UTC',
  name: 'Coordinated Universal Time',
  offset: '+00:00',
  abbr: 'UTC',
  timeZoneName: 'UTC'
};

interface ClockStore extends ClockState {
  setSelectedTimeZone: (timezone: TimeZone) => void;
  startStopwatch: () => void;
  stopStopwatch: () => void;
  resetStopwatch: () => void;
  addLap: () => void;
  laps: LapTime[];
}

interface StoredState {
  selectedTimeZone: TimeZone;
  savedTimeZones: TimeZone[];
  displayMode: ClockDisplayMode;
}

const STORAGE_KEY = 'world-clock-state';

const loadState = (): Partial<StoredState> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveState = (state: StoredState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.error('Error saving state to localStorage');
  }
};

const storedState = loadState();

const useClockStore = create<ClockStore>((set, get) => ({
  currentTime: new Date(),
  selectedTimeZone: storedState.selectedTimeZone || defaultTimeZone,
  savedTimeZones: storedState.savedTimeZones || [defaultTimeZone],
  displayMode: storedState.displayMode || ClockDisplayMode.DIGITAL,
  stopwatch: {
    isRunning: false,
    startTime: null,
    elapsedTime: 0,
    laps: []
  },
  laps: [],
  setSelectedTimeZone: (timezone: TimeZone) => {
    set((state) => {
      const newState = { ...state, selectedTimeZone: timezone };
      saveState({
        selectedTimeZone: timezone,
        savedTimeZones: newState.savedTimeZones,
        displayMode: newState.displayMode,
      });
      return newState;
    });
  },
  startStopwatch: () => {
    const now = Date.now();
    const { stopwatch } = get();
    set({
      stopwatch: {
        ...stopwatch,
        isRunning: true,
        startTime: now - (stopwatch.elapsedTime || 0)
      }
    });
  },
  stopStopwatch: () => {
    const { stopwatch } = get();
    if (stopwatch.startTime) {
      set({
        stopwatch: {
          ...stopwatch,
          isRunning: false,
          elapsedTime: Date.now() - stopwatch.startTime
        }
      });
    }
  },
  resetStopwatch: () => {
    set({
      stopwatch: {
        isRunning: false,
        startTime: null,
        elapsedTime: 0,
        laps: []
      },
      laps: []
    });
  },
  addLap: () => {
    const { stopwatch, laps } = get();
    if (stopwatch.startTime) {
      const currentTime = Date.now() - stopwatch.startTime;
      const previousLapTime = laps[laps.length - 1]?.splitTime || 0;
      const lapTime = currentTime - previousLapTime;

      set({
        laps: [
          ...laps,
          {
            lapNumber: laps.length + 1,
            splitTime: currentTime,
            lapTime: lapTime
          }
        ]
      });
    }
  }
}));

export default useClockStore;
