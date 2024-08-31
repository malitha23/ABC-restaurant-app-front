// src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/register', { username, password, email });
            alert(`Registration successful: ${response.data.message}`);
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed');
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;
