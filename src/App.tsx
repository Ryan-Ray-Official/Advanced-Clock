import { Container, Header } from '@/components/layout';
import { AnalogClock } from '@/components/features/clock/analog';
import { DigitalClock } from '@/components/features/clock/digital';
import { TimeZoneSelector } from '@/components/features/clock/timezone';
import { Stopwatch } from '@/components/features/stopwatch';
import { useClockStore } from '@/store/clock';
import { ClockDisplayMode } from '@/store/clock';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { displayMode } = useClockStore();

  return (
    <Container>
      <Header />

      <div className="grid gap-8 md:grid-cols-[300px,1fr]">
        <div className="space-y-8">
          <motion.div
            className="space-y-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold">Time Zone</h2>
            <TimeZoneSelector />
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold">Stopwatch</h2>
            <Stopwatch />
          </motion.div>
        </div>

        <motion.div
          className="flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={displayMode}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {displayMode === ClockDisplayMode.DIGITAL ? <DigitalClock /> : <AnalogClock />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </Container>
  );
}

export default App;
