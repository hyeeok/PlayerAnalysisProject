// src/pages/Home.js
import React from 'react';
import './css/Home.css'; // 새로운 CSS 파일 import

function Home() {
    return (
        <div className="home-container">
            <div className="home-content">
                <h2>소커 플레이어 분석에 오신 것을 환영합니다</h2>
                <p>
                    축구 선수들의 퍼포먼스 및 게임의 재미를 발견하세요. 팬, 코치 또는 분석가이든
                    당신을 위한 소중한 정보를 제공하는 플랫폼입니다.
                </p>
            </div>
        </div>
    );
}

export default Home;
