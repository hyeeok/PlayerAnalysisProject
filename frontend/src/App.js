/* eslint-disable */
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import Player from './pages/player/Player';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Qa from "./pages/qa/Qa";
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
          <Route path="/register" element={<Register />} />
          <Route path="/qa" element={<Qa />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
