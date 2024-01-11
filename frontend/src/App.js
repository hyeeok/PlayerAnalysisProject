import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Player from './pages/Player';
import Login from './pages/Login';
import './App.css';

const App = () => {
  return (
    <Router>
      <div id="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/player" element={<Player />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
