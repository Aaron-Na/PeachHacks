import React, { useState, useEffect } from 'react';
import { User, RefreshCw, UserX } from 'lucide-react';
import axios from 'axios';

interface FriendsListProps {
  onClose: () => void;
  onViewProfile: (profileId: number) => void;
}

interface Friend {
  id: number;
  username: string;
  description: string;
  profile_image: string | null;
}

const FriendsList: React.FC<FriendsListProps> = ({ onClose, onViewProfile }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingFriend, setRemovingFriend] = useState<number | null>(null);
  
  const userId = localStorage.getItem('userId');
  
  const fetchFriends = async () => {
    if (!userId) {
      setError('You must be logged in to view friends');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/users/${userId}/friends`);
      setFriends(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching friends:', err);
      setError(err.response?.data?.error || 'Failed to load friends');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFriends();
  }, [userId]);
  
  const handleRemoveFriend = async (friendId: number) => {
    if (!userId) return;
    
    try {
      setRemovingFriend(friendId);
      await axios.delete(`http://localhost:5000/api/users/${userId}/friends/${friendId}`);
      
      // Update the friends list
      setFriends(friends.filter(friend => friend.id !== friendId));
    } catch (err: any) {
      console.error('Error removing friend:', err);
      setError(err.response?.data?.error || 'Failed to remove friend');
    } finally {
      setRemovingFriend(null);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1A2E] border-2 border-[#C0C0C0] rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-[#C0C0C0] hover:text-[#FF1493]"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold text-center text-white mb-6 pixel-font glow-text">
          Your Friends
        </h2>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-[#00FFFF] pixel-body-font">
            {friends.length} {friends.length === 1 ? 'Friend' : 'Friends'} Found
          </p>
          
          <button 
            onClick={fetchFriends} 
            className="chrome-button flex items-center space-x-1 px-3 py-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-[#FF1493]/20 border border-[#FF1493] rounded-md">
            <p className="text-[#FF1493] text-sm pixel-body-font">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="loading-disc"></div>
            <p className="text-white mt-4 pixel-body-font">Loading friends...</p>
          </div>
        ) : friends.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0E0E1A] rounded-lg border border-[#C0C0C0]/30">
            <User className="w-12 h-12 text-[#C0C0C0] mb-4" />
            <p className="text-white text-center pixel-body-font">You haven't added any friends yet!</p>
            <p className="text-[#C0C0C0] text-center text-sm mt-2 pixel-body-font">
              Browse profiles and like them to add friends.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {friends.map(friend => (
              <div 
                key={friend.id}
                className="friend-card flex items-center space-x-3 p-4 border-2 border-[#C0C0C0] rounded-lg bg-[#1A1A2E]/60 backdrop-blur-sm hover:bg-[#0E0E1A] transition-colors"
              >
                <div 
                  className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden"
                  onClick={() => onViewProfile(friend.id)}
                >
                  {friend.profile_image ? (
                    <img 
                      src={`http://localhost:5000${friend.profile_image}`} 
                      alt={friend.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#00B4B4] flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{friend.username.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => onViewProfile(friend.id)}
                >
                  <h3 className="text-white text-lg font-medium pixel-body-font truncate">{friend.username}</h3>
                  {friend.description && (
                    <p className="text-[#C0C0C0] text-sm truncate pixel-body-font">{friend.description}</p>
                  )}
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFriend(friend.id);
                  }}
                  disabled={removingFriend === friend.id}
                  className="p-2 text-[#FF1493] hover:bg-[#FF1493]/20 rounded-full transition-colors"
                >
                  <UserX className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
