import Image from "next/image";
import { useRef } from "react";

export default function ReplyMediaButton(
  {
    setMedia,
  }
) 

{
  const mediaUploadRef = useRef();  // Create a reference for the file input

  // Function to handle the media button being clicked
  const handleMediaClick = () => {
    mediaUploadRef.current.click(); // Trigger the file input click
  }

  // Function to handle file upload
  const handleFileUpload = (e) => {
    const selectedFiles = e.target.files; // Get the selected files
    const selectedFilesArray = Array.from(selectedFiles); // Convert to array

    // File size limit is 200MB
    const maxFileSize = 200 * 1024 * 1024; // 200MB

    // Create an array to store media objects with URL and type(image/video)
    const mediaArray = selectedFilesArray
      .filter((file) => {
        if (file.size > maxFileSize) {
          alert("File size is too large. Max file size is 200MB");
          return false; // Exclude files larger than 200MB
        }
        return true; // Include files that are within the size limit
      })
      .map((file) => ({
        url : URL.createObjectURL(file), // Create a URL for the file
        type : file.type, // Get the file type
        file : file, // Store the file object
      }));

    
    // setMedia(mediaArray); // Update the media state with the new media array
    setMedia((prevMedia) => [...prevMedia, ...mediaArray]); // Have to move this to the main reply.jsx parent component to avoid multiple alerts

    mediaUploadRef.current.value = null; // Reset the input value

    selectedFilesArray.map((file) => {
      return URL.revokeObjectURL(file); // Clean up the object URLs
    });
  }

  return (
    <>
      <button 
        className="p-1.5 hover:opacity-80 hover:rounded-full hover:bg-third active:opacity-50 cursor-pointer"
        onClick={handleMediaClick}
      >
        <Image 
          src="/Video Icon.svg"
          width={28}
          height={0}
          alt="Media logo"
        />
      </button>
      <input
        type="file" 
        ref={mediaUploadRef}
        onChange={handleFileUpload}
        multiple accept="image/png, image/jpeg, video/mp4, video/x-m4v, video/*"
        hidden
      />
    </>
  );
}