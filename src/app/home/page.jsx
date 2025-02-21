"use client";

import { useState, useEffect, useRef } from "react";
import PostCardPreview from "@/components/post-card/post-card-preview/page";


export default function Home() {
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // We'll observe this "load more" trigger at the bottom of the page
  const loadMoreRef = useRef();

  // Fetch posts from our API
  const fetchPosts = async () => {
    try {
      setLoading(true);
  
      // Call your API route with limit & offset
      const response = await fetch(`/api/home?limit=10&offset=${offset}`);
      if (!response.ok) throw new Error("Failed to fetch posts");
  
      const data = await response.json();
      console.log("Fetched posts:", data.data);
  
      // If we get fewer than 10 posts, we've reached the end
      if (data.data.length < 10) {
        setHasMore(false);
      }
  
      // Append the new posts
      setPosts(data.data);
  
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Intersection Observer to load more when the user scrolls to `loadMoreRef`
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !loading) {
          fetchPosts();
        }
      },
      { threshold: 0.1 } // Adjust as needed
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, []);
  /*
    postId=null,
  userId=null,
  pfp = "/placeholder-avatar.jpg",
  name="",
  username = "",
  creationDate = "",
  textContent = "",
  imagesProp = [],
  likeCount = 0,
  commentCount = 0,
  shareCount = 0,
  hasReplies = false,
  hasButtons = true,
  isCurrentPost = false,
  isLoaded = name && username && creationDate,
  */
 console.log("posts", posts);
  return (
    <div className="flex flex-col items-center overflow-auto h-screen">
      <h1 className="text-xl font-bold mb-4 text-white pt-4 relative after:block after:mt-1 after:h-[2px] after:w-[60%] after:bg-white after:mx-auto">Home</h1>

      {posts.map((post) => (
        <PostCardPreview 
          postId={post.postId}
          userId={post.userId}
          pfp={post.pfp}
          name={post.name}
          username={post.username}
          creationDate={post.creationDate}
          textContent={post.textContent}
          imagesProp={post.imagesProp}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          shareCount={post.shareCount}
          hasReplies={false}  // Add this prop
          hasButtons={true}  // Add this prop  

        />
      ))}

      {/* This element triggers infinite scroll when in view */}
      <div ref={loadMoreRef} className="h-4 w-full" />

      {/* Show loading spinner */}
      {loading && <p>Loading more posts...</p>}

      {/* If no more posts, let users know */}
      {!hasMore && <p>No more posts available.</p>}
    </div>
  );
}