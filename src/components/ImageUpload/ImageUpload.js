import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Form, Input } from './ImageUpload.styles';

const ImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  const uploadImages = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      await axios.post('/api/images/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images.');
    }
  };

  return (
    <Container>
      <Form>
        <Input type="file" onChange={handleFileChange} multiple />
        <Button type="button" onClick={uploadImages}>Upload Images</Button>
      </Form>
    </Container>
  );
};

export default ImageUpload;
