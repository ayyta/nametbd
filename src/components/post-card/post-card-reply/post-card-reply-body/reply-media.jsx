"use client";

import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import Image from 'next/image';

export default function ReplyMedia(
  {
    media,
    setMedia,
    gifs,
    setGifs,
  }
) 

{

  // Function to display media
  const displayMedia = () => {
    // To display a single media file, I do this check, because I don't want the Carousel to show if there is only one media file.
    if (media.length === 1 ) {
      return media.map((mediaFile) => {
        const url = mediaFile.url;  // Get the URL of the media file

        // Check the type of media file
        const isImage = mediaFile.type.startsWith("image/");
        const isVideo = mediaFile.type.startsWith("video/");
        const isGif = mediaFile.type === "image/gif";

        return (
          <div className='relative m-2 w-full'>
            {(isImage || isGif) && (
              <>
                <Image 
                  src={url}
                  width={0}
                  height={0}
                  sizes='100vw'
                  alt='Media'
                  className='rounded-lg max-h-161 h-auto w-full'
                />
                <button 
                  className='absolute top-1.5 right-1.5 z-50 bg-slate-200 rounded-full hover:opacity-80 hover:bg-secondary active:opacity-50 cursor-pointer'
                  onClick={() => 
                    setMedia(media.filter((e) => e!== mediaFile))
                  }
                >
                  <Image
                    src="/Close Small Icon.svg"
                    width={32}
                    height={0}
                    alt='Close logo'
                  />
                </button>
              </>
            )}

            {isVideo && (
              <>
                <video width="100%" className='rounded-lg' controls muted>
                  <source src={url} type={url.type} />
                  Your browser does not support the video tag.
                </video>
                <button 
                  className='absolute top-1.5 right-1.5 z-50 bg-slate-200 rounded-full hover:opacity-80 hover:bg-secondary active:opacity-50 cursor-pointer'
                  onClick={() => 
                    setMedia(media.filter((e) => e!== mediaFile))
                  }
                >
                  <Image
                    src="/Close Small Icon.svg"
                    width={32}
                    height={0}
                    alt='Close logo'
                  />
                </button>
              </>
            )}
          </div>
        );
      })
    } else if (media.length > 1) {
      return (
        <Carousel className="relative w-full m-2">
          <CarouselContent className="m-0">
            {media.map((mediaFile, index) => {
              const url = mediaFile.url; // Get the URL of the media file
  
              // Check the type of media file
              const isImage = mediaFile.type.startsWith("image/");
              const isVideo = mediaFile.type.startsWith("video/");
              const isGif = mediaFile.type === "image/gif";
  
              return (
                <CarouselItem
                  key={index}
                  className="relative pl-0"
                  style={{
                    "aspect-ratio" : `${isImage ? "1/1" : "16/9"}`,
                    "flex-basis" : `${isImage ? "50%" : "100%"}`
                  }}
                >
  
                  {(isImage || isGif) && (
                    <>
                      <Image
                        src={url}
                        alt='Media'
                        fill
                        className='rounded-lg object-cover' 
                      />
                      <button 
                        className="absolute top-1.5 right-1.5 z-50 bg-slate-200 rounded-full hover:opacity-80 hover:bg-secondary active:opacity-50 cursor-pointer"
                        onClick={() => setMedia(media.filter((e) => e !== mediaFile))}
                      >
                        <Image 
                          src="/Close Small Icon.svg"
                          width={32}
                          height={0}
                          alt="Close logo"
                        />
                      </button>
                    </>
                  )}
  
                  {isVideo && (
                    <>
                      <video width="100%" className="rounded-lg object-cover" controls muted>
                        <source src={url} type={url.type} />
                        Your browser does not support the video tag.
                      </video>
                      <button 
                        className='absolute top-1.5 right-1.5 z-50 bg-slate-200 rounded-full hover:opacity-80 hover:bg-secondary active:opacity-50 cursor-pointer'
                        onClick={() => 
                          setMedia(media.filter((e) => e!== mediaFile))
                        }
                      >
                        <Image
                          src="/Close Small Icon.svg"
                          width={32}
                          height={0}
                          alt='Close logo'
                        />
                      </button>
                    </>
                  )}
  
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-black/50 hover:opactiy-80 hover:bg-primary active:opacity-50 cursor-pointer" />
          <CarouselNext className="right-2 bg-black/50 hover:opactiy-80 hover:bg-primary active:opacity-50 cursor-pointer" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
            {media.length} / {4}
         </div>
        </Carousel>
      );
    }
  }

  
  return (
    <>
      <div className='flex relative'>
        {displayMedia()}
      </div>
    </>
  );
}