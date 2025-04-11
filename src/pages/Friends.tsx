import React, { useState } from 'react';
import { useSpring, animated, useTrail } from '@react-spring/web';
import { Users, Music2, MessageCircle, Star, Disc, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Dummy friends data (in a real app, this would come from an API)
const friendsData = [
  {
    // username: "RetroWave_Queen",
    // displayName: "Sarah Mitchell",
    // profilePic: "https://i.pravatar.cc/150?img=1",
    id: 1,
    username: "A-aronNash",
    displayName: "Aaron",
    profilePic: "https://i.pravatar.cc/400?img=13",
    matchPercentage: 92,
    commonArtists: ["Daft Punk", "The Prodigy", "Kylie Minogue"],
    commonGenres: ["Eurodance", "Y2K Pop"],
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    username: "ArticMonkeys",
    displayName: "Alex Turner",
    profilePic: "https://i.pravatar.cc/400?img=11",
    matchPercentage: 88,
    commonArtists: ["Britney Spears", "Backstreet Boys"],
    commonGenres: ["Y2K Pop", "Hip Hop"],
    lastActive: "1 day ago"
  },
  {
    id: 3,
    username: "JordN",
    displayName: "Jordan Lee",
    profilePic: "https://i.pravatar.cc/150?img=3",
    matchPercentage: 85,
    commonArtists: ["Daft Punk", "The Prodigy"],
    commonGenres: ["Trance", "Hip Hop"],
    lastActive: "Just now"
  },
  {
    id: 4,
    username: "C8LYN",
    displayName: "Caitlyn",
    profilePic: "https://i.pravatar.cc/150?img=5",
    matchPercentage: 95,
    commonArtists: ["Lady Gaga", "Taylor Swift", "Ariana Grande"],
    commonGenres: ["Pop", "Dance Pop", "R&B"],
    lastActive: "Online"
  }
];

const Friends = () => {
  // Page fade-in animation
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 }
  });

  // State for blend popup
  const [activeBlendId, setActiveBlendId] = useState<number | null>(null);
  const [blendPercentage, setBlendPercentage] = useState<number>(50);

  // Open blend popup for a specific friend
  const handleOpenBlend = (friendId: number, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveBlendId(friendId);
    setBlendPercentage(50); // Reset to default
  };

  // Close blend popup
  const handleCloseBlend = () => {
    setActiveBlendId(null);
  };

  // Title animation
  const titleWords = ['Your', 'Music', 'Matches'];
  const titleTrail = useTrail(titleWords.length, {
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 },
  });

  return (
    <animated.div style={fadeIn} className="min-h-screen bg-gradient-to-b from-[#1A1A2E] to-black text-white p-6 relative overflow-hidden">
      {/* Y2K Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <Star
            key={i}
            className="absolute animate-pulse text-[#ff77aa]/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Users size={32} className="text-[#ff77aa] animate-pulse" />
            <div className="flex gap-2">
              {titleTrail.map((style, index) => (
                <animated.span
                  key={index}
                  style={style}
                  className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff77aa] to-[#3adfd4] pixel-font glow-text"
                >
                  {titleWords[index]}
                </animated.span>
              ))}
            </div>
          </div>
          <Link to="/profile" className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-[#ff77aa] to-[#3adfd4] text-white font-bold hover:opacity-90 transition-opacity pixel-body-font">
            Back to Profile
          </Link>
        </div>

        {/* Friends Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {friendsData.map((friend) => (
            <animated.div
              key={friend.id}
              style={useSpring({
                from: { opacity: 0, transform: 'translateY(10px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
                delay: friend.id * 150
              })}
              className="relative group"
            >
              {/* Y2K Card Container */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff77aa]/40 to-[#3adfd4]/40 rounded-xl"></div>
              <div className="relative bg-[#1A1A2E]/95 backdrop-blur-sm rounded-xl p-6 border border-[#3adfd4]/50 group-hover:border-[#3adfd4] transition-colors">
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff77aa] to-[#3adfd4] rounded-full animate-pulse blur-md"></div>
                    <img
                      src={friend.profilePic}
                      alt={friend.displayName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white relative z-10"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold pixel-font text-[#3adfd4] glow-text">{friend.displayName}</h2>
                    <p className="text-[#ff77aa] pixel-body-font">@{friend.username}</p>
                  </div>
                  <div className="text-center pixel-font">
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff77aa] to-[#3adfd4] glow-text">{friend.matchPercentage}%</div>
                    <div className="text-xs text-[#3adfd4]">MATCH</div>
                  </div>
                </div>

                {/* Music Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 pixel-body-font">
                    <Disc className="text-[#ff77aa] animate-spin-slow" size={18} />
                    <p className="text-sm">
                      <span className="text-[#3adfd4]">Artists:</span>{' '}
                      <span className="text-white">{friend.commonArtists.join(" • ")}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pixel-body-font">
                    <Music2 className="text-[#3adfd4]" size={18} />
                    <p className="text-sm">
                      <span className="text-[#ff77aa]">Genres:</span>{' '}
                      <span className="text-white">{friend.commonGenres.join(" • ")}</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-[#3adfd4]/30">
                  <span className="text-xs text-[#3adfd4] pixel-body-font animate-pulse">
                    {friend.lastActive}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleOpenBlend(friend.id, e)}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-[#ff77aa] to-[#3adfd4] text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 pixel-body-font"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M10 9.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0z"/><path d="M15 9.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0z"/><path d="M12 9.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0z"/></svg>
                      Blend Tastes
                    </button>
                    <button className="px-4 py-2 rounded-full bg-gradient-to-r from-[#ff77aa] to-[#3adfd4] text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 pixel-body-font">
                      <MessageCircle size={16} />
                      Message
                    </button>
                    <Link
                      to={`/profile/${friend.username}`}
                      className="px-4 py-2 rounded-full border-2 border-[#3adfd4] text-[#3adfd4] font-bold hover:bg-[#3adfd4]/10 transition-colors pixel-body-font"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>

                {/* Blend Tastes Popup */}
                {activeBlendId === friend.id && (
                  <div className="absolute top-0 left-0 w-full h-full bg-[#1A1A2E]/95 backdrop-blur-sm rounded-xl p-6 border-2 border-[#3adfd4] z-20 flex flex-col justify-center items-center">
                    <button 
                      onClick={handleCloseBlend}
                      className="absolute top-3 right-3 text-[#ff77aa] hover:text-[#ff77aa]/80 transition-colors"
                    >
                      <X size={24} />
                    </button>
                    
                    <h3 className="text-2xl font-bold pixel-font text-[#3adfd4] glow-text mb-6">Blend with {friend.displayName}</h3>
                    
                    <div className="w-full max-w-md bg-black/50 rounded-xl p-6 border border-[#ff77aa]/50">
                      <div className="flex justify-between mb-2">
                        <span className="text-[#ff77aa] pixel-body-font">Unique Songs</span>
                        <span className="text-[#3adfd4] pixel-body-font">Common Favorites</span>
                      </div>
                      
                      <div className="relative mb-6">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={blendPercentage} 
                          onChange={(e) => setBlendPercentage(parseInt(e.target.value))}
                          className="w-full h-3 rounded-full appearance-none bg-gradient-to-r from-[#ff77aa] to-[#3adfd4] outline-none cursor-pointer"
                          style={{
                            WebkitAppearance: 'none',
                            appearance: 'none',
                          }}
                        />
                        <div className="absolute w-full flex justify-between mt-2 px-2">
                          <span className="text-white/70 text-sm pixel-body-font">0%</span>
                          <span className="text-white/70 text-sm pixel-body-font">50%</span>
                          <span className="text-white/70 text-sm pixel-body-font">100%</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-4xl font-bold pixel-font text-transparent bg-clip-text bg-gradient-to-r from-[#ff77aa] to-[#3adfd4] glow-text mb-2">
                          {blendPercentage}%
                        </div>
                        <p className="text-white/80 text-sm pixel-body-font mb-6">
                          {blendPercentage < 20 
                            ? "Mostly unique songs from both of your libraries" 
                            : blendPercentage < 50
                            ? "A mix with more unique songs than common favorites"
                            : blendPercentage < 80
                            ? "A balanced mix of common favorites and unique tracks"
                            : "Mostly songs you both know and love"}
                        </p>
                        
                        <button className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-[#ff77aa] to-[#3adfd4] text-white font-bold hover:opacity-90 transition-opacity pixel-body-font">
                          Create Blended Playlist
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </animated.div>
          ))}
        </div>

        {/* Y2K Footer Element */}
        <div className="mt-12 text-center">
          <img 
            src="https://web.archive.org/web/20091027130416/http://hk.geocities.com/antifaster/images/const2.gif" 
            alt="Under Construction" 
            className="inline-block h-16"
          />
        </div>
      </div>
    </animated.div>
  );
};


export default Friends;
