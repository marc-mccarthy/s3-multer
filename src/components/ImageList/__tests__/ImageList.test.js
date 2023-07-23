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
