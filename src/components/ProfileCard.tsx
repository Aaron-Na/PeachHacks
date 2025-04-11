import React from "react";

interface Profile {
  name: string;
  img: string;
}

interface Props {
  profile: Profile;
  onLike: () => void;
  onDislike: () => void;
}

const ProfileCard: React.FC<Props> = ({ profile, onLike, onDislike }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-80 text-center">
      <img
        src={profile.img}
        alt={profile.name}
        className="rounded-xl mb-4 w-full h-64 object-cover"
      />
      <h2 className="text-2xl font-semibold">{profile.name}</h2>
      <div className="mt-4 space-x-4">
        <button
          onClick={onDislike}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Dislike 👎
        </button>
        <button
          onClick={onLike}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Like 👍
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
