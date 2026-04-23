import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`bg-surface/60 backdrop-blur-md border border-border rounded-xl p-6 shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
