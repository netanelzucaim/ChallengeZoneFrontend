import React, { useEffect, useState } from 'react';
import userService from '../services/user_service';

const ImgComponent: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = await userService.getImage('pic.jpg');
        setImageUrl(url);
      } catch (error: any) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, []);

  return (
    <div>
      {imageUrl ? (
        <img src={imageUrl} alt="User" />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default ImgComponent;