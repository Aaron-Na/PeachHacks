import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated, useTrail } from '@react-spring/web';
import { Music2, Users, UserCog, Sparkles, LogIn, Star, Heart, Disc, Play, Square, PlusSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="cursor-trail fixed inset-0 pointer-events-none z-50">
      {trail.map((position, i) => (
        <div
          key={`${position.id}-${i}`}
          className="absolute w-5 h-5 rounded-full"
          style={{
            left: position.x - 8,
            top: position.y - 8,
            backgroundColor: `rgba(255, 119, 170, ${1 - i / trail.length})`,
            transform: `scale(${1 - i / trail.length})`,
            zIndex: trail.length - i,
          }}
        />
      ))}
    </div>
  );
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

// NavMenuItem component with hover animation
const NavMenuItem = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => {
  const [hovered, setHovered] = useState(false);
  
  const animationProps = useSpring({
    transform: hovered ? 'scale(1.15)' : 'scale(1)',
    color: hovered ? '#3adfd4' : 'white',
    config: { tension: 300, friction: 10 },
  });
  
  return (
    <animated.div
      className="flex flex-col items-center p-2 cursor-pointer"
      style={animationProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon size={24} />
      <span className="text-xs mt-1 font-bold">{label}</span>
    </animated.div>
  );
};

// Feature card with PSP/PS2 style
const FeatureCard = ({ icon: Icon, title, description, buttonText, color, link }: { 
  icon: React.ElementType, 
  title: string, 
  description: string, 
  buttonText: string, 
  color: string,
  link: string 
}) => {
  const [hovered, setHovered] = useState(false);
  
  const springProps = useSpring({
    transform: hovered ? 'scale(1.05)' : 'scale(1)',
    config: { tension: 300, friction: 10 },
  });
  
  return (
    <animated.div
      style={springProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative p-6 border-2 border-[#C0C0C0] rounded-lg bg-[#1A1A2E]/60 backdrop-blur-sm"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 rounded-lg`} />
      <div className="relative z-10">
        <Icon className="w-12 h-12 text-white mb-4" />
        <h3 className="text-xl font-bold text-white mb-2 pixel-font glow-text">{title}</h3>
        <p className="text-[#C0C0C0] mb-6 pixel-body-font">{description}</p>
        <Link to={link} className="chrome-button">
          {buttonText}
        </Link>
      </div>
    </animated.div>
  );
};

function App() {
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
  }, [loginRef]);

  // Animated title with trail effect
  const titleWords = ['Find', 'Your', 'Music', 'Soul', 'Mates'];
  const titleTrail = useTrail(titleWords.length, {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 300, friction: 20 },
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
      <FloatingShapes />
      
      {/* Random Sparkles */}
      <RandomSparkles count={20} />
      
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Music2 className="w-8 h-8 text-white relative z-10" />
              <div className="absolute inset-0 bg-[#ff77aa]/30 blur-lg transform scale-150" />
            </div>
            <span className="text-white text-2xl font-bold pixel-font glow-text">MusicMate</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <NavMenuItem icon={Users} label="Friends" />
              <NavMenuItem icon={Disc} label="Discover" />
              <Link to="/profile" className="no-underline">
                <NavMenuItem icon={UserCog} label="Profile" />
              </Link>
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
                <div className="absolute right-0 mt-2 w-64 py-2 bg-[#1A1A2E]/90 backdrop-blur-lg border-2 border-[#C0C0C0] rounded-lg shadow-xl z-[100]">
                  <div className="px-4 py-2 border-b border-[#C0C0C0]/50">
                    <p className="text-[#3adfd4] text-sm pixel-body-font">Connect with Spotify to:</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-[#ff77aa]/20 transition-colors cursor-pointer">
                    <p className="text-white pixel-body-font">• Find music matches</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-[#ff77aa]/20 transition-colors cursor-pointer">
                    <p className="text-white pixel-body-font">• Share your playlists</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-[#ff77aa]/20 transition-colors cursor-pointer">
                    <p className="text-white pixel-body-font">• Discover new music</p>
                  </div>
                  <div className="px-4 pt-3 pb-2 border-t border-[#C0C0C0]/50 flex justify-center">
                    <button 
                      className="button23 space-x-2" 
                      onClick={() => setShowLoginMenu(false)}
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Connect Spotify</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <animated.main className="relative z-10 px-6 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-baseline space-x-2 flex-wrap mb-6">
              {titleTrail.map((style, index) => (
                <animated.span 
                  key={index} 
                  style={style} 
                  className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff77aa] to-[#3adfd4] pixel-font glow-text inline-block"
                >
                  {titleWords[index]}
                </animated.span>
              ))}
            </div>
            
            <div className="relative overflow-hidden h-12 mb-8 border-t-2 border-b-2 border-[#ff77aa]/50">
              <div className="marquee">
                <p className="text-[#ff77aa] text-xl pixel-body-font">
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
                <div className="play-button absolute -bottom-4 right-0 transform translate-x-1/4 bg-[#ff77aa] rounded-full p-3 border-2 border-[#C0C0C0] glow-effect">
                  <Play className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="cd-shadow w-64 h-8 bg-black/30 blur-md rounded-full mx-auto -mt-4"></div>
            </div>
            
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold text-white mb-6 pixel-font glow-text">
                Find Your Music Match
              </h1>
              <p className="text-xl text-[#C0C0C0] mb-8 pixel-body-font">
                Connect with people who share your Y2K music taste and vibe
              </p>
              <div className="flex justify-center">
                <Link to="/match" className="chrome-button text-lg px-8 py-4">
                  Start Matching
                </Link>
              </div>
            </div>
            
            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <FeatureCard 
                icon={Users} 
                title="Match Making" 
                description="Find friends based on your music taste and shared vibes" 
                buttonText="Find Matches"
                color="from-[#ff77aa] to-[#7f5fc5]"
                link="/match"
              />
              
              <FeatureCard 
                icon={UserCog} 
                title="Profile Management" 
                description="Customize your Y2K inspired digital ID card"
                buttonText="Edit Profile"
                color="from-[#00B4B4] to-[#3adfd4]"
                link="/profile"
              />
              
              <FeatureCard 
                icon={Sparkles} 
                title="Music Discovery" 
                description="Find your next favorite song through your new connections"
                buttonText="Coming Soon"
                color="from-[#ff77aa] to-[#00B4B4]"
                link="#"
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
        </div>
      </animated.main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-[#C0C0C0]/30 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="relative">
                <Music2 className="w-6 h-6 text-white relative z-10" />
                <div className="absolute inset-0 bg-[#ff77aa]/30 blur-lg transform scale-150" />
              </div>
              <span className="text-white text-xl font-bold pixel-font">MusicMate</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="#" className="text-[#3adfd4] hover:text-[#ff77aa] transition-colors pixel-body-font">About</a>
              <a href="#" className="text-[#3adfd4] hover:text-[#ff77aa] transition-colors pixel-body-font">Privacy</a>
              <a href="#" className="text-[#3adfd4] hover:text-[#ff77aa] transition-colors pixel-body-font">Terms</a>
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