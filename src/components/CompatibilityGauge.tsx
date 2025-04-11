import React from 'react';
import { useSpring, animated } from '@react-spring/web';

interface CompatibilityGaugeProps {
  score: number;
}

const CompatibilityGauge: React.FC<CompatibilityGaugeProps> = ({ score }) => {
  const fillAnimation = useSpring({
    from: { width: '0%' },
    to: { width: `${score}%` },
    config: { tension: 280, friction: 60 },
  });

  const getColor = (score: number) => {
    if (score >= 80) return '#39FF14';
    if (score >= 60) return '#00FFFF';
    if (score >= 40) return '#FF80B2';
    return '#FF4444';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-[#C0C0C0] text-sm pixel-body-font">Compatibility</span>
        <span className="text-[#C0C0C0] text-sm pixel-body-font">{score}%</span>
      </div>
      <div className="w-full h-4 bg-[#1A1A2E] border border-[#C0C0C0] rounded-full overflow-hidden">
        <animated.div
          style={{
            ...fillAnimation,
            backgroundColor: getColor(score),
          }}
          className="h-full rounded-full transition-colors"
        />
      </div>
    </div>
  );
};

export default CompatibilityGauge;
