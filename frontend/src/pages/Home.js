import React from 'react';
import './css/Home.css';
import homeImage from './images/home.jpeg';
function Home() {
    return (
        <div className="home-container">
            <div className="home-content">
                <h2>플레이어 분석에 오신 것을 환영합니다</h2>
                <p>
                    축구 선수들의 퍼포먼스 및 게임의 재미를 발견하세요. 팬, 코치 또는 분석가이든
                    당신을 위한 소중한 정보를 제공하는 플랫폼입니다.
                </p>
                <img
                    src={homeImage}
                    alt="축구 이미지"
                    className="home-image"
                />
                <p>
                    플레이어들의 성과를 분석하고 통계를 확인하여 더 나은 전략을 구상하세요. 최신
                    트랜드, 선수들의 업적, 그리고 팀의 현황을 탐색해보세요.
                </p>
                <p>
                    플레이어 분석은 당신의 축구 지식을 높이고 새로운 통찰력을 제공합니다. 함께
                    축구의 매력에 빠져보세요!
                </p>
            </div>
        </div>
    );
}

export default Home;
