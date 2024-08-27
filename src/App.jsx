import './App.css'
import { Route, Routes } from "react-router-dom";
import Sidebar from './Components/Sidebar';
import Home from './Components/Home';
import Interface from './Components/Interface';
import Chatbot from './Components/Chatbot';
import Awareness from './Components/Awareness';
import Login from './Components/Login';
import SignUp from './Components/SignUp';

function App() {

  return (
    <>
    {/* Amma Sidebar and App container class flex css ma che etle badha svgs home jsx ma differ thayela che */}
    <div className='app-container'>
      <Sidebar />
      <div className='main-content'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/interface' element={<Interface />} />
        <Route path='/chatbot' element={<Chatbot />} />
        <Route path='/awareness' element={<Awareness />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
      </div>
    </div>
      
    </>
  )
}

export default App
