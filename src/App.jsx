import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login/Login';
import SingUp from './components/signup/Signup';

const App = () => {
  return (

      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SingUp />} />
      </Routes>
  );
};


export default App;
