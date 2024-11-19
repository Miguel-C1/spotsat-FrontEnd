import React from 'react';
import Login from './pages/Login.tsx';
import Home from './pages/Home.jsx';
import Layout from './pages/Laayout.tsx';
import AuthRequirer from './pages/AuthRequirer.jsx';
import Search from './pages/Search.jsx';
import EditPolygonPage from './pages/EditPolygonPage.jsx';
import PointsOfInterestPage from './pages/PointsOfInterestPage.jsx';
import SearchPolygonsByRadius from './pages/SearchPolygonsByRadius.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="login" replace />} />

        <Route path="login" element={<Login />} />

        <Route element={<AuthRequirer />}>
          <Route path="home" element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="edit/:id" element={<EditPolygonPage />} />
          <Route path="pointsinterests/:id" element={<PointsOfInterestPage />} />
          <Route path="searchradius" element={<SearchPolygonsByRadius />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
