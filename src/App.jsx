import './App.css'
import { Route, Routes } from "react-router-dom";
import Sidebar from './Components/Sidebar';
import Home from './Components/Home';
import Interface from './Components/Interface';
import Chatbot from './Components/Chatbot';
import Awareness from './Components/Awareness';
import Login from './Components/Login';

function App() {

  return (
    <>
    {/* <div className='app-container'> */}
      <Sidebar />
      <div className='main-content'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/interface' element={<Interface />} />
        <Route path='/chatbot' element={<Chatbot />} />
        <Route path='/awareness' element={<Awareness />} />
        <Route path='login' element={<Login />} />
      </Routes>
      </div>
    {/* </div> */}
      
    </>
  )
}

export default App
