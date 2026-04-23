import React from 'react';
import { motion } from 'framer-motion';

export default function PremiumButton({ children, onClick, variant = 'primary', className = '' }) {
  const baseStyle = "px-6 py-3 rounded-full font-medium text-sm transition-all flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-white text-black hover:bg-[#f0f0f0] shadow-[0_0_25px_rgba(255,255,255,0.2)] border-none",
    secondary: "bg-[#111111] border border-[#222222] text-[#ededed] hover:bg-[#1a1a1a]",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
