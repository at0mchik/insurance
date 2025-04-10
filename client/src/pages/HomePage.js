import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="container mt-5 text-center">
            <h1 className="mb-4">Добро пожаловать!</h1>
            <p className="mb-4">Пожалуйста, выберите действие:</p>
            <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                    Войти
                </button>
                <button className="btn btn-outline-primary" onClick={() => navigate('/register')}>
                    Зарегистрироваться
                </button>
            </div>
        </div>
    );
}
