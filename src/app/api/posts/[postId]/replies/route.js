import { NextResponse } from "next/server";
import supabaseService from "@/lib/supabaseServiceClient";
import { fetchUserProfile } from "@/components/FetchUserProfile";

export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const selectionSort = searchParams.get("selectedSort"); // implement this later

    const { data, error } = await supabaseService
      .from("replies")
      .select("*")
      .eq("post_id", postId)


    if (error) {
      console.error("Error fetching comments:", error, data);
      throw new Error("Failed to fetch comments");
    }

    const replyIDs = data.map((reply) => reply.reply_id);

    let repliesData = []
    // Fetch the media for each reply
    for (let i=0; i < replyIDs.length; i++) {
      repliesData.push(await loadReplyData(replyIDs[i]));
    }

    return NextResponse.json(repliesData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function loadReplyData(postId) {
  let postData = {
    postId: postId,
    userId: "122",
    pfp: "/placeholder-avatar.jpg",
    name: "1",
    username: "1",
    creationDate : "2h ago",
    content : "This is a sample post content. It can be much longer and will wrap to multiple lines if needed. ",
    imagesProp : [],
    likeCount: 1700,
    commentCount: 2500,
    shareCount: 1000000,
    replies: [], // implement this later
  }
  // Find user id, and post content from post table using reply id
  const postTableParams = new URLSearchParams({
    postId: postId,
  })
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/post?${postTableParams.toString()}`, {
    method: "GET", 
  });

  if (!response.ok) {
    throw new Error("Failed to fetch replies");
  }
  const { posts } = await response.json();
  // Set post data from response from post table
  postData.creationDate = posts.created_at;
  postData.userId = posts.user_id;
  postData.textContent = posts.text_content;
  postData.likeCount = posts.like_count;
  postData.commentCount = posts.comment_count;
  postData.shareCount = posts.share_count;
  postData.imagesProp = posts.mediaList;
  // console.log("posts: ", posts);  
  // Find user data using user id on user table
  const userData = await fetchUserProfile(posts.user_id);
  postData.pfp = userData.pfpLink;
  postData.name = userData.userProfile.name;
  postData.username = userData.userProfile.username;

  return postData;
  
}

