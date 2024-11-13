import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useClockStore } from '@/store/clock';
import { motion } from 'framer-motion';

export function AnalogClock() {
  const [date, setDate] = useState(new Date());
  const { selectedTimeZone } = useClockStore();
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: selectedTimeZone.timeZoneName,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      });

      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: selectedTimeZone.timeZoneName,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const parts = formatter.formatToParts(now);
      const timeObj = parts.reduce((acc, part) => {
        if (part.type !== 'literal') {
          acc[part.type] = parseInt(part.value);
        }
        return acc;
      }, {} as Record<string, number>);

      const newDate = new Date();
      newDate.setHours(timeObj.hour || 0);
      newDate.setMinutes(timeObj.minute || 0);
      newDate.setSeconds(timeObj.second || 0);

      setDate(newDate);
      setCurrentDate(dateFormatter.format(now));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [selectedTimeZone]);

  const seconds = date.getSeconds() * 6;
  const minutes = date.getMinutes() * 6 + seconds / 60;
  const hours = (date.getHours() % 12) * 30 + minutes / 12;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-w-[320px]"
    >
      <Card className="w-full backdrop-blur-sm bg-card/50 p-6">
        <div className="relative w-full pb-[100%]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full rounded-full border-2 border-primary/20 shadow-lg bg-card">
              {/* Minute Markers */}
              {[...Array(60)].map((_, i) => {
                const rotation = i * 6;
                const isHour = i % 5 === 0;

                return (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      height: isHour ? '12px' : '6px',
                      width: isHour ? '2px' : '1px',
                      background: `hsl(var(--primary)/${isHour ? '0.3' : '0.15'})`,
                      left: '50%',
                      top: '2px',
                      transform: `translateX(-50%) rotate(${rotation}deg)`,
                      transformOrigin: '50% 131px',
                    }}
                  />
                );
              })}

              {/* Clock Hands */}
              <motion.div
                className="absolute origin-bottom"
                style={{
                  left: '50%',
                  bottom: '50%',
                  width: '6px',
                  height: '30%',
                  background: 'hsl(var(--primary))',
                  transform: `translateX(-50%) rotate(${hours}deg)`,
                  clipPath: 'polygon(20% 0, 30% 0, 100% 100%, 0 100%)',
                  borderBottomLeftRadius: '2px',
                  borderBottomRightRadius: '2px'
                }}
                transition={{ type: "spring", stiffness: 300 }}
              />

              <motion.div
                className="absolute origin-bottom"
                style={{
                  left: '50%',
                  bottom: '50%',
                  width: '4px',
                  height: '38%',
                  background: 'hsl(var(--primary))',
                  transform: `translateX(-50%) rotate(${minutes}deg)`,
                  clipPath: 'polygon(20% 0, 30% 0, 100% 100%, 0 100%)',
                  borderBottomLeftRadius: '2px',
                  borderBottomRightRadius: '2px'
                }}
                transition={{ type: "spring", stiffness: 300 }}
              />

              <motion.div
                className="absolute origin-bottom"
                style={{
                  left: '50%',
                  bottom: '50%',
                  width: '2px',
                  height: '42%',
                  background: 'hsl(var(--destructive))',
                  transform: `translateX(-50%) rotate(${seconds}deg)`,
                  clipPath: 'polygon(20% 0, 30% 0, 100% 100%, 0 100%)',
                  borderBottomLeftRadius: '1px',
                  borderBottomRightRadius: '1px'
                }}
              />

              {/* Center Dot */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-10"
                whileHover={{ scale: 1.2 }}
              />
            </div>
          </div>
        </div>

        <motion.div
          className="flex flex-col items-center gap-2 mt-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.p
            className="text-sm text-muted-foreground"
            whileHover={{ scale: 1.05 }}
          >
            {currentDate}
          </motion.p>
          <motion.div
            className="px-3 py-1.5 rounded-full bg-muted/50"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs font-medium">
              {selectedTimeZone.name} ({selectedTimeZone.abbr})
            </p>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
