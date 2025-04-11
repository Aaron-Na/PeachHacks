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
        <div className="aspect-square w-full bg-gradient-to-br from-[#7FD1DE] to-[#00B4B4] flex items-center justify-center overflow-hidden relative">
          {/* Glossy overlay effect - Y2K style */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent z-10"></div>
          {profile.profilePic ? (
            <img 
              src={profile.profilePic} 
              alt={`${profile.displayName}'s profile`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E63B3F] to-[#72BEFD] relative">
              {/* Glossy overlay for gradient background */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
              {/* Y2K style bubble effect */}
              <div className="absolute inset-0 bubble-pattern opacity-20"></div>
              {/* First initial of name */}
              <span className="text-8xl font-bold text-white pixel-font z-10 glow-text">
                {profile.displayName[0]}
              </span>
              {/* Additional Y2K style elements */}
              <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-white/20 blur-sm"></div>
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/20 blur-sm"></div>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-white mb-1 pixel-font glow-text">{profile.displayName}</h3>
            <p className="text-[#C0C0C0] text-sm pixel-body-font">@{profile.username}</p>
          </div>

          <p className="text-white mb-6 text-left pixel-body-font whitespace-pre-line">{profile.bio}</p>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => handleDragEnd('left')}
              className="p-4 bg-[#E63B3F]/20 hover:bg-[#E63B3F]/40 rounded-full transition-colors glass-panel"
            >
              <X className="w-8 h-8 text-[#E63B3F]" />
            </button>
            <button
              onClick={() => handleDragEnd('right')}
              className="p-4 bg-[#72BEFD]/20 hover:bg-[#72BEFD]/40 rounded-full transition-colors glass-panel"
            >
              <Heart className="w-8 h-8 text-[#72BEFD]" />
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
