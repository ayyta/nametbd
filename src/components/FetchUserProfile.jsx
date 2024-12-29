import { fetchMediaPathByIds, gets3Images } from '@/app/profile/utils';


export async function fetchUserProfile(userId) {
  try {
    const response = await fetch(`/api/profile/user?userId=${userId}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Failed to fetch user profile');
    const data = await response.json();
    const { pfpPath, bannerPath } = await fetchMediaPathByIds(
      data[0].pfp,
      data[0].profile_background,
    );
    const mediaLinks = await gets3Images(pfpPath, bannerPath);
    
    const userProfile = data[0];
    const pfpLink = mediaLinks[0];
    const bannerLink = mediaLinks[1];

    return { 
      userProfile: userProfile, 
      pfpLink: pfpLink, 
      bannerLink: bannerLink,
      pfpPath: pfpPath,
      bannerPath: bannerPath
    };

  } catch (error) {
    console.log("ERERRROR IN FETHC UER PROFILE")
    console.error(error.message);
  }
}