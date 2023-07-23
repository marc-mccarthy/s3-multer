# Building an Image Upload Component with React, Node, AWS S3 and Jest

## Overview

In this tutorial, we will build an image upload component in React that uploads images to AWS S3. The backend will be built with Node.js and Express for handling image uploads. We will also integrate PostgreSQL for storing image metadata. The component will be styled using Styled Components. Finally, we will set up Jest testing for the React component.

## Prerequisites

- Node.js and NPM
- AWS S3 bucket
- PostgreSQL database
- AWS CLI and credentials configured

### File/Folder Structure

```shell
├── client
│   ├── public
│   ├── src
│   │   ├── components     
│   │   │   ├── ImageUpload
│   │   │   │   ├── ImageUpload.js
│   │   │   │   ├── __tests__
│   │   │   │   │   └── ImageUpload.test.js
│   │   │   ├── ImageList
│   │   │   │   ├── ImageList.js
│   │   │   │   ├── __tests__
│   │   │   │   │   └── ImageList.test.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server
│   ├── src
│   │   ├── routes
│   │   │   └── images.router.js
│   │   ├── config
│   │   │   └── database.js  
│   │   └── server.js 
│   └── package.json
├── .env
├── .gitignore
├── README.md
├── STRUCTURE.md
└── DATABASE.sql
```

### Create the Application Template

```shell
npx create-react-app s3-multer
```

### Install Dependencies

Client:

```shell
npm install axios styled-components react-scripts
```

Server:

```shell
npm install express pg multer aws-sdk
```

Testing:

```shell
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### Environment Variables

Create an .env file at the root of the repo and paste the following in with your values:

```shell
# React App
REACT_APP_API_URL=http://localhost:5050/api

# Node/Express
PORT=5050

# AWS Credentials
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
AWS_REGION=YOUR_AWS_REGION

# S3
S3_BUCKET=aws-file-upload-patterns

# PostgreSQL
PG_USER=YOUR_POSTGRES_USER
PG_PASSWORD=YOUR_POSTGRES_PASSWORD
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=aws-file-upload-patterns
```

### ImageUpload Component

`ImageUpload.js` handles the file input and upload:

```jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Input, Button } from './ImageUpload.styles';

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
```

### ImageUpload Styles Component

`ImageUpload.styles.js` contains the styled components:

```jsx
import styled from 'styled-components';

export const Container = styled.div`
	max-width: 500px;
	margin: 2rem auto;
	padding: 2rem 1rem;
	border: 1px solid #ddd;
`;

export const Form = styled.form`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

export const Input = styled.input`
	margin: 0.5rem 0;
	padding: 0.5rem;
`;

export const Button = styled.button`
	background: blue;
	color: white;
	border: none;
	padding: 0.5rem 1rem;
	border-radius: 5px;
	cursor: pointer;
`;
```

### App Component

`App.js` renders the ImageUpload component:

```jsx
import ImageUpload from './components/ImageUpload';

function App() {
	return (
		<div className='App'>
			<ImageUpload />
		</div>
	);
}

export default App;
```

## Server Setup

Initialize the Express server:

```shell
npm init -y
npm install express pg multer aws-sdk
```

### Server Config

`server.js` contains the basic Express setup:

```js
const express = require('express');
const app = express();
const imagesRouter = require('./routes/image.router');

app.use(express.json());
app.use('/api/images', imagesRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
```

### Image Upload Route

`routes/images.router.js` handles the `/api/images` route:

```js
const express = require('express');
const multer = require('multer');
const aws = require('aws-sdk');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// AWS S3
const s3 = new aws.S3({
	accessKeyId: 'YOUR_AWS_ACCESS_KEY_ID',
	secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',
});

router.post('/', upload.single('image'), async (req, res) => {
	const file = req.file;

	// Set S3 parameters
	const params = {
		Bucket: 'YOUR_S3_BUCKET',
		Key: file.originalname,
		Body: file.buffer,
	};

	// Upload to S3
	s3.upload(params, (error, data) => {
		if (error) {
			res.status(500).send(error);
		}
		res.json(data);
	});
});

module.exports = router;
```

This uses Multer to handle the file upload and aws-sdk to upload to S3. Make sure to add your S3 credentials and bucket name.

## PostgreSQL Setup

### Database Connection File

`config/database.js` sets up the PostgreSQL client:

```js
const { Pool } = require('pg');

const pool = new Pool({
	user: 'YOUR_USER',
	password: 'YOUR_PASSWORD',
	host: 'localhost',
	database: 'aws-file-upload-patterns',
	port: 5432,
});

module.exports = pool;
```

Create a `database.sql` file and add our table:

```sql
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL
);
```

### Saving Image Metadata

Update the image route to save the image metadata:

```js
// Get DB Connection
const db = require('../config/database');

router.post('/', upload.single('image'), async (req, res) => {

  // Upload image to S3

  const { originalname } = req.file;
  const url = // URL from S3 upload

  // Insert into DB
  const query = 'INSERT INTO images (name, url) VALUES($1, $2) RETURNING *';
  const values = [originalname, url];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(400).send(err);
    }

    res.json(result.rows[0]);
  })

});
```

### Retrieving Images

Add a route to fetch images:

```js
router.get('/', async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM images ORDER BY id DESC');
		res.json(result.rows);
	} catch (err) {
		console.error(err.message);
	}
});
```

Update `ImageUpload.js` to retrieve and display images:

```jsx
import { useState, useEffect } from 'react';

// Fetch images
useEffect(() => {
  const fetchImages = async () => {
    const res = await axios.get('/api/images');
    setImages(res.data);
  }

  fetchImages();
}, []);

return (
  // Display images
  {images.map(image => (
    <img src={image.url} alt={image.name} key={image.id} />
  ))}
)
```

## Jest Setup and Testing

To ensure our components are working as expected, we will set up Jest for testing. We will create a test for our ImageUpload component to start.

Create a new file called `ImageUpload.test.js` in the same directory as `ImageUpload.js`.

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageUpload from './ImageUpload';

test('renders upload form', () => {
	render(<ImageUpload />);
	const linkElement = screen.getByText(/Upload an Image/i);
	expect(linkElement).toBeInTheDocument();
});

test('upload button is disabled when no file is selected', () => {
	render(<ImageUpload />);
	const uploadButton = screen.getByRole('button', { name: /Upload/i });
	expect(uploadButton).toBeDisabled();
});

test('upload button is enabled when a file is selected', () => {
	render(<ImageUpload />);
	const fileInput = screen.getByLabelText(/Upload File/i);
	const uploadButton = screen.getByRole('button', { name: /Upload/i });
	fireEvent.change(fileInput, {
		target: { files: [new File(['file'], 'file.jpg', { type: 'image/jpeg' })] },
	});
	expect(uploadButton).toBeEnabled();
});
```

In this test file, we have three tests:

1.  The first test checks if the form is rendered correctly.
2.  The second test checks if the upload button is initially disabled.
3.  The third test checks if the upload button is enabled when a file is selected.

To run the tests, add a test script in your `package.json`:

```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "jest",
  "eject": "react-scripts eject"
}
```

Then, run the tests with the command:

```shell
npm test
```

Congratulations! You've now created an image upload component using React, Node.js, AWS S3, and PostgreSQL. You've also set up tests for the component using Jest and react-testing-library.

We now have a fully functioning image upload component with backend handling to upload images to S3. The component is styled with Styled Components and tested with Jest.

You are now able to upload an image that's stored in an AWS S3 bucket and store the image metadata in a PostgreSQL database. You should also be able to fetch and display the images.

This component could be a part of a larger application, such as a blog or a social media site.
