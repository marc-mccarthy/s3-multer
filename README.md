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
├── public
│   └── index.html
├── server
│   ├── config
│   │   └── database.js
│   ├── routes
│   │   └── images.router.js
│   └── server.js
├── src
│   ├── components
│   │   ├── App
│   │   │   ├── __tests__
│   │   │   │   └── App.test.js
│   │   │   ├── App.js
│   │   │   └── App.styles.js
│   │   ├── ImageList
│   │   │   ├── __tests__
│   │   │   │   └── ImageList.test.js
│   │   │   ├── ImageList.js
│   │   │   └── ImageList.styles.js
│   │   ├── ImageUpload
│   │   │   ├── __tests__
│   │   │   │   └── ImageUpload.test.js
│   │   │   ├── ImageUpload.js
│   │   │   └── ImageUpload.styles.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
├── README.md
├── STRUCTURE.md
└── DATABASE.sql
```

### Create the Application Template

```shell
npx create-react-app s3-multer
```

### Install Dependencies

Client & Server:

```shell
npm install react react-dom react-scripts styled-components axios express pg multer aws-sdk dotenv
```

Testing & Development:

```shell
npm install --save-dev jest @testing-library/react @testing-library/jest-dom nodemon
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

### ImageList Component

`ImageList.js` handles displaying the images on the DOM:

```jsx
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

```

### ImageList Styles Component

`ImageList.styles.js` contains the styled components:

```jsx
import styled from 'styled-components';

export const ImageListStyles = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px 10px;
  background: #6aa84f; 
`;

export const Title = styled.h2`
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  color: #333;
  letter-spacing: 2px;
  font-size: 1.2rem;
`; 

export const Image = styled.img`
  max-width: 200px;
  height: auto; 
  margin: 10px;
  border-radius: 4px;
  box-shadow: 0 0 6px #ccc;
`;

```

### App Component

`App.js` renders the ImageUpload component:

```jsx
import ImageList from './components/ImageList/ImageList';
import ImageUpload from './components/ImageUpload/ImageUpload';
import { AppStyles } from './ImageList.styles';

function App() {
  return (
    <AppStyles>
      <ImageUpload />
      <ImageList />
    </AppStyles>
  );
}

export default App;

```

### App Styles Component

`App.styles.js` contains the styled components:

```jsx
import styled from 'styled-components';

export const AppStyles = styled.div`
  display: flex;
  flex-wrap: wrap;l
  justify-content: center;
  padding: 10px 10px;
  background: #ffd966; 
`;

```

## Server Setup

### Server Config

`server/server.js` contains the basic Express setup:

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
require('dotenv').config()

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const awsS3Bucket = process.env.S3_BUCKET

const storage = multer.memoryStorage();
const upload = multer({ storage });

// AWS S3
const s3 = new aws.S3({
	accessKeyId: awsAccessKeyId,
	secretAccessKey: awsSecretAccessKey,
});

router.post('/', upload.single('image'), async (req, res) => {
  const file = req.file;

  // Set S3 parameters
  const params = {
    Bucket: awsS3Bucket,
    Key: file.originalname,
    Body: file.buffer,
  };

  try {
    // Upload to S3
    const s3Result = await s3.upload(params).promise();
    
    // Get URL
    const url = s3Result.Location;

    // Insert into DB
    const query = 'INSERT INTO images (name, url) VALUES($1, $2) RETURNING *';
    const values = [originalname, url];
    const dbResult = await db.query(query, values);
    // Send back
    res.json(dbResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.get('/', async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM images ORDER BY id DESC');
		res.json(result.rows);
	} catch (err) {
		console.error(err.message);
	}
});

module.exports = router;

```

This uses Multer to handle the file upload and aws-sdk to upload to S3. Make sure that you added your S3 credentials and bucket name to the `.env` file you created.

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
-- `images` table in `aws-file-upload-patterns` database

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL
);
```

## Jest Setup and Testing

To ensure our components are working as expected, we will set up Jest for testing. We will create a tests for our components within `__tests__` directories in the component.

### ImageUpload Unit Tests

Create a file named `ImageUpload.test.js` in the `src/ImageUpload/__tests__` directory. Add the following code:

```jsx
import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import ImageUpload from './ImageUpload';

