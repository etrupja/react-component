import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import Home from './pages/Home';
import Docs from './pages/Docs';
import About from './pages/About';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
