import React, { useState } from "react";
import { useSpring, animated } from '@react-spring/web';
import { Music2, ArrowLeft, Star, Heart, Disc } from 'lucide-react';
import { Link } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";

interface Profile {
  username: string;
  displayName: string;
  profilePic: string;
  bio: string;
  topArtists: string[];
  favoriteGenres: string[];
  stats: {
    friends: number;
    playlists: number;
    matches: number;
  };
}

const mockProfiles: Profile[] = [
  {
    username: "RetroWave_Alice",
    displayName: "Alice",
    profilePic: "/static/profile_images/alice.jpg",
    bio: "90s music enthusiast. Living in a digital wonderland!",
    topArtists: ["Madonna", "Spice Girls", "Aqua", "Eiffel 65"],
    favoriteGenres: ["Pop", "Eurodance", "Trance"],
    stats: { friends: 35, playlists: 8, matches: 15 }
  },
  {
    username: "VaporBob",
    displayName: "Bob",
    profilePic: "/static/profile_images/bob.jpg",
    bio: "Vaporwave and synthwave are my aesthetic",
    topArtists: ["The Prodigy", "Chemical Brothers", "Moby"],
    favoriteGenres: ["Vaporwave", "Synthwave", "Electronic"],
    stats: { friends: 28, playlists: 12, matches: 20 }
  },
  {
    username: "Y2K_Charlie",
    displayName: "Charlie",
    profilePic: "/static/profile_images/charlie.jpg",
    bio: "Collecting virtual friends and digital memories",
    topArtists: ["Britney Spears", "NSYNC", "Backstreet Boys"],
    favoriteGenres: ["Y2K Pop", "Boy Bands", "Teen Pop"],
    stats: { friends: 45, playlists: 15, matches: 25 }
  }
];

const DiscoverPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<Profile[]>([]);

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
    setLikedProfiles(prev => [...prev, currentProfile]);
    console.log("Liked:", currentProfile.displayName);
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
      
      {/* Floating Shapes for decoration */}
      <Star className="floating-shape absolute w-8 h-8 top-20 left-[10%]" style={{ color: "#39FF14" }} />
      <Heart className="floating-shape absolute w-8 h-8 top-40 right-[15%]" style={{ color: "#FF80B2" }} />
      <Disc className="floating-shape absolute w-10 h-10 bottom-40 right-[25%]" style={{ color: "#00FFFF" }} />
      
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
              <div className="holographic-overlay absolute inset-0"></div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-white mb-8 pixel-font glow-text">Your Matches</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {likedProfiles.map((profile, index) => (
                <Link 
                  to={`/profile/${profile.username}`} 
                  key={index}
                  className="block p-4 border-2 border-[#C0C0C0]/30 rounded-lg bg-[#1A1A2E]/60 backdrop-blur-sm hover:bg-[#2A2A3E]/60 transition-colors"
                >
                  <div className="text-center">
                    <p className="text-white pixel-font glow-text mb-1">{profile.displayName}</p>
                    <p className="text-[#C0C0C0] text-sm pixel-body-font">@{profile.username}</p>
                  </div>
                </Link>
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

export default DiscoverPage;
