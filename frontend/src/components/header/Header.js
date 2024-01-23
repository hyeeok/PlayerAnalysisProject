/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import LogoImage from './Header.png';

const Header = () => {
    const [sessionId, setSessionId] = useState(null);
    const [userName, setUserName] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const sessionId = getCookie('session_id');
        setSessionId(sessionId || null);

        if (sessionId) {
            fetchUserName(sessionId);
        }
    }, [location.pathname]);

    const fetchUserName = async (sessionId) => {
        try {
            const response = await fetch('http://localhost:8000/auth/fetch_user_name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId,
                }),
            });

            if (response.ok) {
                const userData = await response.json();
                setUserName(userData);
            }
        } catch (error) {
            console.error('사용자 정보를 가져오는 중 에러:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8000/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId,
                }),
            });

            if (response.ok) {
                document.cookie = 'session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                setSessionId(null);
                setUserName(null);
                window.location.href = '/home';
            } else {
                console.error('로그아웃 실패');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <header className={styles.container}>
            <div className={styles.top}>
                <h1><Link to="/home"><img src={LogoImage} alt="Logo" /></Link></h1>
                <div className={styles.subTitle}>
                    <h1>SPAP</h1>
                    <h3>SoccerPlayerAnalysis</h3>
                </div>
                <div>
                    {sessionId ? (
                        <>
                            <span>{userName && `안녕하세요, ${userName}님`}</span>
                            <button className={styles['logout-btn']} onClick={handleLogout}>로그아웃</button>
                        </>
                    ) : (
                        <>
                            <Link className={styles['login-link']} to="/login">로그인</Link>
                            <span><Link className={styles['register-link']} to="/register">회원가입</Link></span>
                        </>
                    )}
                </div>
            </div>
            <nav className={styles.menu}>
                <div><Link to="/player">Player</Link></div>
                <div>analysis</div>
                <div>stat</div>
                <div>shop</div>
                <div><Link to="/qa">Q&A</Link></div>
            </nav>
        </header>
    );
};

export default Header;
