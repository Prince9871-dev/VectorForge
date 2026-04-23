import React from 'react';
import { motion } from 'framer-motion';
import MagicRings from '../ui/MagicRings';
import PremiumButton from '../ui/PremiumButton';
import { ArrowRight, Database } from 'lucide-react';

export default function HeroSection({ onLaunch }) {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden border-b border-border">
      {/* Cinematic React Bits Magic Rings Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-70 pointer-events-none scale-125">
        <div style={{ width: '1200px', height: '800px', position: 'relative' }}>
          <MagicRings
            color="#ffffff"
            colorTwo="#444444"
            ringCount={8}
            speed={0.8}
            attenuation={15}
            lineThickness={1.5}
            baseRadius={0.2}
            radiusStep={0.08}
            scaleRate={0.05}
            opacity={1}
            blur={0}
            noiseAmount={0.05}
            rotation={0}
            ringGap={1.2}
            fadeIn={0.5}
            fadeOut={0.7}
            followMouse={true}
            mouseInfluence={0.05}
            hoverScale={1.05}
            parallax={0.02}
            clickBurst={false}
          />
        </div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-semibold text-textMain tracking-tight leading-[1.1] mb-6 drop-shadow-2xl">
            High-Performance <br />
            <span className="text-textMuted">Vector Intelligence.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#888888] max-w-2xl mx-auto mb-10 font-light tracking-wide">
            High-performance semantic infrastructure fusing custom C++ vector search with real-time local inference. Engineered for absolute speed, precision, and scale.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <PremiumButton onClick={onLaunch}>
              Launch Dashboard <ArrowRight size={16} />
            </PremiumButton>
            <PremiumButton variant="secondary" onClick={() => document.getElementById('architecture').scrollIntoView({ behavior: 'smooth' })}>
              View Architecture
            </PremiumButton>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-bg to-transparent"></div>
    </div>
  );
}
