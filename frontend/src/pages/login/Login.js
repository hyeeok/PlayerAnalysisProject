/* eslint-disable */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
    const [formData, setFormData] = useState({
        id: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                navigate('/home', { replace: true });
            } else {
                const data = await response.text();
                console.log(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className={styles['login-container']}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Id:
                    <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                    />
                </label>
                <br />
                <button type="submit">확인</button>
            </form>
        </div>
    );
}

export default Login;
