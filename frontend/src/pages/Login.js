import React from 'react';

function Login() {
    return (
        <div>
            <h2>Login</h2>
            <form>
                <label>
                    Id:
                    <input type="text" name="username" />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <br />
                <button type="submit">확인</button>
            </form>
        </div>
    );
}

export default Login;
