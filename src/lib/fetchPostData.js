'use client';

import { useSearchParams } from "next/navigation";

const fetchPostData = async (postId, searchParams) => {
  let postData;
  if (searchParams.get("userId") === null) {
    // fetch data
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

const fetchReplyData = async (postId) => {
  return {}
};

export { fetchPostData, fetchReplyData };