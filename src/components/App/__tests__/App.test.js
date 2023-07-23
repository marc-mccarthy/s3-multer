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
