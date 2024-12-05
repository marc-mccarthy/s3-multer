import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageListStyles,
  ImageWrapper,
  Title
} from './ImageList.styles';

const ImageList = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        const response = await axios.get('/api/images/getAllImages');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchAllImages();
  }, []);

  return (
    <ImageListStyles>
      <Title>My Image Gallery</Title>
      {images.map((image) => (
        <ImageWrapper key={image.name}>
          <Image src={image.url} alt={image.name} />
          <p>{image.name}</p>
        </ImageWrapper>
      ))}
    </ImageListStyles>
  );
};

export default ImageList;
