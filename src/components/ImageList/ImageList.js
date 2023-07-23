import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageListStyles,
  Title
} from './ImageList.styles';

const ImageList = () => {

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await axios.get('/api/images');
      setImages(res.data);
    };

    fetchImages();
  }, []);

  return (
    <ImageListStyles>
      <Title>My Image Gallery</Title>
      {images.map(image => (
        <Image 
          key={image.id}
          src={image.url} 
          alt={image.name} 
        />
      ))}
    </ImageListStyles>
  );
}

export default ImageList;
