import React, {useEffect, useState} from 'react';
import {getUserRole, isAuthenticated} from '../utils/auth';
import {useNavigate} from 'react-router-dom';
import Header from './Header';

export default function AccountPage() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        fetch("http://localhost:8080/api/user/by-token", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setUser(data);
            })
            .catch(err => {
                console.error(err);
                alert("Ошибка получения данных пользователя");
            });
    }, [navigate]);

    if (!user) return <div className="container mt-5">Загрузка...</div>;

    const roleTranslations = {
        admin: {name: 'Админ', style: 'badge bg-danger'},
        client: {name: 'Клиент', style: 'badge bg-primary'},
        assessor: {name: 'Оценщик', style: 'badge bg-success'},
    };

    const role = roleTranslations[user.role] || {name: 'Неизвестная роль', style: 'badge bg-secondary'};

    const handleDelete = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) return;

        try {
            const res = await fetch(`http://localhost:8080/api/user/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });

            if (res.ok) {
                localStorage.removeItem('token');
                alert('Аккаунт удалён.');
                navigate('/login');
            } else {
                const error = await res.text();
                throw new Error(error);
            }
        } catch (err) {
            console.error(err);
            alert('Ошибка при удалении аккаунта');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedFields = {};
            if (editData.name !== "") updatedFields.name = editData.name;
            if (editData.password !== "") updatedFields.password = editData.password;
            if (editData.gender !== "") updatedFields.gender = editData.gender;
            if (editData.phone !== "") updatedFields.phone = editData.phone;
            if (editData.passport_number !== "") updatedFields.passport_number = editData.passport_number;
            if (editData.age !== "") updatedFields.age = parseInt(editData.age);
            if (editData.info !== "") updatedFields.info = editData.info;

            const res = fetch(`http://localhost:8080/api/user/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedFields),
            })

            setIsEditing(false);
            alert('Данные обновлены!');

        } catch (err) {
            console.error(err);
            alert('Ошибка при обновлении данных');
        }
    };

    return (
        <div>
            <Header role={user.role}/>
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>
                        {user.name}{" "}
                        <span className={role.style}>{role.name}</span>
                    </h2>
                    <div>
                        <button className="btn btn-danger" onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/login');
                        }}>
                            Выйти
                        </button>
                    </div>
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
                <div className="d-flex justify-content-start gap-2 mt-2">
                    <button className="btn btn-outline-primary" onClick={() => setIsEditing(true)}>Изменить</button>
                    <button className="btn btn-outline-danger ml-1" onClick={handleDelete}>Удалить</button>
                </div>
                {isEditing ? (
                    <form onSubmit={handleUpdate} className="card p-3 mb-3">
                        <h4>Заполните поля, которые хотите изменить (оставьте пустыми, если не хотите менять)</h4>
                        <div className="form-group mb-2">
                            <label>Имя:</label>
                            <input type="text" className="form-control"
                                   onChange={e => setEditData({...editData, name: e.target.value})}/>
                        </div>
                        <div className="form-group mb-2">
                            <label>Пароль:</label>
                            <input type="password" className="form-control"
                                   onChange={e => setEditData({...editData, password: e.target.value})}/>
                        </div>
                        <div className="form-group mb-2">
                            <label>Пол:</label>
                            <select className="form-control"
                                    onChange={e => setEditData({...editData, gender: e.target.value})}>
                                <option value="male">Мужской</option>
                                <option value="female">Женский</option>
                            </select>
                        </div>
                        <div className="form-group mb-2">
                            <label>Телефон:</label>
                            <input type="text" className="form-control"
                                   onChange={e => setEditData({...editData, phone: e.target.value})}/>
                        </div>
                        <div className="form-group mb-2">
                            <label>Паспорт:</label>
                            <input type="text" className="form-control"
                                   onChange={e => setEditData({...editData, passport_number: e.target.value})}/>
                        </div>
                        <div className="form-group mb-2">
                            <label>Возраст:</label>
                            <input type="number" className="form-control"
                                   onChange={e => setEditData({...editData, age: parseInt(e.target.value)})}/>
                        </div>
                        <div className="form-group mb-3">
                            <label>Доп. информация:</label>
                            <textarea className="form-control"
                                      onChange={e => setEditData({...editData, info: e.target.value})}/>
                        </div>

                        <button type="submit" className="btn btn-success mt-2">Сохранить</button>
                        <button type="button" className="btn btn-secondary mt-2"
                                onClick={() => setIsEditing(false)}>Отмена
                        </button>
                    </form>
                ) : (<div></div>)}
            </div>
        </div>
    );
}
