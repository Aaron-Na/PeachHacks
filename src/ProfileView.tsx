import React, { useState, useEffect } from 'react';
import { HeartIcon, ThumbsDown, UserPlus, UserX } from 'lucide-react';
import axios from 'axios';

interface ProfileViewProps {
  profileId: number;
  onClose: () => void;
  onLike?: () => void;
  onDislike?: () => void;
}

interface ProfileData {
  id: number;
  username: string;
  description: string;
  profile_image: string | null;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profileId, onClose, onLike, onDislike }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  
  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/users/${profileId}`);
        setProfile(response.data);
        
        // Check if this user is already a friend
        if (userId) {
          const friendStatusResponse = await axios.get(
            `http://localhost:5000/api/users/${userId}/friends/${profileId}/status`
          );
          setIsFriend(friendStatusResponse.data.is_friend);
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.error || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [profileId, userId]);
  
  const handleLike = async () => {
    if (!userId || !token || processing) return;
    
    try {
      setProcessing(true);
      
      // Add as friend if not already a friend
      if (!isFriend) {
        await axios.post(
          `http://localhost:5000/api/users/${userId}/friends/${profileId}`
        );
        setIsFriend(true);
      }
      
      if (onLike) onLike();
    } catch (err: any) {
      console.error('Error liking profile:', err);
      setError(err.response?.data?.error || 'Failed to like profile');
    } finally {
      setProcessing(false);
    }
  };
  
  const handleDislike = async () => {
    if (!userId || !token || processing) return;
    
    try {
      setProcessing(true);
      
      // Remove from friends if currently a friend
      if (isFriend) {
        await axios.delete(
          `http://localhost:5000/api/users/${userId}/friends/${profileId}`
        );
        setIsFriend(false);
      }
      
      if (onDislike) onDislike();
    } catch (err: any) {
      console.error('Error disliking profile:', err);
      setError(err.response?.data?.error || 'Failed to dislike profile');
    } finally {
      setProcessing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1A1A2E] border-2 border-[#C0C0C0] rounded-lg p-6 w-full max-w-md mx-4 text-center">
          <div className="loading-disc"></div>
          <p className="text-white mt-4 pixel-body-font">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (error || !profile) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1A1A2E] border-2 border-[#C0C0C0] rounded-lg p-6 w-full max-w-md mx-4">
          <h2 className="text-2xl font-bold text-center text-[#FF1493] mb-6 pixel-font">Error</h2>
          <p className="text-white text-center pixel-body-font">{error || 'Failed to load profile'}</p>
          <div className="flex justify-center mt-6">
            <button onClick={onClose} className="chrome-button">Close</button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1A2E] border-2 border-[#C0C0C0] rounded-lg p-6 w-full max-w-md mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-[#C0C0C0] hover:text-[#FF1493]"
        >
          ✕
        </button>
        
        <div className="holographic-card p-4 rounded-lg mb-6">
          <div className="relative z-10">
            {profile.profile_image ? (
              <img 
                src={`http://localhost:5000${profile.profile_image}`} 
                alt={profile.username} 
                className="w-32 h-32 object-cover rounded-lg mx-auto mb-4 border-2 border-[#00FFFF]"
              />
            ) : (
              <div className="w-32 h-32 rounded-lg mx-auto mb-4 border-2 border-[#00FFFF] bg-gradient-to-br from-[#1A1A2E] to-[#00B4B4] flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{profile.username.charAt(0).toUpperCase()}</span>
              </div>
            )}
            
            <h2 className="text-2xl font-bold text-center text-white pixel-font glow-text">{profile.username}</h2>
          </div>
          <div className="holographic-overlay absolute inset-0"></div>
        </div>
        
        {profile.description && (
          <div className="bg-[#0E0E1A] border-2 border-[#C0C0C0] rounded-md p-4 mb-6">
            <h3 className="text-[#00FFFF] mb-2 pixel-body-font">About</h3>
            <p className="text-white pixel-body-font">{profile.description}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <button 
            onClick={handleDislike} 
            disabled={processing}
            className="chrome-button flex items-center space-x-2 bg-gradient-to-r from-[#FF1493]/20 to-[#FF1493]/10"
          >
            {isFriend ? (
              <>
                <UserX className="w-5 h-5 text-[#FF1493]" />
                <span>Unfriend</span>
              </>
            ) : (
              <>
                <ThumbsDown className="w-5 h-5 text-[#FF1493]" />
                <span>Dislike</span>
              </>
            )}
          </button>
          
          <button 
            onClick={handleLike} 
            disabled={processing || isFriend}
            className={`chrome-orb-button flex items-center space-x-2 ${isFriend ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isFriend ? (
              <>
                <UserPlus className="w-5 h-5 text-[#00FFFF]" />
                <span>Friends</span>
              </>
            ) : (
              <>
                <HeartIcon className="w-5 h-5 text-[#00FFFF]" />
                <span>Like</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
