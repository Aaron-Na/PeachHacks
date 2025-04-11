import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated, useTrail } from '@react-spring/web';
import { Music2, Users, UserCog, Sparkles, LogIn, Star, Heart, Play, Square, PlusSquare, Headphones } from 'lucide-react';
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
    { type: Star, color: '#E63B3F', size: 24, position: { top: '15%', left: '10%' }, delay: 0 },
    { type: Heart, color: '#72BEFD', size: 28, position: { top: '25%', right: '15%' }, delay: 1 },
    { type: Star, color: '#187CE6', size: 20, position: { bottom: '20%', left: '15%' }, delay: 2 },
    { type: Square, color: '#7381C1', size: 22, position: { bottom: '30%', right: '10%' }, delay: 1.5 },
    { type: PlusSquare, color: '#E63B3F', size: 26, position: { top: '40%', left: '20%' }, delay: 0.5 },
    { type: Star, color: '#377BF3', size: 18, position: { bottom: '45%', right: '25%' }, delay: 2.5 },
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
          background: `radial-gradient(circle, #E63B3F 0%, #72BEFD 100%)`,
        }}
      />
    );
  }
  
  return <div className="fixed inset-0 pointer-events-none z-10">{sparkles}</div>;
};

// Add bokeh background effects component
const BokehBackground = () => {
  const bokehElements = Array(15).fill(0).map((_, i) => {
    const size = Math.random() * 80 + 20;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const opacity = Math.random() * 0.2 + 0.1;
    const hue = Math.random() > 0.5 ? '#E63B3F' : '#72BEFD';
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;
    
    return (
      <div 
        key={`bokeh-${i}`} 
        className="bokeh" 
        style={{
          width: size + 'px',
          height: size + 'px',
          left: left + '%',
          top: top + '%',
          opacity: opacity,
          backgroundColor: hue,
          '--duration': `${duration}s`,
          animationDelay: `${delay}s`
        } as React.CSSProperties}
      />
    );
  });
  
  return <div className="fixed inset-0 overflow-hidden pointer-events-none">{bokehElements}</div>;
};

// Add bubble animation component
const BubbleAnimation = () => {
  const bubbles = Array(20).fill(0).map((_, i) => {
    const size = Math.random() * 60 + 10;
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 10 + 15;
    
    return (
      <div 
        key={`bubble-${i}`} 
        className="bubble" 
        style={{
          width: size + 'px',
          height: size + 'px',
          left: left + '%',
          bottom: '-50px',
          '--duration': `${duration}s`,
          animationDelay: `${delay}s`
        } as React.CSSProperties}
      />
    );
  });
  
  return <div className="fixed inset-0 overflow-hidden pointer-events-none">{bubbles}</div>;
};

// Add natural swirl pattern
const SwirlPattern = () => {
  return (
    <div className="swirl-pattern fixed inset-0" style={{ opacity: 0.07 }}></div>
  );
};

// Heart and Star Particles component for Y2K aesthetic
const HeartStarParticles = ({ count = 25 }) => {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    // Y2K color palette
    const colors = ['#E63B3F', '#72BEFD', '#7381C1', '#187CE6', '#FF77AA'];
    // Complementary colors
    const complementaryColors = ['#00FFFF', '#FF80B2', '#C1A9A6', '#377BF3', '#FFD700'];
    
    const newParticles = [];
    
    for (let i = 0; i < count; i++) {
      const isHeart = Math.random() > 0.5;
      const size = Math.random() * 20 + 10; // 10-30px
      const left = Math.random() * 100; // 0-100%
      const top = Math.random() * 100; // 0-100%
      const delay = Math.random() * 5; // 0-5s delay
      const duration = Math.random() * 20 + 15; // 15-35s duration
      
      // Use either main palette or complementary colors
      const colorSet = Math.random() > 0.5 ? colors : complementaryColors;
      const color = colorSet[Math.floor(Math.random() * colorSet.length)];
      
      // Applying different animation paths for variety
      const animationPath = `y2k-float-${Math.floor(Math.random() * 3) + 1}`;
      
      newParticles.push(
        <div
          key={`particle-${i}`}
          className={`absolute ${animationPath}`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animation: `${animationPath} ${duration}s infinite ease-in-out, shimmer ${Math.random() * 4 + 2}s infinite ease-in-out`,
            animationDelay: `${delay}s`,
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          {isHeart ? (
            <Heart 
              fill={color} 
              color={color} 
              size={size} 
              style={{ 
                opacity: 0.7,
                filter: `drop-shadow(0 0 3px ${color})`,
              }} 
            />
          ) : (
            <Star 
              fill={color} 
              color={color} 
              size={size} 
              style={{ 
                opacity: 0.7,
                filter: `drop-shadow(0 0 3px ${color})`,
              }} 
            />
          )}
        </div>
      );
    }
    
    setParticles(newParticles);
  }, [count]);
  
  return <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">{particles}</div>;
};

