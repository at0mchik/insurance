import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken, saveToken } from '../utils/auth';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8000/api/auth/sign-in", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (data.token) {
                saveToken(data.token);
                const decoded = decodeToken(data.token);

                switch (decoded.user_role) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'client':
                        navigate('/client');
                        break;
                    case 'assessor':
                        navigate('/assessor');
                        break;
                    default:
                        alert("Неизвестная роль");
                }
            } else {
                alert("Ошибка авторизации");
            }
        } catch (err) {
            console.error(err);
            alert("Ошибка соединения");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Вход</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label>Имя пользователя</label>
                    <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Пароль</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Войти</button>
            </form>
        </div>
    );
}
