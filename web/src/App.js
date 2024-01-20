import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css';
import Login from './View/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import LayoutLogin from './Layout/LayoutLogin';
import SignUp from './View/SignUp';
import LayoutChat from './Layout/LayoutChat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LayoutLogin/>}>
          <Route path='/chat-app/login' element={<Login/>}/>
          <Route path='/chat-app/sign-up' element={<SignUp/>}/>
          <Route path='/chat-app/chat' element={<LayoutChat/>}>
              
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
