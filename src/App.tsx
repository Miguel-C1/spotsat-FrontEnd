import React from 'react';
import Login from './components/Login.tsx';
import Home from './components/Home.tsx';
import Layout from './components/Laayout.tsx';
import AuthRequirer from './components/AuthRequirer.tsx';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="login" replace />} />

        <Route path="login" element={<Login />} />

        <Route element={<AuthRequirer />}>
          <Route path="home" element={<Home />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
