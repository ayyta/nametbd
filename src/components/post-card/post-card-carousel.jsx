import { forwardRef } from "react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const Component = forwardRef(function PostCardCarousel({
  images = [],
  isCarouselOpen = false,
  closeCarousel = () => {},
}, ref) {

  return (
    <>
      {isCarouselOpen &&  (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 hover:text-white rounded-full"
            onClick={closeCarousel}
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
          <Carousel 
            className="w-screen h-screen"  
          >

            <CarouselContent className="" onClick={closeCarousel}>
              {images.map((src, index) => {
                const isVideo = src.includes(".mp4") || src.includes(".mov");
                
                return (
                  <CarouselItem key={index} className="w-fit h-screen flex justify-center items-center relative">
                    {isVideo ? (
                      <video 
                        alt={`Video ${index + 1}`}
                        width={900} 
                        height={549} 
                        controls 
                        onClick={(e) => {e.stopPropagation()}}
                      >
                        <source src={src} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Image
                        src={src}
                        alt={`Image ${index + 1}`}
                        width={900}
                        height={540}
                        quality={100}
                        onClick={(e) => {e.stopPropagation()}}
                      />
                    )}
                  </CarouselItem>
                )                
               }
              )}
            </CarouselContent>
            {images.length > 1 ? <CarouselPrevious className="absolute top-1/2 left-8 transform -translate-y-1/2 -translate-x-1/2 z-10"/> : null}
            {images.length > 1 ? <CarouselNext className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1/2 z-10"/> : null}
          </Carousel>
        </div>
      )}

    </>

  )
  
})

export default Component;