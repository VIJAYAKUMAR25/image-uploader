import './App.css';
import { Profile } from './components/profile/profile';
import 'react-image-crop/dist/ReactCrop.css';
import bootstrap from '../node_modules/bootstrap/dist/css/bootstrap.css';
import 'react-image-crop/dist/ReactCrop.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
function App() {
  return (
    <div className="App">
      <Profile/>
    </div>
  );
}

export default App;
