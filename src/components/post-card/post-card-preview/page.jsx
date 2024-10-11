
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
import supabaseAnon from "@/lib/supabaseAnonClient";

export default async function Component({
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
  const [post, setPost] = useState({
    textContent: textContent,
    images: imagesProp,
    likeCount: likeCount,
    commentCount: commentCount,
    shareCount: shareCount,
  });
  const {
    data: { session },
  } = await supabaseAnon.auth.getSession();
  console.log("sessiohn", session);
  const router = useRouter();

  const openCarousel = () => setIsCarouselOpen(true);
  const closeCarousel = () => setIsCarouselOpen(false);
  const openReply = () => setIsReplyOpen(true);

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
    }
    
  }, [])
  const renderImages = () => (
    post.images.length > 0 && (
      <div className={`grid gap-0.5 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} rounded-2xl border border-white/30 overflow-hidden cursor-pointer active:scale-95 transition-all duration-150 ease-in-out w-fit`}>
        {post.images.map((src, index) => (
          <div 
            className={`relative w-fit flex`} 
            key={index} 
            onClick={() => {openCarousel(index);}}
          >
            <Image
              src={src}
              quality={post.images.length > 1 ? 50 : 100}
              alt={`Image ${index + 1}`}
              layout="intrinsic" // Let the image control the container's size
              width={post.images.length > 1 ? 400 : 700} // Example width based on media length
              height={post.images.length > 1 ? 300 : 500} // Example height based on media length
              className={`${post.images.length > 1 ? "object-cover max-h-52" : "object-contain"} max-h-161`}
            />
          </div>
        ))}
      </div>
    )
  )

  const handleRedirect = () => {
    if (isCurrentPost) return;
    router.replace(`/${username}/post/${postId}`);
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
          creationDate={creationDate}
        />
        <div className="flex">
          {hasReplies && (
            <Separator orientation="vertical" className="h-auto ml-11 bg-white/40" />
          )}

          <div className="">
            <CardContent className="space-y-4">
              <p>{textContent}</p>
              {renderImages()}
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
      <ReplyPopup isOpen={isReplyOpen} setIsOpen={setIsReplyOpen} />
    </>

  )

}



