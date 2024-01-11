import React, { useState, useEffect } from 'react';
import './css/Player.css';

function Player() {
    const [players, setPlayers] = useState([]);
    const [displayedPlayers, setDisplayedPlayers] = useState(50);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/home');
                const data = await response.json();
                setPlayers(data.data);
            } catch (error) {
                console.error('데이터를 불러오는 동안 에러 발생:', error);
            }
        };

        fetchData();
    }, []);

    const handlePlayerNameClick = (playerName) => {
        const searchUrl = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURIComponent(playerName)}`;
        window.open(searchUrl, '_blank');
    };

    const handleShowMoreClick = () => {
        setDisplayedPlayers((prevDisplayedPlayers) => prevDisplayedPlayers + 50);
    };

    return (
        <div>
            <h2>선수 목록</h2>
            <table>
                <thead>
                    <tr>
                        <th>순위</th>
                        <th>선수 이름</th>
                        <th>포지션</th>
                        <th>나이</th>
                        <th>국적</th>
                        <th>현 팀</th>
                        <th>시장 가치</th>
                    </tr>
                </thead>
                <tbody>
                    {players.slice(0, displayedPlayers).map((player) => (
                        <tr key={player.rank}>
                            <td>{player.rank}</td>
                            <td>
                                <span
                                    className="player-name-link"
                                    onClick={() => handlePlayerNameClick(player.player_name)}
                                >
                                    {player.player_name}
                                </span>
                            </td>
                            <td>{player.position}</td>
                            <td>{player.age}</td>
                            <td>{player.nationality}</td>
                            <td>{player.current_team}</td>
                            <td>{player.market_value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {displayedPlayers < players.length && (
                <button className="more-button" onClick={handleShowMoreClick}>더 보기</button>
            )}
        </div>
    );
}

export default Player;
