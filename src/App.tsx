import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated, useTrail } from '@react-spring/web';
import { Music2, Users, UserCog, Sparkles, LogIn, Star, Heart, Disc, Play, Square, PlusSquare } from 'lucide-react';

// Component for animated Y2K cursor trail
const CursorTrail = () => {
  const [trail, setTrail] = useState<{ x: number, y: number, id: number }[]>([]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTrail(prev => {
        const newPoint = { x: e.clientX, y: e.clientY, id: Date.now() };
        return [...prev.slice(-5), newPoint]; // Keep last 6 points for trail
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <>
      {trail.map((point, index) => (
        <div 
          key={point.id}
          className="pointer-events-none absolute w-3 h-3 z-50"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            opacity: (index / trail.length) * 0.6,
            transform: `scale(${(index / trail.length) * 0.8})`,
            background: `radial-gradient(circle, rgb(255, 20, 147) 0%, rgba(0, 255, 255, ${index / trail.length}) 100%)`,
            borderRadius: '50%',
            boxShadow: '0 0 8px rgba(255, 20, 147, 0.8)',
          }}
        />
      ))}
    </>
  );
};

// Navigation menu item with animation
const NavMenuItem = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => {
  const [hovered, setHovered] = useState(false);
  
  const springProps = useSpring({
    transform: hovered ? 'scale(1.1)' : 'scale(1)',
    background: hovered 
      ? 'linear-gradient(45deg, #FF1493, #00FFFF)' 
      : 'linear-gradient(45deg, #00B4B4, #1A1A2E)',
    config: { tension: 300, friction: 20 },
  });
  
  return (
    <animated.div 
      style={springProps}
      className="flex items-center space-x-2 px-4 py-2 rounded-full border-2 border-[#C0C0C0] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon className="w-5 h-5 text-white" />
      <span className="text-white pixel-font">{label}</span>
    </animated.div>
  );
};

// Feature card with PSP/PS2 style
const FeatureCard = ({ icon: Icon, title, description, buttonText, color }: 
  { icon: React.ElementType, title: string, description: string, buttonText: string, color: string }) => {
  
  const [hovered, setHovered] = useState(false);
  
  const springProps = useSpring({
    transform: hovered ? 'scale(1.05) translateY(-5px)' : 'scale(1) translateY(0px)',
    boxShadow: hovered 
      ? '0 15px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(255, 20, 147, 0.5)' 
      : '0 5px 15px rgba(0, 0, 0, 0.2), 0 0 5px rgba(255, 20, 147, 0.3)',
    config: { tension: 300, friction: 20 },
  });
  
  return (
    <animated.div 
      style={springProps}
      className="holographic-card relative overflow-hidden rounded-lg p-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 text-center pixel-font">{title}</h3>
        <p className="text-white/80 mb-6 text-center pixel-body-font">{description}</p>
        <button className="chrome-orb-button w-full">
          {buttonText}
        </button>
      </div>
      <div className="holographic-overlay absolute inset-0"></div>
    </animated.div>
  );
};

