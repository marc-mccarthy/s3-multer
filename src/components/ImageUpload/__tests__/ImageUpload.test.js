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
