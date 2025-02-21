import supabaseService from "@/lib/supabaseServiceClient";
import { formatCreatedAt, fetchMediaForPosts } from "@/lib/parsePost";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const currentPostId = searchParams.get("postId");

    const { data: posts, error } = await supabaseService
      .from("post")
      .select("*")
      .eq("post_id", currentPostId)
      .limit(1);
    if (error) {
      throw new Error(error.message);
    }

    let postsList = posts

    // Given post, format created_at field
    postsList = formatCreatedAt(posts);

    // Fetch the media for each post
    postsList = await fetchMediaForPosts(postsList);

    // Find comment count
    const { data: commentCount, error: commentError } = await supabaseService
      .from("replies")
      .select("reply_id")
      .eq("post_id", currentPostId);
    
    if (commentError) {
      throw new Error(commentError.message);
    }
    postsList[0].comment_count = commentCount.length;

    return NextResponse.json({ posts: postsList[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




// when you reply
// create a new post row with reply content
// then go to reply table and fill relationships there