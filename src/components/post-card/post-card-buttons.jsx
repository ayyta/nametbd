import React, { useState, forwardRef } from "react"
import { Button } from "@/components/ui/button"

const PostCardActionButton = forwardRef(function PostCardActionButton({
  color,
  initialCount=0,
  Icon,
  callBack=() => {},
}, ref) {
  const [count, setCount] = useState(initialCount);

  // const updateCount = async () => {
  //   try { 
  //     const newCount = await fetch("update count");
  //     setCount(newCount);
  //   } catch (error) {
  //     console.error("Error failed in fetching data", error);
  //   }
  // }

  // // Update the count every 3 seconds
  // useEffect(() => {
  //   setInterval(updateCount(), 3000);
  //   return () => clearInterval(intervalId); // Clean up on unmount
  // }, [])

  const colorVariants = {
    "blue": {
      buttonBackgroundHover: `hover:bg-blue-500/10`,
      iconGroupHover: `group-hover:stroke-blue-400`,
      countColor: `text-blue-500`,
      countGroupHover: `group-hover:text-blue-500`,
    },
    "green": {
      buttonBackgroundHover: `hover:bg-green-600/10`,
      iconGroupHover: `group-hover:stroke-green-500`,
      countColor: `text-green-600`,
      countGroupHover: `group-hover:text-green-600`,
    },
  }

  const handleClick = () => {
    if (callBack) {
      callBack()
    }
  }

  // const updateCount = async () => {
  //   try { 
  //     const newCount = await fetch("update count");
  //     setCount(newCount);
  //   } catch (error) {
  //     console.error("Error failed in fetching data", error);
  //   }
  // }

  // // Update the count every 3 seconds
  // useEffect(() => {
  //   setInterval(updateCount(), 3000);
  //   return () => clearInterval(intervalId); // Clean up on unmount
  // }, [])

  return (
    <Button
      ref={ref}
      className={`
        rounded-3xl 
        ${colorVariants[color].buttonBackgroundHover} 
        hover:text-white 
        group 
        w-fit 
        active:scale-90 
        transition-all 
        duration-150 
        ease-in-out
      `}
      variant="ghost" 
      size="sm"
      onClick={handleClick}
    >
      <Icon 
        className={`
          w-6 
          h-6 
          mr-2  
          ${colorVariants[color].iconGroupHover}
        `}
        color="currentColor"
      />
      <span className={`
        text-sm 
        text-white 
        ${colorVariants[color].countGroupHover} 
      `}>{count}</span>
    </Button>
  )

})

const PostCardInteractionButton = forwardRef(function PostCardButton({
  initialCount = 0,
  activeColor = "red",
  inactiveColor = "gray",
  color = "white",
  callBack = () => {},
  Icon
}, ref) {
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(initialCount);

  // Set the active state and count
  const handleClick = () => {
    setIsActive(!isActive);
    setCount(prevCount => isActive ? prevCount-1 : prevCount+1)
    if (callBack) {
      callBack(!isActive, count)
    }
  }
  const colorVariants = {
    "pink": {
      buttonBackgroundHover: `hover:bg-pink-600/10`,
      iconGroupHover: `group-hover:stroke-pink-500`,
      countColor: `text-pink-600`,
      countGroupHover: `group-hover:text-pink-600`,
    },
  }
  return (
    <Button 
      ref={ref} 
      className={`rounded-3xl ${colorVariants[color].buttonBackgroundHover} group hover:text-white w-fit active:scale-90 transition-all duration-150 ease-in-out`}
      variant="ghost" 
      size="sm"
      onClick={handleClick}
    >
      <Icon 
        fill={`${isActive ? activeColor: inactiveColor}`} 
        strokeWidth={`${isActive ? 0: 2}`} 
        className={`w-6 h-6 mr-2 group-hover:stroke-pink-500`}
        color="currentColor"

      />
      <span 
        className={`
          text-sm 
          ${isActive ? colorVariants[color].countColor : `text-white`} 
          ${colorVariants[color].countGroupHover} 
          transition-colors 
          duration-150`}
      >      
        {count}
      </span>
    </Button>
  )
})

export { PostCardActionButton, PostCardInteractionButton }