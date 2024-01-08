// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './css/Header.css';

const Header = () => {
    return (
        <header>
            <h1><Link to="/home">PlayerAnalysis</Link></h1>
            <nav>
                <ul>
                    <li><Link to="/playerList">Player</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
