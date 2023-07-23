 // Handles image upload form

import axios from 'axios';
import React, { useState } from 'react';

// Import styling

const ImageUpload = () => {

  const [image, setImage] = useState(null);

  const handleUpload = async e => {
    const file = e.target.files[0];

    // Client-side validation

    const formData = new FormData();
    formData.append('image', file);

    try {
      await axios.post('/api/images', formData);
    } catch (err) {
      console.error(err);
      alert('Error uploading image'); 
    }
  }

  return (
    <div>
      <input 
        type="file"
        onChange={handleUpload}
      />
      <button>Upload</button> 
    </div>
  )

}

export default ImageUpload;
