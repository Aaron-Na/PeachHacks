import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';

// Local avatar paths
const LOCAL_AVATARS = {
  user: '/images/avatars/default-avatar.svg',
  charlie: '/images/avatars/charlie.svg',
  alex: '/images/avatars/alex.svg',
  jordan: '/images/avatars/jordan.svg',
  taylor: '/images/avatars/taylor.svg',
  riley: '/images/avatars/riley.svg'
};

interface Message {
  user: string;
  message: string;
  avatar: string;
  glitter?: string;
  timestamp: string;
}

interface Friend {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
}

interface PrivateChatProps {
  friends: Friend[];
  currentUser: {
    id: number;
    name: string;
    avatar: string;
  };
}

const PrivateChat: React.FC<PrivateChatProps> = ({ friends, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend) return;

    const message = {
      user: currentUser.name,
      message: newMessage.trim(),
      avatar: currentUser.avatar || LOCAL_AVATARS.user,
      timestamp: new Date().toISOString(),
      glitter: Math.random() > 0.8 ? '✨' : '' // Use empty string instead of undefined
    };

    try {
      console.log('Sending message:', message);
      
      const response = await fetch('http://localhost:5000/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        // Get the saved message from the server response
        const savedMessage = await response.json();
        // Add the message to local state after confirming server received it
        setMessages([...messages, savedMessage]);
        setNewMessage('');
      } else {
        const errorData = await response.text();
        console.error(`Failed to send message: Status ${response.status}, Response: ${errorData}`);
        alert(`Failed to send message: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="holographic-card p-6">
      <div className="relative z-10">
        <h3 className="text-xl text-white mb-4 pixel-font glow-text">Private Chat</h3>
        
        {/* Friends List */}
        <div className="flex space-x-4 mb-4 overflow-x-auto pb-2">
          {friends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => setSelectedFriend(friend)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                selectedFriend?.id === friend.id
                  ? 'bg-[#39FF14]/20 border-2 border-[#39FF14]'
                  : 'bg-[#1A1A2E]/50 border-2 border-[#C0C0C0]/30'
              }`}
            >
              <div className="relative">
                <img
                  src={friend.avatar || LOCAL_AVATARS[friend.name.toLowerCase() as keyof typeof LOCAL_AVATARS] || LOCAL_AVATARS.user}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1A1A2E] ${
                    friend.online ? 'bg-[#39FF14]' : 'bg-[#C0C0C0]'
                  }`}
                />
              </div>
              <span className="text-white text-sm mt-2 pixel-body-font">{friend.name}</span>
            </button>
          ))}
        </div>

        {/* Chat Window */}
        <div className="chat-window border-2 border-[#C0C0C0] bg-[#1A1A2E]/80 h-96 overflow-y-auto rounded-lg p-4 mb-4">
          {selectedFriend ? (
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 mb-4 ${
                    msg.user === currentUser.name ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <img
                    src={msg.avatar || LOCAL_AVATARS.user}
                    alt={msg.user}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div
                    className={`relative max-w-[70%] px-4 py-2 rounded-lg ${
                      msg.user === currentUser.name
                        ? 'bg-[#39FF14]/20 text-right'
                        : 'bg-[#C0C0C0]/20'
                    }`}
                  >
                    <p className="text-white pixel-body-font">{msg.message}</p>
                    {msg.glitter && (
                      <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-[#FFD700] animate-pulse" />
                    )}
                    <span className="text-[#C0C0C0] text-xs block mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </>
          ) : (
            <div className="text-center text-[#C0C0C0] pixel-body-font h-full flex items-center justify-center">
              <p>Select a friend to start chatting!</p>
            </div>
          )}
        </div>

        {/* Message Input */}
        {selectedFriend && (
          <form onSubmit={sendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[#1A1A2E] text-white pixel-body-font border-2 border-[#C0C0C0]/30 rounded-lg px-4 py-2 focus:outline-none focus:border-[#39FF14]"
            />
            <button
              type="submit"
              className="chrome-orb-button px-4 py-2 flex items-center space-x-2"
              disabled={!newMessage.trim()}
            >
              <Send className="w-5 h-5" />
              <span>Send</span>
            </button>
          </form>
        )}
      </div>
      <div className="holographic-overlay absolute inset-0"></div>
    </div>
  );
};

export default PrivateChat;
