import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useClockStore, ClockDisplayMode } from '@/store/clock';

export function Header() {
  const { displayMode } = useClockStore();
  const { setTheme, resolvedTheme } = useTheme();

  const toggleDisplayMode = () => {
    useClockStore.setState({
      displayMode:
        displayMode === ClockDisplayMode.DIGITAL
          ? ClockDisplayMode.ANALOG
          : ClockDisplayMode.DIGITAL,
    });
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center"
    >
      <motion.h1
        className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        World Clock
      </motion.h1>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          {resolvedTheme === 'dark' ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </Button>
        <Button onClick={toggleDisplayMode} variant="outline">
          Switch to {displayMode === ClockDisplayMode.DIGITAL ? 'Analog' : 'Digital'}
        </Button>
      </div>
    </motion.div>
  );
}
