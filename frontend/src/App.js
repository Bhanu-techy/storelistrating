import {BrowserRouter , Routes, Route} from 'react-router-dom'
import Login from './components/Login';
import Home from './components/Home';
import AdminPage from './components/AdminPage';
import OwnerPage from './components/OwnerPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route exact path='/user' element={<Home/>}/>
      <Route exact path='/admin' element={<AdminPage />}/>
      <Route exact path="/owner" element={<OwnerPage/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;
