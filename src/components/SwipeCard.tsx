import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

interface Profile {
  name: string;
  img: string;
}

interface Props {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
}

const SwipeCard: React.FC<Props> = ({ profile, onSwipe }) => {
  const [gone, setGone] = useState(false);

  const [{ x, y, rotate }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    config: { tension: 300, friction: 20 }
  }));

  const bind = useDrag(({ movement: [mx], velocity: [vx], direction: [xDir], down, tap }) => {
    const trigger = Math.abs(mx) > 100 || (Math.abs(vx) > 0.5 && !down);
    const dir = xDir < 0 ? -1 : 1;

    if (!down && trigger && !gone) {
      setGone(true);
      onSwipe(dir > 0 ? 'right' : 'left');
    }

    api.start({
      x: down ? mx : trigger ? (200 + window.innerWidth) * dir : 0,
      y: down ? 0 : 0,
      rotate: down || trigger ? mx / 10 : 0,
      immediate: down
    });
  });

  return (
    <animated.div
      {...bind()}
      style={{
        transform: 'perspective(2000px)',
        x,
        y,
        rotate,
        touchAction: 'none'
      }}
      className="absolute w-full cursor-grab active:cursor-grabbing"
    >
      <div className="bg-white rounded-2xl shadow-md w-80 overflow-hidden">
        <img
          src={profile.img}
          alt={profile.name}
          className="w-full h-96 object-cover"
        />
        <div className="p-6 bg-gradient-to-b from-[#1A1A2E] to-[#2A2A3E]">
          <h2 className="text-2xl font-semibold text-white pixel-font">{profile.name}</h2>
          <div className="flex justify-center mt-4 space-x-4">
            <div className="music-bars">
              <div className="bar bar1"></div>
              <div className="bar bar2"></div>
              <div className="bar bar3"></div>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default SwipeCard;
