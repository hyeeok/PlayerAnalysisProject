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

    const [isIdAvailable, setIsIdAvailable] = useState(true);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [idAvailabilityMessage, setIdAvailabilityMessage] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
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

    const handleVerifyEmail = () => {
        // 여기에서 이메일 인증 로직을 추가할 수 있습니다.
        // 이 예제에서는 간단히 인증 상태를 토글합니다.
        setIsEmailVerified(!isEmailVerified);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!isIdAvailable) {
                console.log('아이디가 이미 사용 중입니다.');
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                console.log('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
                return;
            }

            if (!isEmailVerified) {
                console.log('이메일이 인증되지 않았습니다.');
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
                        onBlur={handleCheckIdAvailability}
                    />
                    <button type="button" onClick={handleCheckIdAvailability}>
                        중복 확인
                    </button>
                    {idAvailabilityMessage && <span className={styles.message}>{idAvailabilityMessage}</span>}
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
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <button type="button" onClick={handleVerifyEmail}>
                        {isEmailVerified ? '인증 완료' : '인증 요청'}
                    </button>
                </label>

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


// /* eslint-disable */

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from './Register.module.css';

// function RegisterForm() {
//     const [formData, setFormData] = useState({
//         id: '',
//         password: '',
//         address: '',
//         phone_number: ''
//     });

//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch('http://localhost:8000/auth/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData),
//                 credentials: 'include'
//             });

//             if (response.ok) {
//                 navigate('/home', { replace: true });
//             } else {
//                 const data = await response.text();
//                 console.log(data);
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter') {
//             handleSubmit(e);
//         }
//     };

//     return (
//         <div className={styles.container}>
//             <h2>Register</h2>
//             <form onSubmit={handleSubmit} className={styles.form}>
//                 <label>
//                     Id:
//                     <input
//                         type="text"
//                         name="id"
//                         value={formData.id}
//                         onChange={handleChange}
//                     />
//                 </label>
//                 <br />

//                 <label>
//                     Password:
//                     <input
//                         type="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                     />
//                 </label>
//                 <br />

//                 <label>
//                     Address:
//                     <input
//                         type="text"
//                         name="address"
//                         value={formData.address}
//                         onChange={handleChange}
//                     />
//                 </label>
//                 <br />

//                 <label>
//                     Phone Number:
//                     <input
//                         type="text"
//                         name="phone_number"
//                         value={formData.phone_number}
//                         onChange={handleChange}
//                         onKeyPress={handleKeyPress}
//                     />
//                 </label>
//                 <br />
//                 <button type="submit" className={styles.button}>Register</button>
//             </form>
//         </div>
//     );
// }

// export default RegisterForm;
