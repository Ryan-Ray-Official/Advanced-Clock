export interface TimeZone {
  id: string;
  name: string;
  offset: string;
  abbr: string;
  timeZoneName: string;
}

export enum ClockDisplayMode {
  ANALOG = 'analog',
  DIGITAL = 'digital'
}

export interface StopwatchState {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number;
  laps: number[];
}

export interface ClockState {
  currentTime: Date;
  selectedTimeZone: TimeZone;
  savedTimeZones: TimeZone[];
  displayMode: ClockDisplayMode;
  stopwatch: StopwatchState;
}

export interface LapTime {
  lapNumber: number;
  splitTime: number;
  lapTime: number;
}
