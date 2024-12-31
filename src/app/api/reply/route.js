import supabaseService from "@/lib/supabaseServiceClient";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");
  const replyPostId = url.searchParams.get("replyPostId");

  try {
    console.log("postId:", postId);
    console.log("replyPostId:", replyPostId);
    const { data, error } = await supabaseService
    .from("replies")
    .insert([
      {
        post_id: postId,
        reply_id: replyPostId,
      }
    ]);
  
    if (error) {
      throw new Error("Error inserting reply into Supabase", error.message);
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}
