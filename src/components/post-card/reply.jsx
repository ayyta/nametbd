import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Reply, X } from 'lucide-react'
import PostCardPreview from "@/components/post-card/post-card-preview/page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useState } from "react";
import ReplyText from './post-card-reply/post-card-reply-body/reply-text'
import ReplyUtilities from './post-card-reply/post-card-reply-utilities/reply-utilities'

const Component = ({
  isOpen=false,
  setIsOpen=()=>{},
  user={
    pfp: "/placeholder-avatar.jpg",
    name: "John Doe",
  },
  replier={
    pfp: "/placeholder-avatar.jpg",
    name: "John Doe",
  },
}) => {
  const { pfp, name, username } = user
  const closeReply = () => {
    setIsOpen(false)
  }
  if (!isOpen) return null

  return (
    <div className="fixed w-screen h-screen inset-0 bg-black/50 flex justify-center items-center z-10" onClick={closeReply}>
      <Card className="w-fit h-fit max-h-192 overflow-y-scroll bg-replyBackground border border-white/30 z-20" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="p-6 pb-0 flex flex-row items-center">
          <p className="w-fit text-white font-bold text-xl">Reply</p>
          <Button
            variant="ghost"
            size="icon"
            className=" text-black hover:bg-white/20 hover:text-white rounded-full ml-auto !mt-0"
            onClick={closeReply}
          >
            <X className="w-5 h-5 text-white" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-0.5">
          <PostCardPreview 
            pfp={pfp}
            name={name}
            username={username}
            hasButtons={false}
            hasReplies={true}
          />
          <ReplyCard user={replier} />
        </CardContent>
      </Card>
    </div>
  )
}

const ReplyCard = ({
  user={
    pfp: "/placeholder-avatar.jpg",
    name: "John Doe",
  },
}) => {
  const handleReply = () => {
    console.log("Replying to post");
    // console.log(text);    // Log the reply text
    console.log(media); // Log the media
  }

  const [text, setText] = useState("");   // State to manage the reply text
  const [media, setMedia] = useState([]); // State to manage media uploads
  const [gifs, setGifs] = useState([]);   // State to manage GIFs
  const [displayGifs, setDisplayGifs] = useState(false); // State to manage GIF display
  const [displayPopup, setDisplayPopup] = useState(false); // State to manage popup display

  const { pfp, name } = user
  return (
    <Card className="w-192 h-fit bg-transparent border-none text-white">
      <CardHeader className="flex flex-row items-center gap-4 py-2">
        <Avatar>
          <AvatarImage src={pfp} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-lg font-semibold">{name}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* <Input className={cn(
          "border-input",
          "focus:ring-0 focus:ring-offset-0 focus:border-input focus-visible:ring-0 focus-visible:ring-offset-0",
          "focus-visible:border-input",
          "border-0"
        )}
        placeholder="Reply with ..."
        /> */}
        <ReplyText
          text={text}
          setText={setText} 
        />
      </CardContent>
      <div className='flex justify-between'>
        <CardFooter className="flex justify-star">
          <ReplyUtilities
            setMedia={setMedia}
            setGifs={setGifs}
            displayGifs={displayGifs}
            setDisplayGifs={setDisplayGifs}
            setDisplayPopup={setDisplayPopup}
          />
        </CardFooter>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="text-black font-bold" size="lg" onClick={handleReply}>Reply</Button>
        </CardFooter>
      </div>
    </Card>
  )
}

export default Component