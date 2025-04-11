import React from 'react';
import { useSpring, animated, useTrail } from '@react-spring/web';
import { Users, Music2, MessageCircle, Star, Disc } from 'lucide-react';
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

const FriendsPage = () => {
  // Page fade-in animation
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 }
  });

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


export default FriendsPage;
