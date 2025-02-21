import { format } from 'date-fns';
import supabaseService from './supabaseServiceClient';
import { fetchUserProfile } from '@/components/FetchUserProfile';
// Given post, format created_at field
function formatCreatedAt(posts) {
  if (!posts) return [];
  posts.forEach(post => {
    const postDate = new Date(post.created_at);
    const now = new Date();
    
    const diffHours = (now - postDate) / (1000 * 60 * 60); // Difference in hours
  
    if (diffHours < 24) {
      // If it's less than 24 hours, display like "3 hrs ago"
      if (diffHours >= 1) {
        // If more than 1 hour, display in hours
        post.created_at = `${Math.round(diffHours)} hrs`;
      } else {
        // If less than 1 hour, display in minutes
        const diffMinutes = differenceInMinutes(now, postDate);
        post.created_at = `${Math.round(diffMinutes)} min${diffMinutes > 1 ? 's' : ''}`;
      }
    } else {
      // If it's more than 24 hours, display the formatted date like "Oct 16, 07:04 AM"
      post.created_at = format(postDate, 'MMM d'); // e.g., "Oct 16, 07:04 AM"
    }
  });
  return posts;
}

// Fetch the media for each post
async function fetchMediaForPosts(posts) {
    if (!posts) return [];

    for (const post of posts) {
      const { data } = await supabaseService
        .from("media")
        .select("*")
        .eq("post_id", post.post_id);
      const mediaList = data;
      if (!mediaList) {
        post.mediaList = [];
        continue;
      }
      const s3Paths = mediaList.filter(media => media.media_type === "s3").map(media => media.media_path);
      const mediaLinks = mediaList.filter(media => media.media_type === "gif").map(media => media.gif_url);

      const params = new URLSearchParams();
      s3Paths.forEach((imagePath) => {
        params.append('paths', imagePath);
      });

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/s3?${params.toString()}`, {
          method: 'GET',
        })
        const data = await response.json();
        // Add the media links to the post object
        data.data.forEach((link) => {
          mediaLinks.push(link);
        });
      } catch (error) {
        console.error('Error using GET on s3 buckets: ', error.message);
      }
      post.mediaList = mediaLinks;
    }
    return posts;
}


const differenceInMinutes = (date1, date2) => {
  // Convert both dates to milliseconds
  const diffMilliseconds = Math.abs(date1 - date2);

  // Convert milliseconds to minutes (1000ms = 1 second, 60 seconds = 1 minute)
  const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));

  return diffMinutes;
};
export { formatCreatedAt, fetchMediaForPosts };