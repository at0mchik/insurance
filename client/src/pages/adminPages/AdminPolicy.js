import React, { useState } from 'react';
import Header from '../../components/Header';

export default function AdminPolicy() {
    const [selectedFunction, setSelectedFunction] = useState('');
    const [formData, setFormData] = useState({});
    const [response, setResponse] = useState(null);

    const token = localStorage.getItem('token');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let tempValue;
        if (name === "premium"){
            tempValue = parseInt(value)
        } else{
            tempValue = value
        }
        setFormData(prev => ({ ...prev, [name]: tempValue }));
    };

    const handleExecute = async () => {
        let url = 'http://localhost:8080/api/policy/';
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            switch (selectedFunction) {
                case 'getAll':
                    url += 'all'
                    options.method = 'GET';
                    break;
                case 'getById':
                    url += `by-id/${formData.id}`;
                    options.method = 'GET';
                    break;
                case 'getByUserId':
                    url += `user-id/${formData.userId}`;
                    options.method = 'GET';
                    break;
                case 'update':
                    url += formData.id;
                    options.method = 'PUT';

                    // Убираем пустые поля, кроме id
                    const { id, ...rest } = formData;
                    const filtered = Object.fromEntries(
                        Object.entries(rest).filter(([_, value]) => value !== '')
                    );
                    options.body = JSON.stringify(filtered);
                    break;
                case 'delete':
                    url += formData.id;
                    options.method = 'DELETE';
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
                        placeholder="ID полиса"
                        className="form-control mb-2"
                        onChange={handleInputChange}
                    />
                );
            case 'getByUserId':
                return (
                    <input
                        type="text"
                        name="userId"
                        placeholder="ID пользователя"
                        className="form-control mb-2"
                        onChange={handleInputChange}
                    />
                );
            case 'update':
                return (
                    <>
                        <input
                            type="text"
                            name="id"
                            placeholder="ID полиса"
                            className="form-control mb-2"
                            onChange={handleInputChange}
                        />
                        {/* Пример дополнительных обновляемых полей */}
                        <input
                            type="number"
                            name="premium"
                            placeholder="Премия"
                            className="form-control mb-2"
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="start_date"
                            placeholder="Дата начала"
                            className="form-control mb-2"
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="end_date"
                            placeholder="Дата конца"
                            className="form-control mb-2"
                            onChange={handleInputChange}
                        />
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
                <h2>Панель полисов</h2>

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
                    <option value="getAll">Получить все полисы</option>
                    <option value="getById">Получить полис по ID</option>
                    <option value="getByUserId">Получить полисы по ID пользователя</option>
                    <option value="update">Обновить полис по ID</option>
                    <option value="delete">Удалить полис по ID</option>
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
