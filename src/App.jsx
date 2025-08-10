import { useEffect } from 'react'
// import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { useThemeStore } from './store/useThemeStore';
import SettingsPage from './pages/SettingPage';
import ProfilePage from './pages/ProfilePage';



function App() {

  const { authUser, ischeckingAuth, checkAuth, onlineUsers } = useAuthStore();

  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if(!authUser && ischeckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }
  

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path='/' element={ authUser ? <HomePage /> : <Navigate to={'/login'} />} />
         <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={ authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={ authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>


      <Toaster />
    </div>
  )
}

export default App
