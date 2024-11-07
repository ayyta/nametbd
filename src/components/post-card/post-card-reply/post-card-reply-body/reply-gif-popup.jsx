import {
  useState,
  useEffect,
  useCallback,
} from "react";
import Image from "next/image";
import axios from "axios";

export default function ReplyGifPopup(
  {
    gifs,
    setGifs,
    displayGifs,
    setDisplayGifs,
    displayPopup,
    setDisplayPopup,
    setMedia,
  }
) 

{
  const [searchGif, setSearchGif] = useState(""); // State to hold the search term for GIFs
  const [isLoading, setIsLoading] = useState(false);  // State to manage loading state

  // Closes the Giphy popup
  const closeGifPopup = () => {
    setDisplayPopup(false);
    setDisplayGifs(false);
  };

  // Debounce function to limit the rate of API calls
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  // Fetches the gifs from the Giphy API
  const fetchData = async (searchVal = '') => {
    try {
      const endpoint = searchVal ? `https://api.giphy.com/v1/gifs/search` : 'https://api.giphy.com/v1/gifs/trending';

      const results = await axios(endpoint, {
        params: {
          api_key : `7VGHs9vybY2b6EcUZtVi3ay9pVVlFOxu`,
          limit : 30,
        }
      });
      setGifs(results.data.data);
    } catch (error) {
      console.error("Error fetching gifs", error);
    } 
  }

  // Debounced fetch function to search for GIFs
  const debounceFetch = useCallback(debounce(async (searchVal) => {
    setIsLoading(true);
    await fetchData(searchVal); // Fetch the GIFS

    if (searchVal.length === 0) {
      setIsLoading(false);
    }
  }, 100), []);

  // Handles the user searches for GIFs
  const handleSearchChange = async (e) => {
    const searchVal = e.target.value;
    setSearchGif(searchVal);

    debounceFetch(searchVal);
  };

  // Fetch trending GIFs on initial load
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchData(); // Fetch trending GIFs on initial load
      setIsLoading(false);
    })();
  }, []);

  // Whenever the user searches for a gif, it will fetch the data
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const results = await axios(`https://api.giphy.com/v1/gifs/search`, {
        params: {
          api_key: `7VGHs9vybY2b6EcUZtVi3ay9pVVlFOxu`,
          q: searchGif,
        }
      });
      setGifs(results.data.data);
    } catch (error) {
      console.error("Error fetching gifs", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handles the selection of a GIF
  const selectedGif = (gifURL) => {
    const newMedia = [{
      url : gifURL,
      type : "image/gif",
    }];

    setMedia(newMedia);
    closeGifPopup();
  };

  // Renders the GIFs
  const renderGifs = () => {
    return gifs.map((giphy) => {
      return (
        <div 
        className="flex cursor-pointer hover:opacity-50 active:opacity-25" 
        key={giphy.id}
        onClick={() => selectedGif(giphy.images.fixed_height.url)}
        >
          <Image 
            src={giphy.images.fixed_height.url}
            width={0}
            height={0}
            sizes='100vw'
            style={{
              "width" : "100%",
              "object-fit" : "cover",
            }}
            alt='Gif'
            className='rounded-lg'
          />
        </div>
      );
    })
  };

  if (!displayPopup) return null; // If the popup is not displayed, return null

  return (
    <div className="flex fixed top-1/2 left-1/2 -translate-y-2/4 -translate-x-2/4 border-4 border-solid border-primary/50 rounded-2xl bg-third max-h-161 z-20">
      <div className="absolute -top-12 left-1/2 -translate-y-2/4 -translate-x-2/4">
        <form 
          className="flex items-center justify-center w-max rounded-full bg-slate-200"
        >
          <div alt="Search Bar">
            <input 
              value={searchGif}
              onChange={handleSearchChange}
              type="search" 
              placeholder="Search Gifs..." 
              className="flex bg-transparent text-lg text-primary p-3.5 focus:bg-slate-300 focus:rounded-full" 
            />
          </div>
          <div className="float-right ml-2 mr-2">
            <button 
              type="submit"
              className="flex p-2 hover:rounded-full hover:bg-slate-300 active:opacity-50 active:bg-slate-400 cursor-pointer"
              onClick={handleSearchSubmit}
            >
              <Image
                src="/Search Icon.svg"
                width={28}
                height={0}
                alt='Search logo'
              />
            </button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div alt="Loading Container">
          <button type="button" className="bg-primary text-white font-bold py-2 px-4 rounded border-4 border-slate-200 inline-flex items-center" disabled>
            <svg className="animate-spin h-8 w-8 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Loading GIF...
          </button>
        </div>
      )}
      {(displayGifs && !isLoading) && (
        <div className="gif-scrollbar grid grid-cols-3 relative overflow-y-hidden overflow-y-scroll scroll-smooth">
          {renderGifs()}
          <div alt="Gif Close Button">
            <button
              className='fixed -top-16 right-3.5 z-50 bg-slate-200 rounded-full hover:bg-slate-300 active:opacity-50 cursor-pointer'
              onClick={closeGifPopup}
            >
              <Image
                src="/Close Small Icon.svg"
                width={38}
                height={0}
                alt='Close logo'
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}