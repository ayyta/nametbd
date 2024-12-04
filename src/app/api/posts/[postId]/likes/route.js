import { NextResponse } from "next/server";
import supabaseService from "@/lib/supabaseServiceClient";

export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const userId = searchParams.get("userId");

    if (!postId || !userId) {
      throw new Error("postId or userId is null or undefined");
    }

    // Fetch like status
    const { data: likeData, error: likeError } = await supabaseService
      .from("likes")
      .select("post_id, user_id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single(); // Ensures only one result is returned

    const isLiked = likeData ? true : false;

    const { data: postLikeCount, error: fetchError } = await supabaseService
      .from("post")
      .select("like_count")
      .eq("post_id", postId)
      .single(); // Ensures only one result is returned

    if (fetchError) {
      console.error("Error fetching like count:", fetchError, postLikeCount);
      throw new Error("Failed to fetch like count");
    }
    const likeCount = postLikeCount?.like_count || 0;
    return NextResponse.json({ isLiked, likeCount }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch like status in api", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req, res) {
  console.log("POST request to /api/posts/[postId]/likes");
  try {
    const {searchParams} = new URL(req.url);
    const postId = searchParams.get("postId");
    const userId = searchParams.get("userId");
    const isLiked = searchParams.get("isActive");

    if (!postId || !userId) {
      throw new Error("postId or isLiked is null or undefined");
    }
    console.log("isLiked: ", isLiked);
    console.log("postId: ", postId);
    console.log("searchParams: ", searchParams);

    // Create or remove like from like table
    if (isLiked === "true") {
      console.log("Adding like");
      // Add like
      const { data, error } = await supabaseService
        .from("likes")
        .insert([
          { post_id: postId, user_id: userId },
        ]);
      if (error) {
        throw new Error(error.message);
      }
    } else {
      console.log("Removing like");

      // Remove like
      const { data, error } = await supabaseService
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);
      if (error) {
        throw new Error(error.message);
      }
    }

    // Update like count on database
    handleLikeUpdate(postId, isLiked);


    return NextResponse.json({ message: "Successfully updated like count" }, { status: 200 });
  } catch (error) {
    console.error("Failed to update like status in api", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

const handleLikeUpdate = async (postId, isLiked) => {
  // Step 1: Fetch the current like count
  const { data: postData, error: fetchError } = await supabaseService
    .from("post")
    .select("like_count")
    .eq("post_id", postId)
    .single(); // Ensures only one result is returned

  if (fetchError) {
    console.error("Error fetching like count:", fetchError);
    return;
  }

  const currentLikeCount = postData?.like_count || 0;
  
  // Step 2: Calculate the new like count
  const updatedLikeCount =
    isLiked === "true" ? currentLikeCount + 1 : currentLikeCount - 1;

  // Step 3: Update the like count in the database
  const { data, error } = await supabaseService
    .from("post")
    .update({ like_count: updatedLikeCount })
    .eq("post_id", postId);

  if (error) {
    throw new Error("Failed to update like count");
  }
};


