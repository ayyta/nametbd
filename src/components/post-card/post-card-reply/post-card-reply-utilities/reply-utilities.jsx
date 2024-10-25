import Image from "next/image";
import ReplyMediaButton from "./reply-media-button";
import ReplyGifButton from "./reply-gif-button";

export default function ReplyUtilities(
  {
    setMedia,
    setGifs,
    displayGifs,
    setDisplayGifs,
    setDisplayPopup,
  }
)

{

  return (
    <>
      <ReplyMediaButton 
        setMedia={setMedia}
      />
      <button className="p-1.5 hover:opacity-80 hover:rounded-full hover:bg-third active:opacity-50 cursor-pointer">
        <Image 
          src="/Mic Icon.svg"
          width={28}
          height={0}
          alt="Mic logo"
        />
      </button>
      <ReplyGifButton 
        setGifs={setGifs}
        displayGifs={displayGifs}
        setDisplayGifs={setDisplayGifs}
        setDisplayPopup={setDisplayPopup}
      />
    </>
  );
}