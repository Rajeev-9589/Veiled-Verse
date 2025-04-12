import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import SignupPage from './pages/SignupPage';
import Login from './pages/Login';
import Explore from './pages/Explore';
import Write from './pages/Write';
import Marketplace from './pages/MarketPlace';
import Subscribe from './pages/Subscription';
import StoryPreview from './components/Preview';
import StoryRead from './pages/Storyread';
import { StoryContextProvider } from './contexts/StoryContext';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './Routes/PrivateRoute';
import UpdateRole from './pages/UpdateRole';

function App() {

  return (
    <div className='pt-[64px]'>
          <Navbar/>
    <StoryContextProvider>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/signup' element={<SignupPage/>} />
      <Route path='/login' element={<Login/>} />
      {/* <Route path='/Explore' element={<Explore/>} /> */}
      <Route path='/Dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>} />

      <Route path='/Write' element={<PrivateRoute><Write/></PrivateRoute>} />
      <Route path='/Marketplace' element={<Marketplace/>} />
      <Route path='/subscribe' element={<Subscribe/>} />
      <Route path='/read/:id' element={<StoryRead/>} />
      <Route path="/update-role" element={<UpdateRole />} />

      <Route path='/preview/:id' element={<StoryPreview/>} />
    </Routes>
    </StoryContextProvider>
    <Toaster position="top-center" richColors />
    </div>
  )
}

export default App
