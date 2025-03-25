import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/Login";
import SignUp from "./components/signup/Signup";
import SplashScreen from "./components/splashScreen/SplashScreen";
import Main from "./components/main/Main";
import Users from "./components/users/Users";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const isAuthenticated = false;

  const PrivateRoute = ({ element, ...rest }) => {
    if (!isAuthenticated) {
      alert('Inicia sesión', 'Para ingresar debes iniciar sesión');
    }
  
    return isAuthenticated ? element : <Navigate to="/" replace />;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);



  return (
    <BrowserRouter>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
         {/*  <Route path="/users" element={<Users />} />
          <Route path="/main" element={<Main />} /> */}
          <Route path="/users" element={<PrivateRoute element={<Users />} />} />
          <Route path="/main" element={<PrivateRoute element={<Main />} />} /> 
        </Routes>
      )}
    </BrowserRouter>
  );

  /* return(
    <BrowserRouter>
     <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/splash" element={<SplashScreen/>} />
          <Route path="/users" element={<Users/>} />
        </Routes>
    </BrowserRouter>
  );
 */

};

export default App;
