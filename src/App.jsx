import logo from './logo.svg';
import 'antd/dist/antd.css';
import EditPage from './EditPage';
import ReactView from './ReactView';

import {
  BrowserRouter ,
  Routes,
  Switch,
  Route,
  Link,
  useNavigate 
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter initialEntries={['/']}>
      <div className="App">
        <Routes>
        <Route exact path='/' element={<EditPage />} />
          <Route exact path='/reactview' element={<ReactView />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
