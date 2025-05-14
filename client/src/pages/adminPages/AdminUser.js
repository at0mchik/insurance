import React, { useState } from 'react';
import Header from '../../components/Header';

export default function AdminUser() {
    const [selectedFunction, setSelectedFunction] = useState('');
    const [formData, setFormData] = useState({});
    const [response, setResponse] = useState(null);

    const token = localStorage.getItem('token');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let tempValue;
        if (name === "age"){
            tempValue = parseInt(value)
        } else{
            tempValue = value
        }
        setFormData(prev => ({ ...prev, [name]: tempValue }));
    };

    const handleExecute = async () => {
        let url = 'http://localhost:8080/api/user/';
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            switch (selectedFunction) {
                case 'getAll':
                    options.method = 'GET';
                    break;
                case 'getById':
                    url += formData.id;
                    options.method = 'GET';
                    break;
                case 'create':
                    options.method = 'POST';
                    options.body = JSON.stringify(formData);
                    break;
                case 'delete':
                    url += formData.id;
                    options.method = 'DELETE';
                    break;
                case 'update':
                    url += formData.id;
                    options.method = 'PUT';

                    // Копируем formData и убираем пустые значения (кроме id)
                    const { id, ...rest } = formData;
                    const filteredData = Object.fromEntries(
                        Object.entries(rest).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
                    );

                    options.body = JSON.stringify(filteredData);
                    break;
                default:
                    return;
            }

            const res = await fetch(url, options);
            const result = await res.json();
            setResponse(result);
        } catch (err) {
            console.error(err);
            setResponse({ error: 'Ошибка запроса' });
        }
    };

    const renderForm = () => {
        switch (selectedFunction) {
            case 'getById':
            case 'delete':
                return (
                    <input
                        type="text"
                        name="id"
                        placeholder="ID пользователя"
                        className="form-control mb-2"
                        onChange={handleInputChange}
                    />
                );
            case 'create':
                return (
                    <>
                        <input type="text" name="name" placeholder="Имя" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="text" name="username" placeholder="Username" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="password" name="password" placeholder="Пароль" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="text" name="gender" placeholder="Пол (male/female)" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="email" name="email" placeholder="Почта" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="text" name="phone" placeholder="Телефон" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="text" name="passport_number" placeholder="Паспорт" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="number" name="age" placeholder="Возраст" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="text" name="info" placeholder="Доп. информация" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="text" name="role" placeholder="Роль (admin/client/assessor)" className="form-control mb-2" onChange={handleInputChange} />
                    </>
                );
            case 'update':
                return (
                    <>
                        <input type="text" name="id" placeholder="ID пользователя" className="form-control mb-2" onChange={handleInputChange} />
                        {/* Поля для обновления */}
                        <input type="text" name="name" placeholder="Имя (необязательно)" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="password" name="password" placeholder="Пароль (необязательно)" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="text" name="gender" placeholder="Пол (male/female)" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="text" name="phone" placeholder="Телефон" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="text" name="passport_number" placeholder="Паспорт" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="number" name="age" placeholder="Возраст" className="form-control mb-2" onChange={handleInputChange} />
                        <input type="text" name="info" placeholder="Доп. информация" className="form-control mb-2" onChange={handleInputChange} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <Header role="admin" />
            <div className="container mt-3">
                <h2>Панель пользователей</h2>

                <select
                    className="form-select my-3"
                    value={selectedFunction}
                    onChange={e => {
                        setSelectedFunction(e.target.value);
                        setFormData({});
                        setResponse(null);
                    }}
                >
                    <option value="">Выберите действие</option>
                    <option value="getAll">Получить всех пользователей</option>
                    <option value="getById">Получить пользователя по ID</option>
                    <option value="create">Создать нового пользователя</option>
                    <option value="update">Изменить пользователя</option>
                    <option value="delete">Удалить пользователя</option>
                </select>

                {selectedFunction && (
                    <div className="card p-3 mb-3">
                        {renderForm()}
                        <button className="btn btn-primary" onClick={handleExecute}>
                            Выполнить
                        </button>
                    </div>
                )}

                {response && (
                    <div className="card p-3">
                        <h5>Ответ сервера:</h5>
                        <pre>{JSON.stringify(response, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}
