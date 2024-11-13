import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useClockStore } from '@/store/clock';
import { PlayIcon, PauseIcon, SquareIcon, FlagIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

export function Stopwatch() {
  const { stopwatch, laps, startStopwatch, stopStopwatch, resetStopwatch, addLap } = useClockStore();
  const [displayTime, setDisplayTime] = useState('00:00.00');

  useEffect(() => {
    let intervalId: number;

    if (stopwatch.isRunning) {
      intervalId = window.setInterval(() => {
        const currentTime = Date.now() - (stopwatch.startTime || 0);
        setDisplayTime(formatTime(currentTime));
      }, 10);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [stopwatch.isRunning, stopwatch.startTime]);

  useEffect(() => {
    if (!stopwatch.isRunning) {
      setDisplayTime(formatTime(stopwatch.elapsedTime));
    }
  }, [stopwatch.elapsedTime, stopwatch.isRunning]);

  const getBestLap = () => {
    if (laps.length < 2) return null;
    const lapTimes = laps.map(lap => lap.lapTime);
    const bestTime = Math.min(...lapTimes);
    return lapTimes.indexOf(bestTime);
  };

  const getWorstLap = () => {
    if (laps.length < 2) return null;
    const lapTimes = laps.map(lap => lap.lapTime);
    const worstTime = Math.max(...lapTimes);
    return lapTimes.indexOf(worstTime);
  };

  const bestLapIndex = getBestLap();
  const worstLapIndex = getWorstLap();

  return (
    <Card className="w-full backdrop-blur-sm bg-card/50">
      <CardContent className="p-6">
        <motion.div
          className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          animate={{ scale: stopwatch.isRunning ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 1, repeat: stopwatch.isRunning ? Infinity : 0, repeatType: "reverse" }}
        >
          {displayTime}
        </motion.div>

        <div className="flex justify-center gap-3 mt-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={stopwatch.isRunning ? "destructive" : "default"}
              size="icon"
              onClick={() => {
                if (stopwatch.isRunning) {
                  stopStopwatch();
                } else {
                  startStopwatch();
                }
              }}
            >
              {stopwatch.isRunning ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={resetStopwatch}
              disabled={!stopwatch.elapsedTime}
            >
              <SquareIcon className="h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={addLap}
              disabled={!stopwatch.isRunning}
            >
              <FlagIcon className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        <AnimatePresence>
          {laps.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 overflow-hidden"
            >
              <div
                className="space-y-1.5 max-h-[200px] overflow-y-auto custom-scrollbar pr-3"
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent, black 10px, black 90%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10px, black 90%, transparent)'
                }}
              >
                {laps.map((lap, index) => (
                  <motion.div
                    key={lap.lapNumber}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg transition-colors duration-200",
                      index === bestLapIndex && "bg-primary/10 border border-primary/20",
                      index === worstLapIndex && "bg-destructive/10 border border-destructive/20",
                      index !== bestLapIndex && index !== worstLapIndex && "bg-muted/50 hover:bg-muted/70"
                    )}
                  >
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-xs font-medium">Lap {lap.lapNumber}</span>
                      {index === bestLapIndex && (
                        <span className="text-[10px] text-primary font-medium px-1.5 py-0.5 rounded-full bg-primary/10">
                          Fastest
                        </span>
                      )}
                      {index === worstLapIndex && (
                        <span className="text-[10px] text-destructive font-medium px-1.5 py-0.5 rounded-full bg-destructive/10">
                          Slowest
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-muted-foreground">
                        {formatTime(lap.lapTime)}
                      </span>
                      <span className="font-medium">
                        {formatTime(lap.splitTime)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