// Y2K Vector Stickers component
const Y2KStickers = () => {
  const [stickers, setStickers] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    // Array of sticker paths from your stickers folder
    const stickerPaths = [
      '/images/stickers/vecteezy_hafltone-dot-transparent_38512495.png',
      '/images/stickers/vecteezy_reflective-3d-metallic-silver-heart-shape_53407956.png',
      '/images/stickers/vecteezy_reflective-3d-metallic-silver-star-shape_53407992.png',
      '/images/stickers/vecteezy_white-star-3d-inflated-cute-bubble-glossy-glass-for-decoration_49688576.png',
      '/images/stickers/vecteezy_y2k-chrome-flower_43848442.png'
    ];
    
    const newStickers = [];
    
    // Create 18-25 randomly positioned and rotated stickers
    const stickerCount = Math.floor(Math.random() * 8) + 18; // 18-25 stickers
    
    for (let i = 0; i < stickerCount; i++) {
      // Pick a random sticker
      const path = stickerPaths[Math.floor(Math.random() * stickerPaths.length)];
      
      // Random position, angles, and size
      const left = Math.random() * 85 + 5; // 5-90%
      const top = Math.random() * 85 + 5; // 5-90%
      const rotation = Math.random() * 40 - 20; // -20 to 20 degrees
      const size = Math.random() * 80 + 40; // 40-120px
      const delay = Math.random() * 5; // 0-5s animation delay
      const duration = Math.random() * 5 + 7; // 7-12s animation duration
      const zIndex = Math.floor(Math.random() * 3) + 20; // z-index between 20-22
      
      // Determine if this sticker should have movement (approx 60% of stickers)
      const hasMovement = Math.random() > 0.4;
      
      // Choose a movement animation type (1-4) for variety
      const movementType = hasMovement 
        ? `y2k-sticker-move-${Math.floor(Math.random() * 4) + 1}` 
        : '';
      
      // Movement animation duration (longer than float animation)
      const moveAnimDuration = hasMovement 
        ? Math.random() * 10 + 20 // 20-30s
        : 0;
      
      // Random flip for some stickers (horizontal or vertical)
      const flipX = Math.random() > 0.85 ? 'scaleX(-1)' : '';
      const flipY = Math.random() > 0.85 ? 'scaleY(-1)' : '';
      const flip = flipX + (flipX && flipY ? ' ' : '') + flipY;
      
      newStickers.push(
        <img
          key={`sticker-${i}`}
          src={path}
          alt="Y2K Sticker"
          className={`absolute y2k-sticker-float ${movementType}`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            transform: `rotate(${rotation}deg) ${flip}`,
            width: `${size}px`,
            animation: hasMovement 
              ? `y2k-sticker-float ${duration}s infinite ease-in-out, ${movementType} ${moveAnimDuration}s infinite alternate ease-in-out`
              : `y2k-sticker-float ${duration}s infinite ease-in-out`,
            animationDelay: `${delay}s, ${delay + 1}s`,
            filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))',
            zIndex: zIndex,
            pointerEvents: 'none'
          }}
        />
      );
    }
    
    setStickers(newStickers);
  }, []); // Empty dependency array ensures this only runs once
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stickers}
    </div>
  );
};

