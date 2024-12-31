"use client";
import "../../styles/uploadpage.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import Header from "./header";
import MediaButton from "./mediabutton";
import Media from "./media";
import GiphyButton from "./giphybutton";
import GiphySelector from "./giphyselector";
import supabaseAnon from "@/lib/supabaseAnonClient";
import { handlePost } from "@/lib/post";
import { useRouter } from "next/navigation";

export default function Upload({ open, onClose }) {
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);
  const [gifs, setGifs] = useState([]);
  const [showGifs, setShowGifs] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const Router = useRouter();

  if (!open) return null

  const handler = () => {
    if (open) {
      // Redirect to the home page and close the popup
      Router.push('/home');
      onClose();

      // Reset the text and media state
      setText("");
      setMedia([]);
    }
  }

  /**
   * useEffect hook to log the current media state, it only triggers whenever the media state changes
   */
  // useEffect(() => {
  //   console.log("media", media);
  // }, [media]);

  
  // Sends a POST request to the server
  const handleUploadPost = async (uploadText, mediaList, userId) => {
    const { data: { session } } = await supabaseAnon.auth.getSession();
    handlePost(text, media, session.user.id);
  
    // Redirect to the home page and close the popup
    Router.push('/home');
    onClose();

    // Reset the text and media state
    setText("");
    setMedia([]);
    
  };

  // Create a function to handle the addition of media due to the issue of having multiple alerts when the media limit is reached in the image/video vs gif upload
  const handleAddMedia = (newMediaArray) => {
    // Check the media limit which is 4
    if (media.length + newMediaArray.length > 4) {
      alert("You can only upload a maximum of 4 media files");
      return;
    }

    // Upload the media state
    setMedia((prevMedia) => [...prevMedia, ...newMediaArray]);
  }

  return (
    <>
      <div className="upload-popup-container">
        <div className="upload-overlay" onClick={handler}></div>
        <GiphySelector 
          gifs={gifs}
          setGifs={setGifs}
          showGifs={showGifs}
          setShowGifs={setShowGifs}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          images={media}
          setMedia={handleAddMedia}
        />
        <form 
          className={`upload-container ${media.length > 0 ? 'media-present' : 'media-absent'}`} 
          onSubmit={(e) => e.preventDefault()}
          // The height of the form is set to min-content if there is media else it is set to 288px
          style={{
            // "height" : `${media.length > 0 ? "min-content" : "288px"}`,
            // "width" : `${media.length > 0 ? "644px" : "552px"}`,
            "z-index" : `${showGifs ? "10" : "20"}`,
          }}
        >
          <div className="upload">
            <Header 
              close={onClose} 
              router={Router}
              setMedia={setMedia}
              setText={setText} 
            />
            <div className={`upload-body-container ${media.length > 0 ? 'upload-body-container-present' : 'upload-body-container-absent'}`}>
              <TextareaAutosize
                className="upload-body"
                minRows={1}
                maxRows={5}
                placeholder="Enter Text..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="upload-image-container">
              <Media 
                images={media} 
                setMedia={setMedia}
                gifs={gifs}
                setGifs={setGifs} 
              />
            </div>
            <div className="upload-utilities-left-section">
              <MediaButton
                media={media} 
                setMedia={handleAddMedia} 
              />
              <button className="upload-utilities">
                <Image
                  src="/Mic Icon.svg"
                  width={28}
                  height={0}
                  alt="Mic logo"
                />
              </button>
              <GiphyButton 
                showGifs={showGifs}
                setShowGifs={setShowGifs}
                showPopup={showPopup}
                setShowPopup={setShowPopup}
              />
            </div>
            <div className="upload-utilities-right-section">
              <button 
                className="upload-button"
                onClick={handleUploadPost}
              >
                Post
              </button>
            </div>
          </div>
        </form>      
      </div>
    </>
  );
}
