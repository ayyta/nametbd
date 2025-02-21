import React, { useState, forwardRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { set } from "date-fns";

const PostCardActionButton = forwardRef(function PostCardActionButton({
  color,
  initialCount=0,
  Icon,
  callBack=() => {},
}, ref) {

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

  const handleClick = (e) => {
    e.stopPropagation();

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
      `}>{abbreviateNumber(initialCount)}</span>
    </Button>
  )

})

const PostCardInteractionButton = forwardRef(function PostCardButton({
  count = 0,
  activeColor = "red",
  inactiveColor = "gray",
  color = "white",
  callBack = () => {},
  isActive = false,
  Icon
}, ref) {
  const [updatedLikeCount, setupdatedLikeCount] = useState(count);

  useEffect(() => {
    setupdatedLikeCount(count);
  }, [count]);

  // Set the active state and count
  const handleClick = (e) => {
    e.stopPropagation();
    setupdatedLikeCount(isActive ? updatedLikeCount - 1 : updatedLikeCount + 1);
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
        {abbreviateNumber(updatedLikeCount)}
      </span>
    </Button>
  )
})

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

export { PostCardActionButton, PostCardInteractionButton }