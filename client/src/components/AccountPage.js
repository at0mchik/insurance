import React, { useEffect, useState } from 'react';
import { getUserRole, isAuthenticated } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export default function AccountPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        fetch("http://localhost:8000/api/user/by-token", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => {
                console.error(err);
                alert("Ошибка получения данных пользователя");
            });
    }, [navigate]);

    if (!user) {
        return <div className="container mt-5">Загрузка...</div>;
    }

    // Объект с переведенными ролями и стилями
    const roleTranslations = {
        admin: { name: 'Админ', style: 'badge bg-danger' },
        client: { name: 'Клиент', style: 'badge bg-primary' },
        assessor: { name: 'Оценщик', style: 'badge bg-success' },
    };

    // Получаем нужное название и стиль для роли
    const role = roleTranslations[user.role] || { name: 'Неизвестная роль', style: 'badge bg-secondary' };

    return (
        <div>
            <Header role={user.role} />
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>
                        {user.name}{" "}
                        <span className={role.style}>{role.name}</span>
                    </h2>
                    <button className="btn btn-outline-danger" onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }}>
                        Выйти
                    </button>
                </div>

                <div className="card">
                    <div className="card-body">
                        <p><strong>Имя пользователя:</strong> {user.username}</p>
                        <p><strong>Пол:</strong> {user.gender === 'male' ? 'Мужской' : 'Женский'}</p>
                        <p><strong>Возраст:</strong> {user.age}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Телефон:</strong> {user.phone}</p>
                        <p><strong>Паспорт:</strong> {user.passport_number}</p>
                        <p><strong>Доп. информация:</strong> {user.info}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
