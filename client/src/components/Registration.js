import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Registration() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('male');  // Значение по умолчанию "male"
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [age, setAge] = useState('');
    const [info, setInfo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const newUser = {
            name,
            username,
            password,
            role: 'client',  // роль фиксированная
            gender: gender || 'male',  // Если gender пустой, то установим по умолчанию "male"
            phone,
            email,
            passport_number: passportNumber,
            age: parseInt(age),
            info,
        };

        try {
            const response = await fetch('http://localhost:8080/api/auth/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error('Ошибка при регистрации');
            }

            const data = await response.json();

            // Если сервер вернул "user created", считаем, что регистрация прошла успешно
            if (data === 'user created') {
                // Перенаправляем на страницу входа с уведомлением
                navigate('/', { state: { message: 'Аккаунт успешно создан! Теперь войдите.' } });
            } else {
                // Если возникла ошибка при регистрации
                setErrorMessage(data.message || 'Ошибка при регистрации');
            }
        } catch (err) {
            // В случае ошибки соединения с сервером
            setErrorMessage('Ошибка при соединении с сервером');
            console.error(err);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Регистрация</h2>
            {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div> // Уведомление об ошибке
            )}
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label>Имя</label>
                    <input
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Имя пользователя</label>
                    <input
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Пароль</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Пол</label>
                    <select
                        className="form-control"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}  // Меняем значение gender
                        required
                    >
                        <option value="male">Мужской</option>
                        <option value="female">Женский</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label>Телефон</label>
                    <input
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Электронная почта</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Номер паспорта</label>
                    <input
                        className="form-control"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Возраст</label>
                    <input
                        type="number"
                        className="form-control"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Дополнительная информация</label>
                    <input
                        className="form-control"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Зарегистрироваться
                </button>
            </form>
            <div className="mt-3">
                <p>
                    Уже есть аккаунт?{' '}
                    <a href="/login" className="btn btn-link">
                        Войти
                    </a>
                </p>
            </div>
        </div>
    );
}
