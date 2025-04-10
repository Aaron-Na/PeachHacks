import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Music2, UserCog, ArrowLeft, Heart, Disc, Star, MessageCircle, Settings, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Dummy profile data
const profileData = {
  username: "Y2K_MusicLover",
  displayName: "Retro Beats",
  profilePic: "https://i.pinimg.com/736x/b9/5e/0f/b95e0f5e9c56a998d58e7d7d067c8764.jpg",
  joinDate: "April 2025",
  topArtists: ["Daft Punk", "The Prodigy", "Kylie Minogue", "Britney Spears", "Backstreet Boys"],
  favoriteGenres: ["Eurodance", "Y2K Pop", "Trance", "Trip Hop"],
  bio: "Music collector and Y2K enthusiast. Loving the digital aesthetic and collecting virtual friends!",
  stats: {
    friends: 42,
    playlists: 13,
    matches: 28
  }
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profileData });

  // Page fade-in animation
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 },
    delay: 100,
  });

  // Profile card animation
  const profileCardAnim = useSpring({
    from: { transform: 'scale(0.9)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    config: { tension: 280, friction: 20 },
    delay: 300,
  });

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // Here you would typically save to your backend
    // For now, we'll just update our local state
    setIsEditing(false);
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
          
          <div className="flex items-center space-x-2">
            <div className="chrome-button-small flex items-center px-3 py-2">
              <Settings className="w-5 h-5" />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <animated.main style={fadeIn} className="relative z-10 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Card */}
            <animated.div 
              style={profileCardAnim}
              className="w-full md:w-1/3 holographic-card p-6 relative backdrop-blur-md"
            >
              <div className="relative z-10">
                <div className="relative">
                  <img 
                    src={profileData.profilePic} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full mx-auto border-4 border-[#FF80B2] object-cover"
                  />
                  <div className="absolute inset-0 border-4 border-[#00FFFF] rounded-full blur-sm opacity-50 animate-pulse-slow"></div>
                </div>
                
                <h2 className="text-2xl text-white text-center mt-4 pixel-font glow-text">{profileData.displayName}</h2>
                <p className="text-[#00FFFF] text-center pixel-body-font mb-4">@{profileData.username}</p>
                
                <div className="flex justify-center space-x-6 my-6">
                  <div className="text-center">
                    <p className="text-2xl text-white pixel-font">{profileData.stats.friends}</p>
                    <p className="text-[#C0C0C0] text-sm pixel-body-font">Friends</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl text-white pixel-font">{profileData.stats.playlists}</p>
                    <p className="text-[#C0C0C0] text-sm pixel-body-font">Playlists</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl text-white pixel-font">{profileData.stats.matches}</p>
                    <p className="text-[#C0C0C0] text-sm pixel-body-font">Matches</p>
                  </div>
                </div>
                
                <div className="border-t border-b border-[#C0C0C0]/30 py-4 my-4">
                  <p className="text-white pixel-body-font">{profileData.bio}</p>
                </div>
                
                <button 
                  className="chrome-orb-button w-full flex items-center justify-center space-x-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="w-5 h-5" />
                  <span>Edit Profile</span>
                </button>
              </div>
              <div className="holographic-overlay absolute inset-0"></div>
            </animated.div>
            
            {/* Profile Content */}
            <div className="w-full md:w-2/3">
              {/* Profile Tabs */}
              <div className="flex border-b-2 border-[#C0C0C0]/30 mb-6">
                <button 
                  className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <UserCog className="w-5 h-5 mr-2" />
                  Profile
                </button>
                <button 
                  className={`tab-button ${activeTab === 'music' ? 'active' : ''}`}
                  onClick={() => setActiveTab('music')}
                >
                  <Disc className="w-5 h-5 mr-2" />
                  Music Taste
                </button>
                <button 
                  className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
                  onClick={() => setActiveTab('messages')}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Messages
                </button>
              </div>
              
              {/* Profile Tab Content */}
              {activeTab === 'profile' && (
                <div className="holographic-card p-6">
                  <div className="relative z-10">
                    {isEditing ? (
                      <div className="profile-edit-form">
                        <h3 className="text-xl text-white mb-4 pixel-font glow-text">Edit Your Profile</h3>
                        
                        <div className="mb-4">
                          <label className="block text-[#00FFFF] mb-1 pixel-body-font">Display Name</label>
                          <input 
                            type="text" 
                            name="displayName"
                            value={editedProfile.displayName}
                            onChange={handleProfileChange}
                            className="y2k-input w-full"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-[#00FFFF] mb-1 pixel-body-font">Bio</label>
                          <textarea 
                            name="bio"
                            value={editedProfile.bio}
                            onChange={handleProfileChange}
                            className="y2k-input w-full h-24"
                          ></textarea>
                        </div>
                        
                        <div className="flex space-x-4">
                          <button 
                            className="chrome-button flex-1"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </button>
                          <button 
                            className="chrome-orb-button flex-1"
                            onClick={handleSaveProfile}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl text-white mb-4 pixel-font glow-text">Music Identity Card</h3>
                        
                        <div className="retro-profile-card">
                          <div className="mb-6">
                            <h4 className="text-[#FF80B2] pixel-font mb-1">Favorite Genres</h4>
                            <div className="flex flex-wrap gap-2">
                              {profileData.favoriteGenres.map((genre, index) => (
                                <span 
                                  key={index} 
                                  className="y2k-tag"
                                >
                                  {genre}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="text-[#00FFFF] pixel-font mb-1">Top Artists</h4>
                            <ul className="space-y-2">
                              {profileData.topArtists.map((artist, index) => (
                                <li 
                                  key={index} 
                                  className="flex items-center space-x-2 text-white pixel-body-font"
                                >
                                  <Star className="w-4 h-4 text-[#39FF14]" />
                                  <span>{artist}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="music-visualizer-container mt-8">
                            <h4 className="text-white pixel-font mb-2 text-center">Your Music Mood</h4>
                            <div className="music-visualizer">
                              {[...Array(10)].map((_, index) => (
                                <div key={index} className={`visualizer-bar bar${index + 1}`}></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="holographic-overlay absolute inset-0"></div>
                </div>
              )}
              
              {/* Music Taste Tab */}
              {activeTab === 'music' && (
                <div className="holographic-card p-6">
                  <div className="relative z-10">
                    <h3 className="text-xl text-white mb-6 pixel-font glow-text">Your Music Universe</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="retro-card-small p-4">
                        <h4 className="text-[#FF80B2] pixel-font mb-2">Most Played</h4>
                        <ul className="space-y-2">
                          <li className="text-white pixel-body-font">Toxic - Britney Spears</li>
                          <li className="text-white pixel-body-font">Around the World - Daft Punk</li>
                          <li className="text-white pixel-body-font">Breathe - The Prodigy</li>
                        </ul>
                      </div>
                      
                      <div className="retro-card-small p-4">
                        <h4 className="text-[#00FFFF] pixel-font mb-2">Recent Discoveries</h4>
                        <ul className="space-y-2">
                          <li className="text-white pixel-body-font">Baby One More Time - Britney Spears</li>
                          <li className="text-white pixel-body-font">Blue (Da Ba Dee) - Eiffel 65</li>
                          <li className="text-white pixel-body-font">Sandstorm - Darude</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="y2k-cd-player-small relative mx-auto mb-8">
                      <div className="cd-base relative w-48 h-48 rounded-full border-8 border-[#C0C0C0] bg-gradient-to-r from-[#1A1A2E] to-[#00B4B4] p-2 mx-auto">
                        <div className="cd-disc absolute inset-2 rounded-full bg-gradient-to-r from-[#1A1A2E] to-[#000] overflow-hidden flex items-center justify-center animate-spin-slow">
                          <div className="cd-hole w-6 h-6 rounded-full bg-[#000] border-2 border-[#C0C0C0]"></div>
                          <div className="cd-reflection absolute inset-0 bg-gradient-to-tr from-transparent via-[#C0C0C0]/10 to-[#C0C0C0]/30"></div>
                        </div>
                      </div>
                      <h4 className="text-center text-white pixel-font mt-4">Now Listening</h4>
                    </div>
                  </div>
                  <div className="holographic-overlay absolute inset-0"></div>
                </div>
              )}
              
              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="holographic-card p-6">
                  <div className="relative z-10">
                    <h3 className="text-xl text-white mb-4 pixel-font glow-text">Your Messages</h3>
                    
                    <div className="chat-window border-2 border-[#C0C0C0] bg-[#1A1A2E]/80 h-96 overflow-y-auto rounded-lg p-4 mb-4">
                      <div className="text-center text-[#C0C0C0] pixel-body-font">
                        <p>Connect with Spotify to start messaging with your music matches!</p>
                      </div>
                    </div>
                    
                    <button className="chrome-orb-button w-full">
                      Connect Spotify
                    </button>
                  </div>
                  <div className="holographic-overlay absolute inset-0"></div>
                </div>
              )}
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

export default ProfilePage;
