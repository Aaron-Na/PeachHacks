import React from 'react';
import { Heart, X } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

interface Profile {
  username: string;
  displayName: string;
  profilePic: string;
  bio: string;
  stats: {
    friends: number;
    playlists: number;
    matches: number;
  };
}

interface ProfileCardProps {
  profile: Profile;
  onLike: () => void;
  onDislike: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onLike, onDislike }) => {
  const [cardSpring, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    scale: 1,
    config: { tension: 300, friction: 20 },
  }));

  const handleDragEnd = (direction: 'left' | 'right') => {
    api.start({
      x: direction === 'right' ? 500 : -500,
      rotate: direction === 'right' ? 30 : -30,
      scale: 0.8,
      onRest: () => {
        if (direction === 'right') {
          onLike();
        } else {
          onDislike();
        }
        api.start({ x: 0, rotate: 0, scale: 1 });
      },
    });
  };

  return (
    <animated.div
      style={cardSpring}
      className="w-full max-w-sm mx-auto"
    >
      <div className="bg-[#1A1A2E] border-2 border-[#C0C0C0] rounded-xl overflow-hidden shadow-xl relative">
        {/* Profile Image */}
        <div className="aspect-square w-full bg-gradient-to-br from-[#7FD1DE] to-[#00B4B4] flex items-center justify-center">
          <span className="text-6xl font-bold text-white pixel-font">{profile.displayName[0]}</span>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-white mb-1 pixel-font glow-text">{profile.displayName}</h3>
            <p className="text-[#C0C0C0] text-sm pixel-body-font">@{profile.username}</p>
          </div>

          <p className="text-white mb-6 text-center pixel-body-font">{profile.bio}</p>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => handleDragEnd('left')}
              className="p-4 bg-[#FF4444]/20 hover:bg-[#FF4444]/40 rounded-full transition-colors"
            >
              <X className="w-8 h-8 text-[#FF4444]" />
            </button>
            <button
              onClick={() => handleDragEnd('right')}
              className="p-4 bg-[#39FF14]/20 hover:bg-[#39FF14]/40 rounded-full transition-colors"
            >
              <Heart className="w-8 h-8 text-[#39FF14]" />
            </button>
          </div>
        </div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 scanline pointer-events-none" />
      </div>
    </animated.div>
  );
};

export default ProfileCard;
