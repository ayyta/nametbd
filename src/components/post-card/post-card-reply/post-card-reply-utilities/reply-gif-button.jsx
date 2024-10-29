import Image from "next/image";

export default function ReplyGifButton(
  { 
    displayGifs,
    setDisplayGifs,
    setDisplayPopup,
    // closeReply,
  }
) 

{
  const handleGifClick = () => {
    setDisplayGifs(!displayGifs);
    setDisplayPopup(true);
    // closeReply();
  }

  return (
    <>
      <button 
        className="p-1.5 hover:opacity-80 hover:rounded-full hover:bg-third active:opacity-50 cursor-pointer"
        onClick={handleGifClick}
      >
        <Image 
          src="/Gif Icon.svg"
          width={28}
          height={0}
          alt="Giphy logo"
        />
      </button>
    </>
  );
}