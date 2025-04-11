// src/pages/Registration.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCreation from '../components/ProfileCreation';
import { UserPlus, Star, Heart, Square, PlusSquare } from 'lucide-react';

// Y2K-inspired floating shapes component (similar to App.tsx)
const FloatingShapes = () => {
  const shapes = [
    { type: Star, color: '#ff77aa', size: 24, position: { top: '15%', left: '10%' } },
    { type: Heart, color: '#3adfd4', size: 28, position: { top: '25%', right: '15%' } },
    { type: Star, color: '#33a7ff', size: 20, position: { bottom: '20%', left: '15%' } },
    { type: Square, color: '#7f5fc5', size: 22, position: { bottom: '30%', right: '10%' } },
    { type: PlusSquare, color: '#ff77aa', size: 26, position: { top: '40%', left: '20%' } },
  ];

  return (
    <div className="floating-shapes fixed inset-0 pointer-events-none">
      {shapes.map((shape, index) => {
        const ShapeIcon = shape.type;
        return (
          <div
            key={index}
            className="absolute animate-float"
            style={{
              ...shape.position,
              animation: `float 8s ease-in-out ${index * 0.5}s infinite alternate`
            }}
          >
            <ShapeIcon 
              size={shape.size} 
              color={shape.color} 
              className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" 
            />
          </div>
        );
      })}
    </div>
  );
};

const Registration: React.FC = () => {
  const navigate = useNavigate();
  
  const handleProfileSuccess = (userData: any) => {
    // After successful profile creation, navigate to profile page
    navigate('/profile');
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-deep-space">
      {/* Background elements similar to App.tsx */}
      <div className="grid-overlay absolute inset-0" />
      <div className="scanline absolute inset-0" />
      <div className="bg-gradient absolute inset-0 opacity-70" />
      
      {/* Y2K decorative elements */}
      <FloatingShapes />
      
      {/* Header with back button */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="chrome-button flex items-center space-x-2"
          >
            <span>← Back to Home</span>
          </button>
        </div>
      </header>
      
      {/* Center the ProfileCreation component */}
      <div className="flex justify-center items-center min-h-screen pt-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 pixel-font glow-text">
            Join <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff77aa] to-[#3adfd4]">MusicMate</span>
          </h1>
          <p className="text-xl text-[#C0C0C0] mb-8 pixel-body-font">
            Create your Y2K-inspired profile and start finding music matches!
          </p>
          
          <ProfileCreation 
            onClose={() => navigate('/')} 
            onSuccess={handleProfileSuccess}
          />
        </div>
      </div>
      
      {/* Y2K-inspired decorative footer */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-[#ff77aa] to-[#3adfd4] opacity-70"></div>
    </div>
  );
};

export default Registration;