/* eslint-disable */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

function RegisterForm() {
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        address: '',
        phone_number: ''
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
            const response = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (response.ok) {
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
        <div className={styles.container}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
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
                    />
                </label>
                <br />

                <label>
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </label>
                <br />

                <label>
                    Phone Number:
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                    />
                </label>
                <br />
                <button type="submit" className={styles.button}>Register</button>
            </form>
        </div>
    );
}

export default RegisterForm;
