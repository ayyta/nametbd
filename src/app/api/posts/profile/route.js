import supabaseService from "@/lib/supabaseServiceClient";
import { NextResponse } from "next/server";
import { formatCreatedAt, fetchMediaForPosts } from "@/lib/parsePost";

export async function GET(req, res) {
  const token = req.headers.get('authorization').split(' ')[1]; // Get token from Authorization header
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }
  try {
    const { data: { user } } = await supabaseService.auth.getUser(token); // Get user by token
    const currentUserId = user.id;

    // Fetch the user's posts
    const { data: posts, error } = await supabaseService
      .from("post")
      .select("*")
      .eq("user_id", currentUserId)
      //.not("post_id", "in", supabaseService.from("replies").select("reply_id"))
      .order("created_at", { ascending: false })
      .limit(10);

    let postsList = posts
    // Given post, format created_at field
    postsList = formatCreatedAt(posts);   

    // Fetch the media for each post
    postsList = await fetchMediaForPosts(postsList);
    //console.log(posts);
    // get the user's profile
    // 
    return NextResponse.json({ data: posts }, { status: 200 });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

}

