import axios from 'axios';
import React, { useState } from 'react';
import { Button, Container, Form, Input } from './ImageUpload.styles';

const ImageUpload = () => {
	const [image, setImage] = useState(null);

	const handleUpload = async e => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('image', image);

		try {
			const res = await axios.post('/api/images', formData);
			console.log(res.data);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Container>
			<h1>Upload an Image</h1>

			<Form onSubmit={handleUpload}>
				<Input type='file' onChange={e => setImage(e.target.files[0])} />
				<Button type='submit'>Upload</Button>
			</Form>
		</Container>
	);
};

export default ImageUpload;
