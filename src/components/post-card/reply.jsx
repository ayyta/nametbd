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
import TextareaAutosize from "react-textarea-autosize"
import ReplyUtilities from './post-card-reply-utilities/reply-utilities'

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
  postData={}

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
            creationDate={postData.creationDate}
            imagesProp={postData.images}
            textContent={postData.textContent}
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
  }

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
        <TextareaAutosize
          className='w-full p-2.5 overflow-hidden overflow-y-hidden overflow-x-hidden resize-none outline-none bg-transparent focus:border focus:rounded-md'
          minRows={1}
          maxRows={5}
          placeholder='Reply with ...'
        />
      </CardContent>
      <div className='flex justify-between'>
        <CardFooter className="flex justify-star">
          <ReplyUtilities />
        </CardFooter>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="text-black font-bold" size="lg" onClick={handleReply}>Reply</Button>
        </CardFooter>
      </div>
    </Card>
  )
}

export default Component