// Y2K 3D Rotating Cubes component
const Y2KCubes = () => {
  const [cubes, setCubes] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    const newCubes = [];
    // Create 3-5 randomly positioned cubes
    const cubeCount = Math.floor(Math.random() * 3) + 3; // 3-5 cubes
    
    for (let i = 0; i < cubeCount; i++) {
      // Random position
      const left = Math.random() * 85 + 5; // 5-90%
      const top = Math.random() * 85 + 5; // 5-90%
      
      // Random size (50-100px)
      const size = Math.random() * 50 + 50;
      
      // Random animation durations and delays
      const duration = Math.random() * 15 + 15; // 15-30s
      const delay = Math.random() * 3; // 0-3s delay
      
      // Random initial rotation to make each cube unique
      const initialRotateX = Math.random() * 360;
      const initialRotateY = Math.random() * 360;
      const initialRotateZ = Math.random() * 360;
      
      // Random animation type (1-3)
      const animationType = Math.floor(Math.random() * 3) + 1;
      
      newCubes.push(
        <div 
          key={`cube-${i}`}
          className="y2k-cube-container"
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            zIndex: 15,
            perspective: '1000px',
            pointerEvents: 'none'
          }}
        >
          <div 
            className={`y2k-cube y2k-cube-rotate-${animationType}`}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              transformStyle: 'preserve-3d',
              animation: `rotatecube-${animationType} ${duration}s infinite linear`,
              animationDelay: `${delay}s`,
              transform: `rotateX(${initialRotateX}deg) rotateY(${initialRotateY}deg) rotateZ(${initialRotateZ}deg)`
            }}
          >
            <div className="y2k-cube-face y2k-cube-front"
              style={{ 
                transform: `rotateY(0deg) translateZ(${size/2}px)`,
                width: `${size}px`,
                height: `${size}px`
              }}></div>
            <div className="y2k-cube-face y2k-cube-back"
              style={{ 
                transform: `rotateX(180deg) translateZ(${size/2}px)`,
                width: `${size}px`,
                height: `${size}px`
              }}></div>
            <div className="y2k-cube-face y2k-cube-right"
              style={{ 
                transform: `rotateY(90deg) translateZ(${size/2}px)`,
                width: `${size}px`,
                height: `${size}px`
              }}></div>
            <div className="y2k-cube-face y2k-cube-left"
              style={{ 
                transform: `rotateY(-90deg) translateZ(${size/2}px)`,
                width: `${size}px`,
                height: `${size}px`
              }}></div>
            <div className="y2k-cube-face y2k-cube-top"
              style={{ 
                transform: `rotateX(90deg) translateZ(${size/2}px)`,
                width: `${size}px`,
                height: `${size}px`
              }}></div>
            <div className="y2k-cube-face y2k-cube-bottom"
              style={{ 
                transform: `rotateX(-90deg) translateZ(${size/2}px)`,
                width: `${size}px`,
                height: `${size}px`
              }}></div>
          </div>
        </div>
      );
    }
    
    setCubes(newCubes);
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {cubes}
    </div>
  );
};

