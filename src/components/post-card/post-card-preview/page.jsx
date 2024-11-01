
"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import PostCardPreviewHeader from "@/components/post-card/post-card-preview/header";
import PostCardPreviewFooter from "@/components/post-card/post-card-preview/footer";
import PostCardCarousel from "@/components/post-card/post-card-carousel";
import ReplyPopup from "@/components/post-card/reply";
import { useAuth } from '@/components/wrappers/AuthCheckWrapper';
import { set } from "date-fns";

export default function Component({
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
}) {
  
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [user, setUser] = useState({
    pfp: pfp, 
    name: name, 
    username: username, 
    bio: "", 
    following_count: 0, 
    follower_count: 0, 
    followsYou: false, 
    following: false, 
    friends: false
  });
  const [replier, setReplier] = useState({});
  const [post, setPost] = useState("");
  const router = useRouter();
  const openCarousel = () => setIsCarouselOpen(true);
  const closeCarousel = () => setIsCarouselOpen(false);
  const openReply = () => setIsReplyOpen(true);

  const fetchReplier = () => {
    let { user } = useAuth();
    return {
      pfp: user.pfpLink,
      name: user.userProfile.name,
      username: user.userProfile.username,
    };
  }
  const replierData = fetchReplier();

  useEffect(() => {

    if (!isLoaded) {
      // name, username, creationDate, textContent, imagesProp, likeCount, commentCount, shareCount
      // fetch all of user
      // fetch 
      
    } else {
      // fetch user data
      setUser({
        pfp: pfp, 
        name: name, 
        username: username, 
        bio: "some bio", 
        following_count: 0, 
        follower_count: 0, 
        followsYou: false, 
        following: false, 
        friends: false
      });
      setPost({
        postId: postId,
        creationDate: creationDate,
        textContent: textContent,
        images: imagesProp,
        likeCount: likeCount,
        commentCount: commentCount,
        shareCount: shareCount,
      });
      setReplier(replierData);
    }

  }, [])
  const renderImages = () => (
    post.images.length > 0 && (
      <div className={`grid gap-0.5 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} rounded-2xl border border-white/30 overflow-hidden cursor-pointer active:scale-95 transition-all duration-150 ease-in-out w-fit`}>
        {post.images && post.images.map((src, index) => {
          const isVideo = src.includes(".mp4") || src.includes(".mov");
          return (
            <div 
              className={`relative w-fit flex`} 
              key={index} 
              onClick={(e) => {e.stopPropagation(); openCarousel(index);}}
            >
              {isVideo ? (
                <video 
                  width={post.images.length > 1 ? 400 : 700} 
                  height={post.images.length > 1 ? 300 : 500} 
                  controls 
                  className={`${post.images.length > 1 ? "object-cover max-h-52" : "object-contain"} max-h-161`}
                >
                  <source src={src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={src}
                  quality={post.images.length > 1 ? 50 : 100}
                  alt={`Image ${index + 1}`}
                  layout="intrinsic" // Let the image control the container's size
                  width={post.images.length > 1 ? 400 : 700} // Example width based on media length
                  height={post.images.length > 1 ? 300 : 500} // Example height based on media length
                  className={`${post.images.length > 1 ? "object-cover max-h-52" : "object-contain"} max-h-161`}
                />
              )}
            </div>
          )}
        )}
      </div>
    )
  )

  const handleRedirect = () => {
    if (isCurrentPost) return;

    if (postId && username) {
      const searchParams = new URLSearchParams({ 
        userId: userId,
        pfp: user.pfp,
        name: user.name,
        username: user.username,
        creationDate: creationDate,
        textContent: post.textContent,
        imagesProp: JSON.stringify(post.images),
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        shareCount: post.shareCount,
      });
      router.push(`/${username}/post/${postId}?${searchParams.toString()}`);
    } else {
      console.error("Post ID or username not provided");
    }
  }
  // optimize image loading by allowing optimization from s3 bucket in next.config.js remotePatterns
  return (
    <>
      <Card 
        className={`w-192 h-fit bg-transparent border-none text-white ${!isCurrentPost ? "hover:cursor-pointer": ""}`} 
        onClick={handleRedirect}
      >
        <PostCardPreviewHeader
          pfp={pfp}
          name={name}
          username={username}
          creationDate={post.creationDate}
          user={user}
        />
        <div className="flex">
          {hasReplies && (
            <Separator orientation="vertical" className="h-auto ml-11 bg-white/40" />
          )}

          <div className="">
            <CardContent className="space-y-4">
              <p>{textContent}</p>
              {post.images && renderImages()}
            </CardContent>
            <PostCardPreviewFooter
              hasButtons={hasButtons}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              shareCount={post.shareCount}
              postId={postId}
              userId={userId}
              openReply={openReply}
            />
          </div>
        </div>
      </Card>
      <PostCardCarousel 
        images={post.images} 
        isCarouselOpen={isCarouselOpen} 
        closeCarousel={closeCarousel}
      />
      <ReplyPopup 
        user={user} 
        replier={replier} 
        isOpen={isReplyOpen} 
        setIsOpen={setIsReplyOpen} 
        postData={post}
        
        />
    </>

  )

}



