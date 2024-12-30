import { NextResponse } from "next/server";
import supabaseService from '../../../lib/supabaseServiceClient';

export async function POST(request, response) {
  // UNPACKAGE THE DATA
  const data = await request.formData();
  const media = JSON.parse(data.getAll("media_path")); // [media/"ddfa31"] 
  const gif = data.getAll("url");
  const text = data.get("text");  // "sometext"
  const user_id = data.get("user_id");

  // console.log("Received media: ", media);
  // console.log("Received gif: ", gif);
  // console.log("Received text: ", text);

  try {
    // Insert text content into the post table
    const { data: postData, error: postError } = await supabaseService
      .from("post")
      .insert([
        {
          text_content: text,
          user_id: user_id,
          created_at: new Date(),
        },
      ])
      .select("post_id");

    if (postError) {
      console.error("Error inserting post into Supabase", postError.message);
    }

    const post_id = postData[0]?.post_id;
    if (!post_id) {
      console.error("Error inserting post into Supabase");
    }

    // Insert the media objects(images) into the media table
    for (const mediaFile of media) {
      const { data: mediaData, error: mediaError} = await supabaseService
        .from("media")
        .insert([
          {
            media_path: mediaFile,
            media_type: "s3",
            post_id: post_id,
          }
        ])

      if (mediaError) {
        console.error("Error inserting media into Supabase", mediaError.message);
      }
    }

    // Insert the Gif into the media table
    gif.forEach(async (gifURL) => {
      const { data: gifData, error: gifError} = await supabaseService
        .from("media")
        .insert([
          {
            gif_url: gifURL,
            media_type: "gif",
            post_id: post_id,
          }
        ])

        if (gifError) {
          console.error("Error inserting gif into Supabase", gifError.message);
        }
    })

    return NextResponse.json({ message: 'Post Created', post_id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}