/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import LogoImage from './Header.png';

const Header = () => {
    const [sessionId, setSessionId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 쿠키에서 세션 ID 가져오기
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        // 쿠키에서 세션 ID를 가져와서 세션 상태 갱신
        const sessionId = getCookie('session_id');
        setSessionId(sessionId || null);
    }, [location.pathname]); // 경로가 변경될 때마다 세션 ID를 가져옴

    const handleLogout = async () => {
        try {
            // 세션 쿠키 삭제
            document.cookie = 'session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            // 세션 ID 상태 업데이트
            setSessionId(null);

            // 로그아웃 후 홈 페이지로 이동
            window.location.href = '/home';
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
                        <button onClick={handleLogout}>로그아웃</button>
                    ) : (
                        <>
                            <Link to="/login">로그인</Link>
                            <span><Link to="/register">회원가입</Link></span>
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
