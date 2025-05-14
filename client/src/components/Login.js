import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { decodeToken, saveToken } from '../utils/auth';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();  // Извлекаем сообщение из состояния маршрута
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (location.state && location.state.message) {
            setMessage(location.state.message);
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8080/api/auth/sign-in", {
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
                        navigate('/admin/main');
                        break;
                    case 'client':
                        navigate('/client/policies');
                        break;
                    case 'assessor':
                        navigate('/assessor/assigned');
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
            {message && <div className="alert alert-info">{message}</div>}  {/* Показываем сообщение при наличии */}
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
            <div className="mt-3">
                <p>Нет аккаунта? <a href="/register" className="btn btn-link">Зарегистрироваться</a></p>
            </div>
        </div>
    );
}
