"use client";

import React, { useState, useEffect, forwardRef } from 'react';
import PostCardPreview from '@/components/post-card/post-card-preview/page';
import supabaseAnon from '@/lib/supabaseAnonClient';
import { useAuth } from '@/components/wrappers/AuthCheckWrapper';
import { set } from 'react-hook-form';

const Component = ({
  pageType = "profile", // home, profile, friends
}) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  // useEffect( () => {
  //   const checkAuth = async () => {
  //     const { 
  //         data: { session }
  //       } = await supabaseAnon.auth.getSession();
  //     setUser(session?.user || null);
  //   }
  //   checkAuth();
  // }, [])
  useEffect(() => {
    const fetchPosts = async () => {
      const { 
        data: { session } 
      } = await supabaseAnon.auth.getSession();
      const response = await fetch(`/api/posts/${pageType}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`, // Send the auth token
        },
      });
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data.data);
    }
    fetchPosts();
  },  [])

  return (
    <div className="flex flex-col">
      {posts.map((post, i) => {
        return (
          <PostCardPreview 
            key={i}
            postId={post.post_id}
            userId={user.id} // should be the user that posted 
            username={user.userProfile.username} // should be the user that posted 
            name={user.userProfile.name} // should be the user that posted 
            pfp={user.pfpLink} // should be posted the user that posted 
            creationDate={post.created_at}
            textContent={post.text_content}
            imagesProp={post.mediaList}
            likeCount={post.likeCount}
            commentCount={0} // parse comment count
            shareCount={post.shareCount}
            hasReplies={false}
            hasButtons={true}
          />
        )
      })}
    </div>

  )
}


export default Component;
