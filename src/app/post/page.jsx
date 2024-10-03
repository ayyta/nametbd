"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronsUpDown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PostCardPreview from "@/components/post-card/post-card-preview";
const Component = ({  
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
  images = ["/massageServices.jpg", "/haircut2.jpg", "/massageServices.jpg", "/haircut2.jpg"]}) => {
  
  const router = useRouter();
  // call backend

  const sortOptions = [
    { label: "Relevance", value: "relevance" },
    { label: "Newest", value: "newest" },
    { label: "Most Liked", value: "most_liked" },
  ]
  return (
    <div className="w-full h-full relative flex flex-col items-center overflow-y-scroll	">
      <div class="w-192 ">
        <Header router={router} title={"Note"}/>
        <PostCardPreview/>
        <div className="w-full flex flex-row items-center justify-between p-4 border-y border-white/50">
          <p className="text-white font-bold text-lg ">Replies</p>
          <SortByDropDown sortOptions={sortOptions}/>
        </div>
        <PostCardPreview/>

      </div>

    </div>
  );
};

const Header = ({
  title="Note",
  router
}) => {
  const handleBack = () => {
    router.back();
  }
  return (
    <div className="w-192 h-10 flex flex-row items-center text-white my-4">
      <ArrowLeft className="cursor-pointer" onClick={handleBack}/>
      <div className="flex-grow flex justify-center">
        <h1 className="relative inline-block text-center font-bold text-2xl" >
          <span>{title}</span>
          <span className="absolute bottom-0 left-1/2 w-3/4 h-0.5 bg-current transform -translate-x-1/2"></span>
        </h1>
      </div>
    </div>
  );
}

const SortByDropDown = ({sortOptions=[]}) => {
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-fit justify-between">
          <span>Sort By: {selectedSort.label}</span>
          <ChevronsUpDown className="cursor-pointer ml-2 h-4 w-4 shrink-0 opacity-50"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="select-none">Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sortOptions.map((option) => (
          <DropdownMenuItem 
            key={option.value} 
            onSelect={() => setSelectedSort(option)}
            className="flex items-center justify-between hover:bg-primary/30 cursor-pointer"
          >
            {option.label}
            {option.value === selectedSort.value && (
              <Check className="h-4 w-4"/>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default Component;