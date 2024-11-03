import React from 'react';
import Login from './components/Login.tsx';
import Home from './components/Home.tsx';
import Layout from './components/Laayout.tsx';
import AuthRequirer from './components/AuthRequirer.tsx';

import { Routes, Route } from 'react-router-dom';


function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />


        {/* protected routes */}
        <Route element={<AuthRequirer/>}>
          <Route path="/" element={<Home />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;