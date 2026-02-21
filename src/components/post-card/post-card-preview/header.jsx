import { useState, useEffect } from 'react';
import { CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfilePopup from '../../profile-popup';

const PostCardPreviewHeader = ({
  pfp,
  name,
  username,
  creationDate,
  user,
  setUser,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  let hoverTimeout;

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      setIsHovered(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(hoverTimeout); // Clear timeout on component unmount
  }, []);

  return (
    <div className="relative">
      <CardHeader className="flex flex-row items-center gap-4 py-2">
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Avatar>
            <AvatarImage src={pfp} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          {isHovered && (
            <div
              className={`absolute top-12 left-0 z-20 w-[300px] transition-all duration-300 ease-in-out transform opacity-100 translate-y-0`}
              style={{ pointerEvents: 'auto' }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <ProfilePopup user={user} setUser={setUser} />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <p
            className="text-sm text-gray-500 hover:underline"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {name}
          </p>
          <p
            className="text-sm text-gray-500 hover:underline"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            @{username} • {creationDate}
          </p>
        </div>
      </CardHeader>
    </div>
  );
};

export default PostCardPreviewHeader;
