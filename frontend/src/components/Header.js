import React from 'react';
import { Link } from 'react-router-dom';
import './css/Header.css';

const Header = () => {
    return (
        <header>
            <h1><Link to="/home">PlayerAnalysis</Link></h1>
            <div>
                <button><Link to="/login">Login</Link></button>
            </div>
            <nav>
                <ul>
                    <li><Link to="/player">Player</Link></li>
                    <li>analysis</li>
                    <li>stat</li>
                    <li>shop</li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