jest.mock('axios');

describe('ImageUpload', () => {
  it('renders upload form', () => {
    render(<ImageUpload />);
    expect(screen.getByText('Upload an Image')).toBeInTheDocument();
    const fileInput = screen.getByLabelText('Choose file');
    expect(fileInput).toBeInTheDocument();
    const submitBtn = screen.getByRole('button', { name: 'Upload' }); 
    expect(submitBtn).toBeInTheDocument();
  });

  it('calls axios.post when form submitted', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    render(<ImageUpload />);
    const fileInput = screen.getByLabelText('Choose file');
    fireEvent.change(fileInput, { target: { files: [file] } });
    const submitBtn = screen.getByRole('button', { name: 'Upload' });
    fireEvent.click(submitBtn);
    await expect(axios.post).toHaveBeenCalledWith('/api/images', expect.any(FormData));
  });

  it('displays alert on error', async () => {
    axios.post.mockRejectedValueOnce('Error uploading image');
    render(<ImageUpload />);
    const fileInput = screen.getByLabelText('Choose file');
    fireEvent.change(fileInput, { target: { files: [] } });
    const submitBtn = screen.getByRole('button', { name: 'Upload' });
    fireEvent.click(submitBtn);
    await expect(screen.getByText('Error uploading image')).toBeInTheDocument();
  });
});

```

### ImageList Unit Tests

`ImageList.test.js` in the `src/ImageList/__tests__` folder contains the unit tests:
Create a file named `ImageList.test.js` in the `src/ImageList/__tests__` directory. Add the following code:

```jsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import ImageList from '../ImageList';

jest.mock('axios');

describe('ImageList', () => {
  it('renders title', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{
        id: 1,
        url: 'image1.jpg',
        name: 'Image 1'  
      }]
    });

    render(<ImageList />);
    const title = await screen.findByText(/my image gallery/i);
    expect(title).toBeInTheDocument();
  });

  it('renders images from API response', async () => {
    const images = [{
      id: 1,
      url: 'image1.jpg',
      name: 'Image 1'
    }, {
      id: 2,
      url: 'image2.jpg', 
      name: 'Image 2'
    }];
  
    axios.get.mockResolvedValueOnce({data: images});
    render(<ImageList />);
    const imageElements = await screen.findAllByRole('img');
    expect(imageElements).toHaveLength(2);
    const firstImageSrc = imageElements[0].getAttribute('src');
    expect(firstImageSrc).toBe(images[0].url);
  });

  it('calls axios get on mount', () => {
    render(<ImageList />);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/images');
  });
});

```

### App Unit Tests

`App.test.js` in the `src/App/__tests__` folder contains the unit tests:

```jsx
import { render } from '@testing-library/react';
import React from 'react';
import App from '../App';
import ImageList from '../../ImageList/ImageList';
import ImageUpload from '../../ImageUpload/ImageUpload';

jest.mock('./components/ImageList/ImageList'); 
jest.mock('./components/ImageUpload/ImageUpload');

describe('App', () => {
  it('renders ImageUpload', () => {
    render(<App />);
    expect(ImageUpload).toHaveBeenCalled();
  });

  it('renders ImageList', () => {
    render(<App />);
    expect(ImageList).toHaveBeenCalled(); 
  });

  it('renders ImageUpload before ImageList', () => {
    const { mock } = ImageUpload;
    render(<App />);
    expect(mock.calls[0]).toBeGreaterThan(mock.calls[1]);
  });
});

```

To run the tests, add or modify the scripts script below in your `package.json`:

```json
"scripts": {
	"start": "node server/server.js",
	"client": "react-scripts start",
	"server": "nodemon --watch server server/server.js",
	"build": "react-scripts build",
	"test": "echo Running Tests... && jest",
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
