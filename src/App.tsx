import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Music2, Users, UserCog, Sparkles, LogIn, Star, Heart, Disc, Square, PlusSquare } from 'lucide-react';
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
          key={position.id}
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
const FeatureCard = ({ icon: Icon, title, description, buttonText, color }: 
  { icon: React.ElementType, title: string, description: string, buttonText: string, color: string }) => {
  
  const [hovered, setHovered] = useState(false);
  
  const springProps = useSpring({
    transform: hovered ? 'scale(1.05) translateY(-5px)' : 'scale(1) translateY(0px)',
    boxShadow: hovered 
      ? '0 15px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(255, 119, 170, 0.5)' 
      : '0 5px 15px rgba(0, 0, 0, 0.2), 0 0 5px rgba(255, 119, 170, 0.3)',
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

const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (navRef.current && !navRef.current.contains(event.target as Node)) {
      setIsNavOpen(false);
    }
  };

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 60 },
  });

  return (
    <div className="min-h-screen bg-[#1A1A2E] overflow-x-hidden">
      {/* Y2K Effects */}
      <CursorTrail />
      <FloatingShapes />
      <RandomSparkles />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#1A1A2E]/80 backdrop-blur-lg border-b-2 border-[#C0C0C0]/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <Music2 className="w-6 h-6 text-white relative z-10" />
                <div className="absolute inset-0 bg-[#ff77aa]/30 blur-lg transform scale-150" />
              </div>
              <span className="text-white text-xl font-bold pixel-font">MusicMate</span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/discover">
                <NavMenuItem icon={Users} label="Find Friends" />
              </Link>
              <Link to="/profile">
                <NavMenuItem icon={UserCog} label="Profile" />
              </Link>
              <NavMenuItem icon={Disc} label="Music" />
              <NavMenuItem icon={LogIn} label="Login" />
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation Menu */}
      <div 
        ref={navRef}
        className={`fixed top-16 right-0 w-64 h-screen bg-[#1A1A2E]/95 backdrop-blur-lg transform transition-transform duration-200 ease-in-out z-40 border-l-2 border-[#C0C0C0]/30 ${
          isNavOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center py-8 space-y-6">
          <Link to="/discover" className="w-full">
            <NavMenuItem icon={Users} label="Find Friends" />
          </Link>
          <Link to="/profile" className="w-full">
            <NavMenuItem icon={UserCog} label="Profile" />
          </Link>
          <NavMenuItem icon={Disc} label="Music" />
          <NavMenuItem icon={LogIn} label="Login" />
        </div>
      </div>
      
      {/* Main Content */}
      <animated.main style={fadeIn} className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 pixel-font glow-text">
              Find Your Music Soulmate
            </h1>
            <p className="text-[#C0C0C0] text-lg md:text-xl mb-8 pixel-body-font">
              Connect with people who share your Y2K music vibes
            </p>
            
            <button 
              className="bg-gradient-to-r from-[#ff77aa] to-[#7f5fc5] text-white px-8 py-3 rounded-full font-semibold hover:from-[#ff5599] hover:to-[#6f4fb5] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ff77aa] focus:ring-opacity-50 shadow-lg"
              onClick={() => window.location.href = '/discover'}
            >
              Start Matching
            </button>
          </div>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Link to="/discover">
              <FeatureCard 
                icon={Users} 
                title="Match Making" 
                description="Find friends based on your music taste and shared vibes" 
                buttonText="Find Matches"
                color="from-[#ff77aa] to-[#7f5fc5]"
              />
            </Link>
            
            <Link to="/profile">
              <FeatureCard 
                icon={UserCog} 
                title="Profile Management" 
                description="Customize your Y2K inspired digital ID card"
                buttonText="Edit Profile"
                color="from-[#00B4B4] to-[#3adfd4]"
              />
            </Link>
            
            <FeatureCard 
              icon={Sparkles} 
              title="Music Discovery" 
              description="Find your next favorite song through your new connections"
              buttonText="Explore Music"
              color="from-[#ff77aa] to-[#00B4B4]"
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