import supabaseService from "@/lib/supabaseServiceClient";
import { NextResponse } from "next/server";
export async function GET(req, res) {

  try {
    const { data: posts, error } = await supabaseService
      .from("post")
      .select("*")
      .eq("post_id", currentPostId)
      .limit(1);
    if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// Given post, format created_at field
function formatCreatedAt(posts) {
  posts.forEach(post => {
    const postDate = new Date(post.created_at);
    const now = new Date();
    
    const diffHours = (now - postDate) / (1000 * 60 * 60); // Difference in hours
  
    if (diffHours < 24) {
      // If it's less than 24 hours, display like "3 hrs ago"
      if (diffHours >= 1) {
        // If more than 1 hour, display in hours
        post.created_at = `${Math.round(diffHours)} hrs`;
      } else {
        // If less than 1 hour, display in minutes
        const diffMinutes = differenceInMinutes(now, postDate);
        post.created_at = `${Math.round(diffMinutes)} min${diffMinutes > 1 ? 's' : ''}`;
      }
    } else {
      // If it's more than 24 hours, display the formatted date like "Oct 16, 07:04 AM"
      post.created_at = format(postDate, 'MMM d'); // e.g., "Oct 16, 07:04 AM"
    }
  });
  return posts;
}

// when you reply
// create a new post row with reply content
// then go to reply table and fill relationships there