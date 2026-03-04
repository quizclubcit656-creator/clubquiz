import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard = ({ children, className = '', hoverEffect = true }: GlassCardProps) => {
  return (
    <motion.div
      className={`glass-card ${className}`}
      whileHover={hoverEffect ? { scale: 1.02, boxShadow: '0 0 30px rgba(245, 179, 1, 0.3)' } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
