'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function ProfilePopup({user, setUser}) {
//   const [tempUser, setUser] = useState({
//     pfp: '',
//     name: 'Beth',
//     username: 'beth_rose',
//     bio: 'sugma',
//     following_count: 31,
//     follower_count: 31,
//     followsYou: true,
//     following: false,
//     friends: false,
//   });

  const getButtonText = () => {
    if (user.following) {
      return 'Following';
    } else if (user.followsYou) {
      return 'Follow Back';
    }
    return 'Follow';
  };

  const handleFollowClick = () => {
    if (user.following) {
        setUser((prev) => ({
            ...prev,
            following: false,
            follower_count: prev.follower_count - 1,
        }))
    }
    else{
        setUser((prev) => ({
            ...prev,
            following: true,
            follower_count: prev.follower_count + 1,
        }))
    }
  };

  return (
    <div 
      className="rounded-2xl bg-primary w-[430px] h-auto flex flex-col p-4 shadow shadow-white"
      onClick={(e) => e.stopPropagation()}  // Prevent clicks from propagating
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src={user.pfp} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col ml-4">
            <p className="font-light">{user.name}</p>
            <p className="font-light text-[#909090]">@{user.username}</p>
          </div>
        </div>
        <DotsHorizontalIcon className="w-5 h-5" />
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <p className="font-light">{user.bio}</p>
        <div className="flex gap-4">
          <p>
            <span className="font-bold">{user.following_count}</span> <span className="text-[#909090]">Following</span>
          </p>
          <p>
            <span className="font-bold">{user.follower_count}</span> <span className="text-[#909090]">Followers</span>
          </p>
        </div>
        <Button
          className={`transition-colors ${user.following ? 'bg-black text-white' : 'hover:bg-black hover:text-white'} mb-2`}
          variant="secondary"
          onClick={handleFollowClick}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
  
}
