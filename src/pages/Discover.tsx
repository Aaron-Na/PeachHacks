import { useState } from "react";
import ProfileCard from "../components/ProfileCard";

interface Profile {
  name: string;
  img: string;
}

const mockProfiles: Profile[] = [
  { name: "Alice", img: "/static/profile_images/alice.jpg" },
  { name: "Bob", img: "/static/profile_images/bob.jpg" },
  { name: "Charlie", img: "/static/profile_images/charlie.jpg" },
];

const DiscoverPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const randomizeProfile = () => {
    let nextIndex = Math.floor(Math.random() * mockProfiles.length);
    while (nextIndex === currentIndex && mockProfiles.length > 1) {
      nextIndex = Math.floor(Math.random() * mockProfiles.length);
    }
    setCurrentIndex(nextIndex);
  };

  const handleLike = () => {
    console.log("Liked:", mockProfiles[currentIndex].name);
    randomizeProfile();
  };

  const handleDislike = () => {
    console.log("Disliked:", mockProfiles[currentIndex].name);
    randomizeProfile();
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <ProfileCard
        profile={mockProfiles[currentIndex]}
        onLike={handleLike}
        onDislike={handleDislike}
      />
    </div>
  );
};

export default DiscoverPage;
