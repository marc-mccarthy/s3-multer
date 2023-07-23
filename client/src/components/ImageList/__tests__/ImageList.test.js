// ImageUpload.test.js

import { fireEvent, render } from '@testing-library/react';
import ImageUpload from '../ImageUpload';

describe('ImageUpload', () => {
  it('renders upload form', () => {
    const { getByText } = render(<ImageUpload />);
    expect(getByText('Upload Image')).toBeInTheDocument();
  });
  
  it('updates image name value', () => {
    const { getByLabelText } = render(<ImageUpload />);
    fireEvent.change(getByLabelText('Image name'), { target: { value: 'test.jpg' } });
    expect(getByLabelText('Image name').value).toBe('test.jpg');
  });

  // More tests...
});
