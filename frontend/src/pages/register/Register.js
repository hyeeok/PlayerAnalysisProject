/* eslint-disable */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

function RegisterForm() {
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        confirmPassword: '',
        email: '',
        user_name: '',
        phone_number: '',
        address: ''
    });

    const [isIdAvailable, setIsIdAvailable] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [idAvailabilityMessage, setIdAvailabilityMessage] = useState('');
    const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
    const [isVerificationCodeInputVisible, setIsVerificationCodeInputVisible] = useState(false);
    const [enteredVerificationCode, setEnteredVerificationCode] = useState('');
    const [serverVerificationCode, setServerVerificationCode] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        if (name === 'id') {
            setIsIdAvailable(true);
            setIdAvailabilityMessage('');
        }

        if (name === 'confirmPassword') {
            setIsPasswordConfirmed(formData.password === value);
        }
    };

    const handleCheckIdAvailability = async () => {
        try {
            const response = await fetch(`http://localhost:8000/auth/check_id`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: formData.id,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setIsIdAvailable(data.available);
                setIdAvailabilityMessage(data.available ? '사용 가능한 아이디입니다.' : '이미 존재하는 아이디입니다.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendVerificationCode = async () => {
        try {
            const response = await fetch('http://localhost:8000/auth/send_verification_code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setIsVerificationCodeInputVisible(true);
                setServerVerificationCode(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleVerifyCode = () => {
        if (enteredVerificationCode && serverVerificationCode) {
            if (enteredVerificationCode === serverVerificationCode) {
                setIsVerificationCodeInputVisible(false);
                setIsEmailVerified(true)
                alert('본인인증 완료하였습니다.');
                document.getElementsByName('user_name')[0].focus();
            } else {
                alert('인증번호가 일치하지 않습니다.');
                document.getElementsByName('verificationCode')[0].focus();
            }
        } else {
            console.log('입력된 인증번호 또는 서버에서 받은 인증번호가 없습니다.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!isIdAvailable) {
                alert('아이디 중복을 확인해주세요.');
                document.getElementsByName('id')[0].focus();
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                alert('비밀번호를 확인해주세요.');
                document.getElementsByName('password')[0].focus();
                return;
            }
            if (!isEmailVerified) {
                alert('본인인증을 완료해주세요.');
                document.getElementsByName('email')[0].focus();
                return;
            }

            if (!formData.user_name.trim() || !formData.phone_number.trim() || !formData.address.trim()) {
                alert('필수 항목을 입력해주세요.');
                return;
            }

            const response = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (response.ok) {
                alert(formData.user_name + '님 회원가입 완료.');
                navigate('/home', { replace: true });
            } else {
                const data = await response.text();
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
                    <button type="button" onClick={handleCheckIdAvailability}>
                        중복 확인
                    </button>
                    {idAvailabilityMessage && (
                        <span className={styles.message}>
                            {idAvailabilityMessage}
                        </span>
                    )}
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
                    Confirm Password:
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {formData.confirmPassword && (
                        <span className={styles.message}>
                            {isPasswordConfirmed ? '비밀번호 확인이 일치합니다.' : '비밀번호 확인이 일치하지 않습니다.'}
                        </span>
                    )}
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        readOnly={isEmailVerified} // 여기서 readOnly 속성을 추가
                    />
                    {!isEmailVerified && (
                        <button type="button" onClick={handleSendVerificationCode}>
                            인증 요청
                        </button>
                    )}
                    {isEmailVerified && (
                        <span className={styles.message}>
                            인증 완료
                        </span>
                    )}
                </label>
                {isVerificationCodeInputVisible && (
                    <div>
                        <label>
                            Verification Code:
                            <input
                                type="text"
                                name="verificationCode"
                                value={enteredVerificationCode}
                                onChange={(e) => setEnteredVerificationCode(e.target.value)}
                            />
                        </label>
                        <button type="button" onClick={handleVerifyCode}>
                            Verify Code
                        </button>
                    </div>
                )}
                <label>
                    User Name:
                    <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                    />
                </label>

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

                <button type="submit" className={styles.button}>Register</button>
            </form>
        </div>
    );
}

export default RegisterForm;