'use client';

import { useSearchParams } from "next/navigation";
import { fetchUserProfile } from "@/components/FetchUserProfile";

const fetchPostData = async (postId, searchParams) => {
  let postData;
  if (searchParams.get("userId") === null) {
    // fetch data
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/post?postId=${postId}`, {
     method: "GET", 
    });

    if (!response.ok) {
      // Handle error if the response is not okay (e.g., 404 or 500)
      throw new Error("Failed to fetch posts");
    }
    const { posts } = await response.json(); 
    const fetchedUserProfile = await fetchUserProfile(posts.user_id);

    postData = {
      postId: posts.post_id,
      userId: posts.user_id,
      pfp: fetchedUserProfile.pfpLink,
      name: fetchedUserProfile.userProfile.name,
      username: fetchedUserProfile.userProfile.username,
      creationDate: posts.created_at,
      textContent: posts.text_content,
      imagesProp: posts.mediaList,
      likeCount: posts.like_count,
      commentCount: posts.comment_count,
      shareCount: posts.share_count,
    }
  } else {
    postData = {
      postId: postId,
      userId: parseParam("userId", searchParams),
      pfp: parseParam("pfp", searchParams),
      name: parseParam("name", searchParams),
      username: parseParam("username", searchParams),
      creationDate: parseParam("creationDate", searchParams),
      textContent: parseParam("textContent", searchParams),
      imagesProp: parseListParam("imagesProp", searchParams),
      likeCount: parseParam("likeCount", searchParams),
      commentCount: parseParam("commentCount", searchParams),
      shareCount: parseParam("shareCount", searchParams),
    };
  }

  
  
  return postData;
};

function parseParam(prop, searchParams) {
  const param = searchParams.get(prop)
  if (param === null || param === undefined) {
    return ""
  }
  return param
}

function parseListParam(prop, searchParams) {
  const param = parseParam(prop, searchParams)
  if (param === "") {
    return []
  }
  return JSON.parse(param)
}

const fetchReplyData = async (postId, selectedSort) => {
  // fetch data
  const params = new URLSearchParams({
    postId: postId,
    selectedSort: selectedSort,
  })
  const response = await fetch(`/api/posts/${postId}/replies?${params.toString()}`, {
    method: "GET", 
  });

  // console.log("response: ", response);
  if (!response.ok) {
    // Handle error if the response is not okay (e.g., 404 or 500)
    throw new Error("Failed to fetch replies");
  }
  const data = await response.json();
  console.log("data in fetchpsot data", data)
  return data;
};

export { fetchPostData, fetchReplyData };
