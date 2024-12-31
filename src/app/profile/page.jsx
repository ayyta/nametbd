'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Roboto } from 'next/font/google';
import { signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SkeletonProfile } from '@/components/SkeletonComponents';
import Popup from './Popup';
import PostCard from '@/components/post-card';
import { useAuth } from '@/components/wrappers/AuthCheckWrapper';
import { fetchMediaPathByIds, gets3Images } from './utils.js';
import { fetchUserProfile } from "@/components/FetchUserProfile";

const roboto = Roboto({
  weight: ['100', '300', '400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [pfpPath, setPfpPath] = useState(null);
  const [bannerPath, setBannerPath] = useState(null);
  const [pfpLink, setPfpLink] = useState(null);
  const [bannerLink, setBannerLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  //   Setting temp values while it's loading
  const [userCurr, setUserCurr] = useState({
    name: 'Loading...',
    username: 'Loading...',
    bio: '',
    pfp: '/Generic avatar.svg',
    profile_background: '',
    num_of_followers: 0,
  });

  const [otherUser, setOtherUser] = useState({
    name: 'Loading...',
    username: 'Loading...',
    bio: '',
    pfp: '/Generic avatar.svg',
    profile_background: '',
    num_of_followers: 0,
    followYou: false,
    following: true,
    friends: false,
  });

  // This is to update the information after fetching
  useEffect(() => {
    if (userProfile) {
      setUserCurr((prev) => ({
        ...prev,
        name: userProfile.name,
        username: userProfile.username,
        bio: userProfile.bio,
        num_of_followers: userProfile.num_of_followers || 0,
      }));
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUserProfile = await fetchUserProfile(user.id);
      setUserProfile(fetchedUserProfile.userProfile);
      setPfpPath(fetchedUserProfile.pfpPath);
      setBannerPath(fetchedUserProfile.bannerPath);
      setPfpLink(fetchedUserProfile.pfpLink);
      setBannerLink(fetchedUserProfile.bannerLink);
    }
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  // This is to update whenever a user changes their pfp or banner
  useEffect(() => {
    setUserCurr((prev) => ({
      ...prev,
      pfp: pfpLink ? pfpLink : '/Generic avatar.svg',
      profile_background: bannerLink ? `url(${bannerLink})` : '',
    }));
  }, [pfpLink, bannerLink]);


  // Generate 20 posts at a time
  const [posts, setPosts] = useState([
    {
      user_id: null,
      post_id: null,
      title: '',
      text_content: '',
      like_count: '',
      dislike_count: '',
      comments: '',
      created_at: '',
    },
  ]);

  const handleLogout = () => {
    signOut(router);
  };

  function formatNumber(num) {
    if (Math.abs(num) >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + 'M'; // Converts to millions (M)
    } else if (Math.abs(num) >= 1_000) {
      return (num / 1_000).toFixed(1) + 'K'; // Converts to thousands (K)
    } else {
      return num.toString(); // Less than 1,000 stays as is
    }
  }

  let backgroundStyle = {
    backgroundImage:
      userCurr.profile_background !== '' ? `url(${bannerLink})` : '',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <>
      <div className="w-full h-full flex flex-col relative overflow-y-scroll">
        <div
          className={`w-full h-64 mb-6 p-10 flex ${
            userCurr.profile_background === '' ? 'bg-gray-700' : ''
          }`}
          style={backgroundStyle}
        >
          <Avatar className="md:w-28 md:h-28">
            <AvatarImage src={userCurr.pfp} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className={`flex-1 ml-6 flex flex-col ${roboto.className}`}>
            <p className={`text-white text-3xl font-bold `}>{userCurr.name}</p>
            <p className="text-lg text-gray-400">@{userCurr.username}</p>

            <p className="text-xl text-white font-normal my-4">
              {userCurr.bio}
            </p>

            <div className="flex-grow"></div>
            <p className="text-lg text-gray-400 mt-auto">
              {formatNumber(userCurr.num_of_followers)} Followers
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            className="rounded-3xl bg-primary text-white border-2 border-white hover:bg-white hover:text-primary transition-colors duration-200"
          >
            Edit Profile
          </Button>

          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        {loading ? <SkeletonProfile /> : null}
        <div className="w-full h-full flex justify-center">
          <PostCard pageType={"profile"}/>
        </div>
        {isPopupOpen && (
          <>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            {/* Popup*/}
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <Popup
                fetchUserProfile={fetchUserProfile}
                setIsPopupOpen={setIsPopupOpen}
                user={user}
                userProfile={userProfile}
                pfpPath={pfpPath}
                bannerPath={bannerPath}
                pfpLink={pfpLink}
                bannerLink={bannerLink}
                fetchMediaPathByIds={fetchMediaPathByIds}
                setBannerLink={setBannerLink}
                setPfpLink={setPfpLink}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
