
"use client"

import React, { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, Share2, X } from "lucide-react"
import Image from "next/image"
import PostCardCarousel from "@/components/post-card/post-card-carousel"

import { PostCardActionButton, PostCardInteractionButton } from "@/components/post-card/post-card-buttons"
import { comment } from "postcss"

export default function Component({
  postId=null,
  userId=null,
  pfp = "/placeholder-avatar.jpg",
  name = "John Doe",
  username = "@johndoe",
  bio="some bio",
  following_count=0,
  follower_count=0,
  followsYou=false,
  following=false, 
  friends=false,
  creationDate = "2h ago",
  content = "This is a sample post content. It can be much longer and will wrap to multiple lines if needed. ",
  images = ["/massageServices.jpg", "/haircut2.jpg", "/massageServices.jpg", "/haircut2.jpg"],
  likeCount = 0,
  commentCount = 0,
  shareCount = 0,
}) {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);

  const openCarousel = () => {
    setIsCarouselOpen(true)
  }

  const closeCarousel = () => {
    setIsCarouselOpen(false)
  }

  const handleLike = (isActive, count) => {
    console.log(`Like is now ${isActive ? "active": "inactive"} with count: ${count}`);
  }

  const handleShare = () => {
    console.log("Pressed share button");
  }

  const handleComment = () => {
    console.log("Pressed comment button");
  }


  // optimize image loading by allowing optimization from s3 bucket in next.config.js remotePatterns
  return (
    <>
      <Card className="w-192 h-fit bg-transparent border-none text-white">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={pfp} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-lg font-semibold">{name}</p>
            <p className="text-sm text-gray-500">{username} • {creationDate}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{content}</p>
          {images.length > 0 && (
            <div className={`grid gap-0.5 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} rounded-2xl border border-white/30 overflow-hidden cursor-pointer active:scale-95 transition-all duration-150 ease-in-out`}>
              {images.map((src, index) => (
                <div 
                  className={`relative w-full flex justify-center`} 
                  key={index} 
                  onClick={() => {openCarousel(index);}}
                >
                  <Image
                    src={src}
                    quality={images.length > 1 ? 50 : 100}
                    alt={`Image ${index + 1}`}
                    layout="intrinsic" // Let the image control the container's size
                    width={images.length > 1 ? 400 : 700} // Example width based on media length
                    height={images.length > 1 ? 300 : 500} // Example height based on media length
                    className={`${images.length > 1 ? "object-cover max-h-52" : "object-contain"} max-h-161`}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-5">
          <PostCardInteractionButton 
            initialCount={abbreviateNumber(likeCount)}
            activeColor="#f91980"
            inactiveColor=""
            color="pink"
            callBack={handleLike} 
            Icon={Heart} 
          />
          <PostCardActionButton
            initialCount={abbreviateNumber(commentCount)}
            color="blue"
            callBack={handleComment}
            Icon={MessageCircle}
          />
          <PostCardActionButton
            initialCount={abbreviateNumber(shareCount)}
            color="green"
            callBack={handleShare}
            Icon={Share2}
          />
        </CardFooter>
      </Card>
      <PostCardCarousel 
        images={images} 
        isCarouselOpen={isCarouselOpen} 
        closeCarousel={closeCarousel}
      />
    </>

  )

}

function abbreviateNumber(number) {
  if (number >= 1_000_000_000) {
    return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  } else {
    return number.toString();
  }
}