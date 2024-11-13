import { motion } from 'framer-motion';

interface ContainerProps {
  children: React.ReactNode;
}

export function Container({ children }: ContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background transition-colors duration-300"
    >
      <div className="container py-8 px-4 mx-auto max-w-5xl">
        <div className="flex flex-col gap-8">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