function App() {
  const [sparkles, setSparkles] = useState<{ id: number; style: { top: string; left: string } }[]>([]);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);

  // Close login menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setShowLoginMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Random sparkles effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles((current: Array<{ id: number; style: { top: string; left: string } }>) => {
        const newSparkle = {
          id: Date.now(),
          style: {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
          }
        };
        return [...current.slice(-2), newSparkle]; // Keep only 3 sparkles at a time
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Main animation for content fade-in
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 },
    delay: 300,
  });

  // Floating shapes animation
  const shapes = [
    { id: 1, Icon: Star, color: "#39FF14", size: "w-8 h-8", position: "top-20 left-[10%]" },
    { id: 2, Icon: Heart, color: "#FF1493", size: "w-8 h-8", position: "top-40 right-[15%]" },
    { id: 3, Icon: Square, color: "#00FFFF", size: "w-6 h-6", position: "bottom-32 left-[20%]" },
    { id: 4, Icon: PlusSquare, color: "#9B30FF", size: "w-7 h-7", position: "bottom-40 right-[25%]" },
    { id: 5, Icon: Disc, color: "#C0C0C0", size: "w-10 h-10", position: "top-60 left-[30%]" },
  ];

  // Animated title with trail effect
  const titleWords = "Find Your Music Soulmate".split(" ");
  const titleTrail = useTrail(titleWords.length, {
    from: { opacity: 0, y: 20, },
    to: { opacity: 1, y: 0 },
    config: { mass: 1, tension: 280, friction: 20 },
    delay: 600,
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-deep-space">
      {/* Cursor trail effect */}
      <CursorTrail />
      
      {/* Background Elements */}
      <div className="grid-overlay absolute inset-0" />
      <div className="scanline absolute inset-0" />
      <div className="bg-gradient absolute inset-0 opacity-70" />
      
      {/* Floating Shapes */}
      {shapes.map(({ id, Icon, color, size, position }) => (
        <Icon 
          key={id} 
          className={`floating-shape ${size} absolute ${position}`} 
          style={{ color: color }}
        />
      ))}
      
      {/* Random Sparkles */}
      {sparkles.map((sparkle: { id: number; style: { top: string; left: string } }) => (
        <div
          key={sparkle.id}
          className="sparkle absolute w-4 h-4"
          style={sparkle.style}
        />
      ))}
      
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Music2 className="w-8 h-8 text-white relative z-10" />
              <div className="absolute inset-0 bg-[#39FF14]/30 blur-lg transform scale-150" />
            </div>
            <span className="text-white text-2xl font-bold pixel-font glow-text">MusicMate</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <NavMenuItem icon={Users} label="Friends" />
              <NavMenuItem icon={Disc} label="Discover" />
              <NavMenuItem icon={UserCog} label="Profile" />
            </div>
            
            <div className="relative" ref={loginRef}>
              <button 
                className="chrome-button flex items-center space-x-2"
                onClick={() => setShowLoginMenu(!showLoginMenu)}
              >
                <LogIn className="w-5 h-5" />
                <span>Connect Spotify</span>
              </button>
              
              {showLoginMenu && (
                <div className="absolute right-0 mt-2 w-64 py-2 bg-[#1A1A2E]/90 backdrop-blur-lg border-2 border-[#C0C0C0] rounded-lg shadow-xl z-50">
                  <div className="px-4 py-2 border-b border-[#C0C0C0]/50">
                    <p className="text-[#00FFFF] text-sm pixel-body-font">Connect with Spotify to:</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-[#FF1493]/20 transition-colors cursor-pointer">
                    <p className="text-white pixel-body-font">• Find music matches</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-[#FF1493]/20 transition-colors cursor-pointer">
                    <p className="text-white pixel-body-font">• Share your playlists</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-[#FF1493]/20 transition-colors cursor-pointer">
                    <p className="text-white pixel-body-font">• Discover new music</p>
                  </div>
                  <div className="px-4 pt-3 pb-2 border-t border-[#C0C0C0]/50 flex justify-center">
                    <button className="y2k-button w-full">Authorize</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <animated.main style={fadeIn} className="relative z-10 px-6 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-baseline space-x-2 flex-wrap mb-6">
              {titleTrail.map((style: any, index: number) => (
                <animated.span 
                  key={index} 
                  style={style} 
                  className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF1493] to-[#00FFFF] pixel-font glow-text inline-block"
                >
                  {titleWords[index]}
                </animated.span>
              ))}
            </div>
            
            <div className="relative overflow-hidden h-12 mb-8 border-t-2 border-b-2 border-[#39FF14]/50">
              <div className="marquee">
                <p className="text-[#39FF14] text-xl pixel-body-font">
                  ★ Join thousands of music lovers ★ Make new friends ★ Discover amazing music ★ Create your Y2K profile ★
                </p>
              </div>
            </div>
            
            <div className="y2k-cd-player relative max-w-xs mx-auto mb-12">
              <div className="cd-base relative w-64 h-64 rounded-full border-8 border-[#C0C0C0] bg-gradient-to-r from-[#1A1A2E] to-[#00B4B4] p-2 mx-auto">
                <div className="cd-disc absolute inset-2 rounded-full bg-gradient-to-r from-[#1A1A2E] to-[#000] overflow-hidden flex items-center justify-center animate-spin-slow">
                  <div className="cd-hole w-8 h-8 rounded-full bg-[#000] border-2 border-[#C0C0C0]"></div>
                  <div className="cd-reflection absolute inset-0 bg-gradient-to-tr from-transparent via-[#C0C0C0]/10 to-[#C0C0C0]/30"></div>
                </div>
                <div className="play-button absolute -bottom-4 right-0 transform translate-x-1/4 bg-[#FF1493] rounded-full p-3 border-2 border-[#C0C0C0] glow-effect">
                  <Play className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="cd-shadow w-64 h-8 bg-black/30 blur-md rounded-full mx-auto -mt-4"></div>
            </div>
            
            <button className="chrome-orb-button text-lg px-8 py-3 mb-8 animate-pulse-slow">
              Start Matching
            </button>
          </div>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <FeatureCard 
              icon={Users} 
              title="Match Making" 
              description="Find friends based on your music taste and shared vibes" 
              buttonText="Find Matches"
              color="from-[#FF1493] to-[#9B30FF]"
            />
            
            <FeatureCard 
              icon={UserCog} 
              title="Profile Management" 
              description="Customize your Y2K inspired digital ID card"
              buttonText="Edit Profile"
              color="from-[#00B4B4] to-[#00FFFF]"
            />
            
            <FeatureCard 
              icon={Sparkles} 
              title="Music Discovery" 
              description="Find your next favorite song through your new connections"
              buttonText="Explore Music"
              color="from-[#39FF14] to-[#00B4B4]"
            />
          </div>
          
          {/* MySpace-inspired Testimonials */}
          <div className="mt-24 mb-16">
            <h2 className="text-3xl font-bold text-center text-white mb-8 pixel-font glow-text">Top Friends</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((id) => (
                <div key={id} className="friend-card p-4 border-2 border-[#C0C0C0] rounded-lg bg-[#1A1A2E]/60 backdrop-blur-sm">
                  <div className="w-full aspect-square mb-2 bg-gradient-to-br from-[#7FD1DE] to-[#00B4B4] rounded-md overflow-hidden flex items-center justify-center">
                    <div className="text-2xl font-bold text-white">#{id}</div>
                  </div>
                  <p className="text-white text-center pixel-body-font truncate">Music Friend {id}</p>
                  <div className="flex justify-center mt-2">
                    <div className="music-bars">
                      <div className="bar bar1"></div>
                      <div className="bar bar2"></div>
                      <div className="bar bar3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </animated.main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-[#C0C0C0]/30 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="relative">
                <Music2 className="w-6 h-6 text-white relative z-10" />
                <div className="absolute inset-0 bg-[#39FF14]/30 blur-lg transform scale-150" />
              </div>
              <span className="text-white text-xl font-bold pixel-font">MusicMate</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="#" className="text-[#00FFFF] hover:text-[#FF1493] transition-colors pixel-body-font">About</a>
              <a href="#" className="text-[#00FFFF] hover:text-[#FF1493] transition-colors pixel-body-font">Privacy</a>
              <a href="#" className="text-[#00FFFF] hover:text-[#FF1493] transition-colors pixel-body-font">Terms</a>
            </div>
          </div>
          
          <div className="text-center text-[#C0C0C0] mt-8 pixel-body-font text-sm">
            {new Date().getFullYear()} MusicMate - Relive the Y2K era through music
          </div>
        </div>
      </footer>

      {/* Under Construction GIF */}
      <img 
        src="https://web.archive.org/web/20091027130416/http://hk.geocities.com/antifaster/images/const2.gif" 
        alt="Under Construction" 
        className="absolute bottom-4 right-4 w-24 h-24 z-10" 
      />
    </div>
  );
}

export default App;