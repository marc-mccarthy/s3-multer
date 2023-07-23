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
