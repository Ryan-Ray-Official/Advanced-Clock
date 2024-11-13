import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '@/components/ui/select';
import { useClockStore } from '@/store/clock';
import { TimeZone } from '@/store/clock';
import { GlobeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const timeZones: Record<string, TimeZone[]> = {
  'North America': [
    { id: 'EST', name: 'Eastern Time', offset: '-05:00', abbr: 'EST', timeZoneName: 'America/New_York' },
    { id: 'CST', name: 'Central Time', offset: '-06:00', abbr: 'CST', timeZoneName: 'America/Chicago' },
    { id: 'MST', name: 'Mountain Time', offset: '-07:00', abbr: 'MST', timeZoneName: 'America/Denver' },
    { id: 'PST', name: 'Pacific Time', offset: '-08:00', abbr: 'PST', timeZoneName: 'America/Los_Angeles' },
    { id: 'AKST', name: 'Alaska Time', offset: '-09:00', abbr: 'AKST', timeZoneName: 'America/Anchorage' },
    { id: 'HST', name: 'Hawaii Time', offset: '-10:00', abbr: 'HST', timeZoneName: 'Pacific/Honolulu' },
  ],
  'Europe': [
    { id: 'GMT', name: 'Greenwich Mean Time', offset: '+00:00', abbr: 'GMT', timeZoneName: 'Europe/London' },
    { id: 'CET', name: 'Central European Time', offset: '+01:00', abbr: 'CET', timeZoneName: 'Europe/Paris' },
    { id: 'EET', name: 'Eastern European Time', offset: '+02:00', abbr: 'EET', timeZoneName: 'Europe/Helsinki' },
  ],
  'Asia & Pacific': [
    { id: 'IST', name: 'India Standard Time', offset: '+05:30', abbr: 'IST', timeZoneName: 'Asia/Kolkata' },
    { id: 'CST_CN', name: 'China Standard Time', offset: '+08:00', abbr: 'CST', timeZoneName: 'Asia/Shanghai' },
    { id: 'JST', name: 'Japan Standard Time', offset: '+09:00', abbr: 'JST', timeZoneName: 'Asia/Tokyo' },
    { id: 'AEST', name: 'Australian Eastern Time', offset: '+10:00', abbr: 'AEST', timeZoneName: 'Australia/Sydney' },
    { id: 'NZST', name: 'New Zealand Standard Time', offset: '+12:00', abbr: 'NZST', timeZoneName: 'Pacific/Auckland' },
  ],
  'Other': [
    { id: 'UTC', name: 'Coordinated Universal Time', offset: '+00:00', abbr: 'UTC', timeZoneName: 'UTC' },
  ]
};

export function TimeZoneSelector() {
  const { selectedTimeZone, setSelectedTimeZone } = useClockStore();

  return (
    <Select
      defaultValue={selectedTimeZone.id}
      onValueChange={(value) => {
        const newZone = Object.values(timeZones)
          .flat()
          .find((tz) => tz.id === value);
        if (newZone) {
          setSelectedTimeZone(newZone);
        }
      }}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <SelectTrigger className="w-full h-[60px] bg-card/50 backdrop-blur-sm border-primary/20 px-4">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <GlobeIcon className="h-5 w-5 text-muted-foreground" />
            </motion.div>
            <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
              <span className="text-base font-medium truncate">
                {selectedTimeZone.name}
              </span>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 w-full">
                <span className="font-mono">{selectedTimeZone.offset}</span>
                <span>•</span>
                <span>{selectedTimeZone.abbr}</span>
              </div>
            </div>
          </motion.div>
        </SelectTrigger>
      </motion.div>
      <SelectContent className="max-h-[300px]">
        <AnimatePresence>
          {Object.entries(timeZones).map(([region, zones]) => (
            <SelectGroup key={region}>
              <SelectLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
                {region}
              </SelectLabel>
              {zones.map((tz) => (
                <motion.div
                  key={tz.id}
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <SelectItem
                    value={tz.id}
                    className="py-2.5"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{tz.name}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="font-mono">{tz.offset}</span>
                        <span>•</span>
                        <span>{tz.abbr}</span>
                      </span>
                    </div>
                  </SelectItem>
                </motion.div>
              ))}
            </SelectGroup>
          ))}
        </AnimatePresence>
      </SelectContent>
    </Select>
  );
}
