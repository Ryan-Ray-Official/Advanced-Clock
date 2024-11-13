import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useClockStore } from '@/store/clock';
import { motion } from 'framer-motion';

export function DigitalClock() {
  const { selectedTimeZone } = useClockStore();
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: selectedTimeZone.timeZoneName,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: selectedTimeZone.timeZoneName,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      setTime(timeFormatter.format(now));
      setDate(dateFormatter.format(now));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [selectedTimeZone]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md backdrop-blur-sm bg-card/50">
        <CardContent className="flex flex-col items-center p-8">
          <motion.h2
            className="text-6xl font-bold font-mono tracking-wider bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            {time}
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground mt-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {date}
          </motion.p>
          <motion.div
            className="mt-4 px-4 py-2 rounded-full bg-muted/50"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-sm font-medium">
              {selectedTimeZone.name} ({selectedTimeZone.abbr})
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