// NavMenuItem component with hover animation
const NavMenuItem = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => {
  const [hovered, setHovered] = useState(false);
  
  const animationProps = useSpring({
    transform: hovered ? 'scale(1.15)' : 'scale(1)',
    color: hovered ? '#72BEFD' : 'white',
    config: { tension: 300, friction: 10 },
  });
  
  return (
    <animated.div
      className="flex flex-col items-center p-2 cursor-pointer relative"
      style={animationProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative z-10">
        <Icon size={24} />
        <span className="text-xs mt-1 font-bold">{label}</span>
      </div>
      {/* Y2K bubble shine effect */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-[#E63B3F]/10 to-[#72BEFD]/10 ${hovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 backdrop-blur-sm`}></div>
      <div className={`absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-white/50 ${hovered ? 'opacity-80' : 'opacity-0'} transition-opacity duration-300`}></div>
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
      className="relative p-6 border-2 border-[#C3C9DC] rounded-lg bg-[#1E3168]/60 backdrop-blur-sm overflow-hidden glass-panel"
    >
      {/* Y2K bubble shine effect */}
      <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white/20 to-transparent rounded-t-lg"></div>
      <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-white/30 blur-sm"></div>
      <div className="absolute top-2 right-8 w-2 h-2 rounded-full bg-white/40"></div>
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 rounded-lg`} />
      <div className="relative z-10">
        <Icon className="w-12 h-12 text-white mb-4" />
        <h3 className="text-xl font-bold text-white mb-2 pixel-font glow-text">{title}</h3>
        <p className="text-[#C3C9DC] mb-6 pixel-body-font">{description}</p>
        <Link to={link} className="chrome-button glossy-button">
          {buttonText}
        </Link>
      </div>
    </animated.div>
  );
};

function App() {
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [showListeningPartyMenu, setShowListeningPartyMenu] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const listeningPartyRef = useRef<HTMLDivElement>(null);

  // Close login menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setShowLoginMenu(false);
      }
      if (listeningPartyRef.current && !listeningPartyRef.current.contains(event.target as Node)) {
        setShowListeningPartyMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [loginRef, listeningPartyRef]);

  // Animated title with trail effect
  const titleWords = ['Find', 'Your', 'Music', 'Soul', 'Mates'];
  const titleTrail = useTrail(titleWords.length, {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 300, friction: 20 },
  });

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Cursor trail effect */}
      <CursorTrail />
      
      {/* Background Elements */}
      <div className="grid-overlay absolute inset-0" />
      <div className="scanline absolute inset-0" />
      <div className="absolute inset-0 bg-black/30" /> {/* Overlay to darken the image slightly */}
      
      {/* Floating Shapes */}
      <FloatingShapes />
      
      {/* Random Sparkles */}
      <RandomSparkles count={20} />
      
      {/* Heart and Star Particles */}
      <HeartStarParticles count={30} />
      
      {/* Y2K Vector Stickers */}
      <Y2KStickers />
      
      {/* Y2K 3D Rotating Cubes */}
      <Y2KCubes />
      
      {/* Bokeh Background */}
      <BokehBackground />
      
      {/* Bubble Animation */}
      <BubbleAnimation />
      
      {/* Swirl Pattern */}
      <SwirlPattern />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel backdrop-blur-md border-b border-white/10">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Music2 className="w-8 h-8 text-white relative z-10" />
              <div className="absolute inset-0 bg-[#E63B3F]/30 blur-lg transform scale-150" />
            </div>
            <span className="text-white text-2xl font-bold pixel-font glow-text">MusicMate</span>
            {/* Y2K bubble effect behind logo */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#E63B3F]/10 via-[#ffffff]/5 to-[#72BEFD]/10 rounded-full blur-sm -z-10"></div>
            <div className="absolute top-1 left-12 w-3 h-3 rounded-full bg-white/40 -z-5"></div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/friends" className="no-underline">
                <NavMenuItem icon={Users} label="Friends" />
              </Link>
              <Link to="/profile" className="no-underline">
                <NavMenuItem icon={UserCog} label="Profile" />
              </Link>
              
              {/* Listening Party Button & Menu */}
              <div className="relative" ref={listeningPartyRef}>
                <div 
                  onClick={() => setShowListeningPartyMenu(!showListeningPartyMenu)}
                  className="no-underline"
                >
                  <NavMenuItem icon={Headphones} label="Party" />
                </div>
                
                {showListeningPartyMenu && (
                  <div className="absolute right-0 mt-2 w-64 py-2 bg-[#1E3168]/90 backdrop-blur-lg border-2 border-[#C3C9DC] rounded-lg shadow-xl z-[100] glass-panel">
                    <div className="px-4 py-2 border-b border-[#C3C9DC]/50">
                      <p className="text-[#72BEFD] text-sm pixel-body-font">Listening Party Options:</p>
                    </div>
                    <div 
                      className="px-4 py-3 hover:bg-[#E63B3F]/20 transition-colors cursor-pointer flex items-center"
                      onClick={() => setShowListeningPartyMenu(false)}
                    >
                      <Play className="w-5 h-5 text-[#E63B3F] mr-2" />
                      <p className="text-white pixel-body-font">Start a Listening Party</p>
                    </div>
                    <div 
                      className="px-4 py-3 hover:bg-[#E63B3F]/20 transition-colors cursor-pointer flex items-center"
                      onClick={() => setShowListeningPartyMenu(false)}
                    >
                      <Users className="w-5 h-5 text-[#72BEFD] mr-2" />
                      <p className="text-white pixel-body-font">Join a Listening Party</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="relative" ref={loginRef}>
              <button 
                className="chrome-button flex items-center space-x-2 relative overflow-hidden glossy-button"
                onClick={() => setShowLoginMenu(!showLoginMenu)}
              >
                {/* Y2K bubble shine effect */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-lg"></div>
                <div className="absolute top-1 right-1/4 w-2 h-2 rounded-full bg-white/40"></div>
                <LogIn className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Connect Spotify</span>
              </button>
              
              {showLoginMenu && (
                <div className="absolute right-0 mt-2 w-64 py-2 bg-[#1E3168]/90 backdrop-blur-lg border-2 border-[#C3C9DC] rounded-lg shadow-xl z-[100] glass-panel">
                  <div className="px-4 py-2 border-b border-[#C3C9DC]/50">
                    <p className="text-[#72BEFD] text-sm pixel-body-font">Connect with Spotify to:</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-[#E63B3F]/20 transition-colors cursor-pointer">
                    <p className="text-white pixel-body-font">• Find music matches</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-[#E63B3F]/20 transition-colors cursor-pointer">
                    <p className="text-white pixel-body-font">• Share your playlists</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-[#E63B3F]/20 transition-colors cursor-pointer">
                    <p className="text-white pixel-body-font">• Discover new music</p>
                  </div>
                  <div className="px-4 pt-3 pb-2 border-t border-[#C3C9DC]/50 flex justify-center">
                    <button 
                      className="button23 space-x-2 glossy-button" 
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
      <animated.main className="relative z-10 px-6 pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 mt-16 glass-panel p-8 rounded-3xl relative overflow-hidden">
            {/* Add glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent"></div>
            {/* Add bubble highlights */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#72BEFD]/10 blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#E63B3F]/10 blur-xl"></div>
            
            <div className="relative">
              <div className="flex justify-center items-baseline space-x-2 flex-wrap mb-6">
                {titleTrail.map((style, index) => (
                  <animated.span 
                    key={index} 
                    style={style} 
                    className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#E63B3F] to-[#72BEFD] pixel-font glow-text inline-block"
                  >
                    {titleWords[index]}
                  </animated.span>
                ))}
              </div>
              
              <div className="relative overflow-hidden h-12 mb-8 border-t-2 border-b-2 border-[#E63B3F]/50 glass-panel">
                <div className="marquee">
                  <p className="text-[#E63B3F] text-xl pixel-body-font">
                    ★ Join thousands of music lovers ★ Make new friends ★ Discover amazing music ★ Create your Y2K profile ★
                  </p>
                </div>
              </div>
              
              <div className="y2k-minidisc-player relative max-w-xs mx-auto mb-12 animate-float">
                <div className="minidisc-container relative w-72 h-72 mx-auto">
                  {/* MiniDisc case - square with rounded corners */}
                  <div className="minidisc-case relative w-full h-full bg-[#1E3168] rounded-lg border-4 border-[#286CA9] p-3 shadow-lg">
                    {/* Y2K bubble shine effect */}
                    <div className="absolute top-0 right-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-lg"></div>
                    <div className="absolute top-6 left-6 w-6 h-6 rounded-full bg-white/10 blur-sm"></div>
                    <div className="absolute top-4 right-12 w-3 h-3 rounded-full bg-white/20"></div>
                    
                    {/* MiniDisc labels and branding */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-[#72BEFD] text-xs font-bold z-10 tracking-widest">
                      INSERT THIS END
                    </div>
                    
                    <div className="absolute top-4 right-2 text-[#72BEFD] text-2xl font-bold z-10">
                      80
                    </div>
                    
                    {/* Sony logo */}
                    <div className="absolute right-4 top-1/3 w-20 h-14 bg-[#7381C1] flex items-center justify-center rounded-md z-20">
                      <span className="text-white text-xl font-bold tracking-wider">SONY</span>
                    </div>
                    
                    {/* MiniDisc itself - with holographic/iridescent reflection */}
                    <div className="minidisc absolute inset-10 rounded-full overflow-hidden animate-spin-slow z-10">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#72BEFD] via-[#377BF3] to-[#72BEFD]"></div>
                      
                      {/* Holographic effect */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#377BF3]/40 via-[#72BEFD]/70 to-transparent"></div>
                      </div>
                      
                      {/* MiniDisc center hole */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#1E3168] border-2 border-[#72BEFD]/70"></div>
                      </div>
                      
                      {/* Technical text around disc */}
                      <div className="absolute bottom-8 left-0 right-0 text-center">
                        <span className="text-[#1E3168] text-xs tracking-widest font-mono">ETTM01-8L-78175</span>
                      </div>
                    </div>
                    
                    {/* MD logo */}
                    <div className="absolute bottom-2 left-2 text-[#72BEFD] font-bold">
                      <div className="text-sm">M•D</div>
                      <div className="text-xs">DiSC</div>
                    </div>
                    
                    {/* Play button */}
                    <div className="play-button absolute -bottom-4 right-4 transform translate-x-1/4 bg-[#377BF3] rounded-full p-3 border-2 border-[#72BEFD] glow-effect cursor-pointer hover:bg-[#4A84E7] transition-colors">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Shadow underneath */}
                  <div className="minidisc-shadow w-64 h-6 bg-black/30 blur-md rounded-full mx-auto mt-2"></div>
                </div>
              </div>
              
              <div className="text-center max-w-4xl mx-auto">
                <div className="text-center">
                </div>
              </div>
              
              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-8 mt-16">
                <FeatureCard 
                  icon={Users} 
                  title="Match Making" 
                  description="Find friends based on your music taste and shared vibes" 
                  buttonText="Find Matches"
                  color="from-[#E63B3F] to-[#7381C1]"
                  link="/match"
                />
                
                <FeatureCard 
                  icon={UserCog} 
                  title="Profile Management" 
                  description="Customize your Y2K inspired digital ID card"
                  buttonText="Edit Profile"
                  color="from-[#187CE6] to-[#72BEFD]"
                  link="/profile"
                />
                
                <FeatureCard 
                  icon={Sparkles} 
                  title="Music Discovery" 
                  description="Find your next favorite song through your new connections"
                  buttonText="Try Something New"
                  color="from-[#E63B3F] to-[#187CE6]"
                  link="#"
                />
              </div>
              
              {/* Discover Section */}
              <div className="mt-24 mb-16">
                <h2 className="text-3xl font-bold text-center text-white mb-8 pixel-font glow-text">Discover</h2>
                
                {/* Trending Songs Section */}
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-[#72BEFD] mb-4 pixel-body-font">Top Trending Songs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((id) => (
                      <div 
                        key={`song-${id}`} 
                        className="song-card p-4 border-2 border-[#C3C9DC] rounded-lg bg-[#1E3168]/60 backdrop-blur-sm hover:bg-[#E63B3F]/20 transition-colors cursor-pointer glass-panel"
                      >
                        <div className="w-full aspect-square mb-2 bg-gradient-to-br from-[#E63B3F] to-[#7381C1] rounded-md overflow-hidden flex items-center justify-center relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="w-10 h-10 text-white opacity-70 hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="absolute top-2 right-2 text-sm bg-[#E63B3F] text-white px-2 py-1 rounded-full">#{id}</span>
                        </div>
                        <p className="text-white font-medium pixel-body-font truncate">Trending Song {id}</p>
                        <p className="text-[#C3C9DC] text-sm pixel-body-font truncate">Artist Name</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-[#72BEFD]">
                            {Math.floor(Math.random() * 50) + 10} friends
                          </div>
                          <div className="music-bars scale-75">
                            <div className="bar bar1"></div>
                            <div className="bar bar2"></div>
                            <div className="bar bar3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Trending Artists Section */}
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-[#72BEFD] mb-4 pixel-body-font">Top Trending Artists</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((id) => (
                      <div 
                        key={`artist-${id}`} 
                        className="artist-card p-4 border-2 border-[#C3C9DC] rounded-lg bg-[#1E3168]/60 backdrop-blur-sm hover:bg-[#187CE6]/20 transition-colors cursor-pointer glass-panel"
                      >
                        <div className="w-full aspect-square mb-2 bg-gradient-to-br from-[#187CE6] to-[#72BEFD] rounded-full overflow-hidden flex items-center justify-center">
                          <div className="text-xl font-bold text-white">{id}</div>
                        </div>
                        <p className="text-white font-medium text-center pixel-body-font truncate">Artist {id}</p>
                        <p className="text-[#C3C9DC] text-sm text-center pixel-body-font truncate">Genre</p>
                        <div className="flex items-center justify-center mt-2">
                          <span className="bg-[#187CE6] text-white text-xs px-2 py-1 rounded-full">
                            {Math.floor(Math.random() * 50) + 10} friends listening
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Random Playlists Section */}
                <div>
                  <h3 className="text-xl font-bold text-[#72BEFD] mb-4 pixel-body-font">Daily Friend Playlists</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((id) => (
                      <div 
                        key={`playlist-${id}`} 
                        className="playlist-card p-4 border-2 border-[#C3C9DC] rounded-lg bg-[#1E3168]/60 backdrop-blur-sm hover:bg-[#E63B3F]/20 transition-colors cursor-pointer glass-panel"
                      >
                        <div className="w-full aspect-square mb-2 bg-gradient-to-br from-[#7381C1] to-[#E63B3F] rounded-md overflow-hidden flex items-center justify-center relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="w-10 h-10 text-white opacity-70 hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-[#7381C1] text-white text-xs px-2 py-1 rounded-full">
                            {Math.floor(Math.random() * 15) + 5} tracks
                          </div>
                        </div>
                        <p className="text-white font-medium pixel-body-font truncate">Friend {id}'s Playlist</p>
                        <p className="text-[#C3C9DC] text-sm pixel-body-font truncate">Refreshed Today</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-[#72BEFD]">
                            Y2K Vibes
                          </div>
                          <div className="music-bars scale-75">
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
          </div>
        </div>
      </animated.main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-[#C3C9DC]/30 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="relative">
                <Music2 className="w-6 h-6 text-white relative z-10" />
                <div className="absolute inset-0 bg-[#E63B3F]/30 blur-lg transform scale-150" />
              </div>
              <span className="text-white text-xl font-bold pixel-font">MusicMate</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="#" className="text-[#72BEFD] hover:text-[#E63B3F] transition-colors pixel-body-font">About</a>
              <a href="#" className="text-[#72BEFD] hover:text-[#E63B3F] transition-colors pixel-body-font">Privacy</a>
              <a href="#" className="text-[#72BEFD] hover:text-[#E63B3F] transition-colors pixel-body-font">Terms</a>
            </div>
          </div>
          
          <div className="text-center text-[#C3C9DC] mt-8 pixel-body-font text-sm">
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