import ImageList from '../ImageList/ImageList';
import ImageUpload from '../ImageUpload/ImageUpload';
import { AppStyles } from './App.styles';

function App() {
  return (
    <AppStyles>
      <ImageUpload />
      <ImageList />
    </AppStyles>
  );
}

export default App;
