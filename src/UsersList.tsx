import React, { useState, useEffect } from 'react';
import { Search, User, HeartIcon, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface UsersListProps {
  onClose: () => void;
  onViewProfile: (profileId: number) => void;
}

interface UserProfile {
  id: number;
  username: string;
  description: string;
  profile_image: string | null;
}

const UsersList: React.FC<UsersListProps> = ({ onClose, onViewProfile }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState<number[]>([]);
  
  const currentUserId = localStorage.getItem('userId');
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/users`);
      
      // Filter out the current user
      const otherUsers = response.data.filter((user: UserProfile) => 
        user.id.toString() !== currentUserId
      );
      
      setUsers(otherUsers);
      setFilteredUsers(otherUsers);
      
      // If user is logged in, fetch their friends to mark existing friends
      if (currentUserId) {
        try {
          const friendsResponse = await axios.get(`http://localhost:5000/api/users/${currentUserId}/friends`);
          const friendIds = friendsResponse.data.map((friend: { id: number }) => friend.id);
          setFriends(friendIds);
        } catch (err) {
          console.error('Error fetching friends:', err);
        }
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, [currentUserId]);
  
  useEffect(() => {
    // Filter users based on search term
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.description && user.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);
  
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
          Browse Profiles
        </h2>
        
        {/* Search */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#C0C0C0]" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-[#0E0E1A] border-2 border-[#C0C0C0] rounded-md py-2 pl-10 pr-4 text-white focus:border-[#00FFFF] focus:outline-none pixel-body-font"
          />
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-[#00FFFF] pixel-body-font">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'} Found
          </p>
          
          <button 
            onClick={fetchUsers} 
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
            <p className="text-white mt-4 pixel-body-font">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0E0E1A] rounded-lg border border-[#C0C0C0]/30">
            <User className="w-12 h-12 text-[#C0C0C0] mb-4" />
            <p className="text-white text-center pixel-body-font">No users found!</p>
            <p className="text-[#C0C0C0] text-center text-sm mt-2 pixel-body-font">
              {searchTerm ? 'Try a different search term.' : 'Be the first to create a profile!'}
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {filteredUsers.map(user => (
              <div 
                key={user.id}
                onClick={() => onViewProfile(user.id)}
                className="user-card flex items-center space-x-3 p-4 border-2 border-[#C0C0C0] rounded-lg bg-[#1A1A2E]/60 backdrop-blur-sm hover:bg-[#0E0E1A] transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden">
                  {user.profile_image ? (
                    <img 
                      src={`http://localhost:5000${user.profile_image}`} 
                      alt={user.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#00B4B4] flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{user.username.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-white text-lg font-medium pixel-body-font truncate">{user.username}</h3>
                    {friends.includes(user.id) && (
                      <HeartIcon className="w-4 h-4 text-[#FF1493] flex-shrink-0" />
                    )}
                  </div>
                  {user.description && (
                    <p className="text-[#C0C0C0] text-sm truncate pixel-body-font">{user.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
