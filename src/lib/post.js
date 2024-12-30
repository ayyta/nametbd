import supabaseAnon from './supabaseAnonClient';

const handlePost = async (uploadText, mediaList, userId) => {
  // Upload media to S3
  const mediaPaths = await uploadToS3(mediaList);

  if (!mediaPaths) {
    console.error("Error uploading media to S3");
    return;
  }

  // Create the form data
  const formData = new FormData();
  formData.append("text", uploadText);
  formData.append("media_path", JSON.stringify(mediaPaths));
  formData.append("user_id", userId);
  // Access the url for the GIFS
  mediaList.forEach((mediaFile) => {
    if (mediaFile.type === "image/gif") {
      formData.append("url", mediaFile.url);
    }
  })

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Error posting");
    }

    const result = await response.json();
    console.log("result", result);
    // console.log("Post successful");
    return result.post_id;
  } catch (error) {
    console.error("Error posting", error);
    return null;
  }
}

// Handles the POST request to the server(S3 Bucket)
const uploadToS3 = async (mediaList) => {
  const formData = new FormData();
  const path = "media/";
  let mediaPaths = [];

  mediaList.map((mediaFile) => {
    if (mediaFile.file) {
      // Append file to form data object
      formData.append("files", mediaFile.file);
    } 
  });

  // Append path to form data only if there are files
  if (formData.has("files")) {
    // Append path to form data object
    formData.append("path", path);

    // Send POST request to S3 Bucket
    try {
      const response = await fetch("/api/s3", {
        method: "POST",
        body: formData,   // if were sending text it would be JSON.stringify()
      });

      if (response.error) {
        console.error("Error uploading file to S3");
      }
  
      const data = await response.json();
  
      // data.data is the array of image paths in s3
      // console.log(data.data);
      mediaPaths = [...data.data];
    } catch (error) {
      //indicated frontend error
      console.error(error);
      return null;
    }
  }

  return mediaPaths;
};

export { handlePost, uploadToS3 };