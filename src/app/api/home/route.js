import supabaseService from "@/lib/supabaseServiceClient"
import { NextResponse } from "next/server"
import { fetchUserProfile } from "@/components/FetchUserProfile"

// 1. Your existing fetchPostData snippet (slightly adjusted for clarity)
async function fetchPostData(postId, searchParams) {
  let postData

  // If userId is NOT provided, we fetch post data from /api/posts/post?postId=...
  if (searchParams.get("userId") === null) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/post?postId=${postId}`,
      {
        method: "GET",
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch posts")
    }

    // Grab the post object from the response
    const { posts } = await response.json()

    // Fetch user profile for the post’s author
    const fetchedUserProfile = await fetchUserProfile(posts.user_id)

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
    // If you have other logic when `userId` exists, put it here
    postData = {}
  }

  return postData
}

// 2. The GET method: fetch 30 newest posts, parse each with fetchPostData
export async function GET() {
  try {
    // Fetch 30 newest posts from Supabase (just need their post_id)
    const { data: posts, error } = await supabaseService
      .from("post")
      .select("post_id")
      .order("created_at", { ascending: false })
      .limit(30)

    if (error) {
      throw new Error(error.message)
    }

    // Parse each post using your fetchPostData function
    // We pass an empty URLSearchParams so that `searchParams.get("userId") === null`
    const parsedPosts = await Promise.all(
      posts.map(async (p) => {
        const sp = new URLSearchParams() // No userId => triggers your "no userId" fetch path
        return await fetchPostData(p.post_id, sp)
      })
    )

    // Return the array of fully parsed posts
    return NextResponse.json({ data: parsedPosts }, { status: 200 })
  } catch (error) {
    console.error("Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}