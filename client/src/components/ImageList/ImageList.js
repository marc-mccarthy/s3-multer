// Fetches images and displays them

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ImageList = () => {

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get('/api/images');
        setImages(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchImages();
  }, []);

  return (
    <div>
      {images.map(image => (
        <img src={image.url} alt={image.name} />
      ))}
    </div>
  )

}

export default ImageList;
