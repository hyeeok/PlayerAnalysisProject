import React, { useState, useEffect } from 'react';
import styles from './Player.module.css';

function Player() {
    const [players, setPlayers] = useState([]);
    const [displayedPlayers, setDisplayedPlayers] = useState(500);
    const [selectedPlayerImage, setSelectedPlayerImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/player');
                const data = await response.json();
                setPlayers(data.data);
            } catch (error) {
                console.error('데이터를 불러오는 동안 에러 발생:', error);
            }
        };

        fetchData();
    }, []);

    const handlePlayerNameClick = async (player) => {
        try {
            // 여기에서 해당 선수의 이미지를 가져오는 API 호출
            const imageResponse = await fetch(`http://localhost:8000/player/image?rank=${player.rank}&player_name=${player.player_name}`);

            // 이미지 데이터를 Blob 형태로 응답 받습니다.
            const imageDataBlob = await imageResponse.blob();

            // Blob 데이터를 이미지 URL로 변환
            const imageUrl = URL.createObjectURL(imageDataBlob);

            // 이미지 URL을 상태에 저장
            setSelectedPlayerImage(imageUrl);
        } catch (error) {
            console.error('이미지를 가져오는 동안 에러 발생:', error);
        }
    };

    return (
        <div>
            <h2>선수 목록</h2>
            <div className={styles.wrap}>
                <div className={styles['table-wrapper']}>
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
                                <tr key={player.rank} onClick={() => handlePlayerNameClick(player)}>
                                    <td>{player.rank}</td>
                                    <td>
                                        <span className={styles['player-name-link']}>
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
                </div>
                {selectedPlayerImage && (
                    <div className='player_image'>
                        <img src={selectedPlayerImage} alt='Player Image' />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Player;
