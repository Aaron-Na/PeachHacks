import { useState } from "react";
import { useSpring, animated } from '@react-spring/web';
import { Music2, ArrowLeft, Star, Heart, Square, PlusSquare } from 'lucide-react';
import { Link } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import CompatibilityGauge from "../components/CompatibilityGauge";

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

interface Match {
  profile: Profile;
  compatibility: number;
}

const mockProfiles: Profile[] = [
  {
    username: "Alice_y2k",
    displayName: "Alice",
    profilePic: "./static/profile_images/asian-woman-posing-looking-camera_23-2148255359.webp",
    bio: "top 5 artists: Spice Girls, Backstreet Boys, Britney Spears, *NSYNC, Destiny's Child\nlocation: Cyber Valley, CA\nage: 24\nfavorite song: \"...Baby One More Time\"",
    stats: { friends: 35, playlists: 8, matches: 15 }
  },
  {
    username: "Bob_y2k",
    displayName: "Bob",
    profilePic: "./static/profile_images/man-6477129_640.webp",
    bio: "top 5 artists: Linkin Park, Blink-182, Green Day, No Doubt, Red Hot Chili Peppers\nlocation: Digital Heights, NY\nage: 26\nfavorite song: \"In The End\"",
    stats: { friends: 28, playlists: 12, matches: 20 }
  },
  {
    username: "Charlie_y2k",
    displayName: "Charlie",
    profilePic: "./static/profile_images/portrait-bangladeshi-man_53876-39178.webp",
    bio: "top 5 artists: Aaliyah, TLC, Usher, Alicia Keys, Mariah Carey\nlocation: Soul Valley, GA\nage: 25\nfavorite song: \"No Scrubs\"",
    stats: { friends: 45, playlists: 15, matches: 25 }
  }
];

// Simplified compatibility calculation
const calculateCompatibility = (): number => {
  // For demo purposes, generate a random compatibility score
  return Math.floor(Math.random() * 100);
};

// Component for Y2K geometric shapes floating around
const FloatingShapes = () => {
  const shapes = [
    { type: Star, color: '#ff77aa', size: 24, position: { top: '15%', left: '10%' }, delay: 0 },
    { type: Heart, color: '#3adfd4', size: 28, position: { top: '25%', right: '15%' }, delay: 1 },
    { type: Star, color: '#33a7ff', size: 20, position: { bottom: '20%', left: '15%' }, delay: 2 },
    { type: Square, color: '#7f5fc5', size: 22, position: { bottom: '30%', right: '10%' }, delay: 1.5 },
    { type: PlusSquare, color: '#ff77aa', size: 26, position: { top: '40%', left: '20%' }, delay: 0.5 },
    { type: Star, color: '#2bc610', size: 18, position: { bottom: '45%', right: '25%' }, delay: 2.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {shapes.map((shape, i) => (
        <shape.type
          key={i}
          className="floating-shape absolute"
          style={{
            top: shape.position.top,
            left: shape.position.left,
            color: shape.color,
            fontSize: shape.size,
            animationDelay: `${shape.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const RandomSparkles = ({ count = 15 }) => {
  const sparkles = [];
  
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 4 + 2;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const delay = Math.random() * 3;
    const duration = Math.random() * 2 + 1;
    
    sparkles.push(
      <div
        key={i}
        className="sparkle"
        style={{
          width: size + 'px',
          height: size + 'px',
          top: top + 'vh',
          left: left + 'vw',
          animationDelay: delay + 's',
          animationDuration: duration + 's',
          background: `radial-gradient(circle, #ff77aa 0%, #3adfd4 100%)`,
        }}
      />
    );
  }
  
  return <div className="fixed inset-0 pointer-events-none z-10">{sparkles}</div>;
};

const MatchMaker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<Match[]>([]);

  // Page fade-in animation
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 },
    delay: 100,
  });

  const randomizeProfile = () => {
    let nextIndex = Math.floor(Math.random() * mockProfiles.length);
    while (nextIndex === currentIndex && mockProfiles.length > 1) {
      nextIndex = Math.floor(Math.random() * mockProfiles.length);
    }
    setCurrentIndex(nextIndex);
  };

  const handleLike = () => {
    const currentProfile = mockProfiles[currentIndex];
    const compatibility = calculateCompatibility();
    setLikedProfiles(prev => [...prev, { profile: currentProfile, compatibility }]);
    console.log("Liked:", currentProfile.displayName, "Compatibility:", compatibility + "%");
    randomizeProfile();
  };

  const handleDislike = () => {
    const currentProfile = mockProfiles[currentIndex];
    console.log("Disliked:", currentProfile.displayName);
    randomizeProfile();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-deep-space">
      {/* Background Elements */}
      <div className="grid-overlay absolute inset-0" />
      <div className="scanline absolute inset-0" />
      <div className="bg-gradient absolute inset-0 opacity-70" />
      
      {/* Y2K Background Elements */}
      <FloatingShapes />
      <RandomSparkles count={20} />
      
      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b-2 border-[#C0C0C0]/30">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <Music2 className="w-8 h-8 text-white relative z-10" />
                <div className="absolute inset-0 bg-[#39FF14]/30 blur-lg transform scale-150" />
              </div>
              <span className="text-white text-2xl font-bold pixel-font glow-text">MusicMate</span>
            </Link>
            
            <div className="hidden md:flex items-center ml-6">
              <Link to="/" className="chrome-button flex items-center space-x-2 mr-4">
                <ArrowLeft className="w-5 h-5" />
                <span>Back Home</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <animated.main style={fadeIn} className="relative z-10 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-16">
            <div className="holographic-card p-6 w-full max-w-md">
              <div className="relative z-10">
                <h3 className="text-xl text-white mb-6 text-center pixel-font glow-text">Find Your Match</h3>
                <ProfileCard
                  profile={mockProfiles[currentIndex]}
                  onLike={handleLike}
                  onDislike={handleDislike}
                />
              </div>
              <div className="absolute inset-0 holographic-overlay opacity-20" />
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-white mb-8 pixel-font glow-text">Your Matches</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {likedProfiles.map(({ profile, compatibility }, index) => (
                <div 
                  key={index}
                  className="block p-6 border-2 border-[#C0C0C0]/30 rounded-lg bg-[#1A1A2E]/60 backdrop-blur-sm hover:bg-[#2A2A3E]/60 transition-colors"
                >
                  <Link to={`/profile/${profile.username}`}>
                    <div className="text-center mb-4">
                      <p className="text-white pixel-font glow-text mb-1">{profile.displayName}</p>
                      <p className="text-[#C0C0C0] text-sm pixel-body-font">@{profile.username}</p>
                    </div>
                  </Link>
                  <div className="mb-2">
                    <p className="text-[#FF80B2] text-sm pixel-font text-center">Music Compatibility</p>
                  </div>
                  <CompatibilityGauge score={compatibility} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </animated.main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-[#C0C0C0]/30 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-center text-[#C0C0C0] pixel-body-font text-sm">
            {new Date().getFullYear()} MusicMate - Y2K Vibes Only
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MatchMaker;
