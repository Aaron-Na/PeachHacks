import React, { useState } from 'react';
import { UserPlus, User, KeyRound, FileText, Upload } from 'lucide-react';
import axios from 'axios';

interface ProfileCreationProps {
  onClose: () => void;
  onSuccess: (userData: any) => void;
}

export default function ProfileCreation({ onClose, onSuccess }: ProfileCreationProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Step 1: Create user profile with username/password
      const createResponse = await axios.post('http://localhost:5000/api/users', {
        username,
        password,
        description
      });
      
      const userId = createResponse.data.id;
      
      // Step 2: If there's a profile image, upload it
      if (profileImage) {
        const formData = new FormData();
        formData.append('image', profileImage);
        
        await axios.post(
          `http://localhost:5000/api/users/${userId}/profile-image`, 
          formData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }
      
      // Step 3: Login the user to get token
      const loginResponse = await axios.post('http://localhost:5000/api/login', {
        username,
        password
      });
      
      // Store auth data
      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('userId', loginResponse.data.user_id);
      
      // Notify parent about success
      onSuccess(loginResponse.data);
    } catch (err: any) {
      console.error('Profile creation error:', err);
      setError(err.response?.data?.error || 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if ((step === 1 && username && password) || step === 2) {
      setStep(step + 1);
    } else {
      setError('Please fill out all required fields');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1A2E] border-2 border-[#C0C0C0] rounded-lg p-6 w-full max-w-md mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-[#C0C0C0] hover:text-[#FF1493]"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold text-center text-white mb-6 pixel-font glow-text">
          Create Your Profile
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-[#FF1493]/20 border border-[#FF1493] rounded-md">
            <p className="text-[#FF1493] text-sm pixel-body-font">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <>
              <div className="space-y-3">
                <div className="relative">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 text-[#00FFFF] mr-2" />
                    <label className="text-white pixel-body-font">Username</label>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#0E0E1A] border-2 border-[#C0C0C0] rounded-md p-2 text-white focus:border-[#00FFFF] focus:outline-none pixel-body-font"
                    required
                  />
                </div>
                
                <div className="relative">
                  <div className="flex items-center mb-2">
                    <KeyRound className="w-5 h-5 text-[#00FFFF] mr-2" />
                    <label className="text-white pixel-body-font">Password</label>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0E0E1A] border-2 border-[#C0C0C0] rounded-md p-2 text-white focus:border-[#00FFFF] focus:outline-none pixel-body-font"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="chrome-orb-button"
                >
                  Next Step
                </button>
              </div>
            </>
          )}
          
          {step === 2 && (
            <>
              <div className="relative">
                <div className="flex items-center mb-2">
                  <FileText className="w-5 h-5 text-[#00FFFF] mr-2" />
                  <label className="text-white pixel-body-font">Description</label>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0E0E1A] border-2 border-[#C0C0C0] rounded-md p-2 text-white focus:border-[#00FFFF] focus:outline-none pixel-body-font h-24"
                  placeholder="Tell others about yourself and your music taste..."
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="chrome-button"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="chrome-orb-button"
                >
                  Next Step
                </button>
              </div>
            </>
          )}
          
          {step === 3 && (
            <>
              <div className="relative">
                <div className="flex items-center mb-2">
                  <Upload className="w-5 h-5 text-[#00FFFF] mr-2" />
                  <label className="text-white pixel-body-font">Profile Picture</label>
                </div>
                
                <div className="mb-4 flex justify-center">
                  <div className="w-32 h-32 border-2 border-dashed border-[#C0C0C0] rounded-full flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-[#C0C0C0]" />
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <label className="y2k-button cursor-pointer inline-block text-center">
                    Choose Image
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="chrome-button"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="chrome-orb-button"
                >
                  {isLoading ? 'Creating...' : 'Create Profile'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}