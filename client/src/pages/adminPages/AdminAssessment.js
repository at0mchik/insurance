import React, { useState } from 'react';
import Header from '../../components/Header';

export default function AdminAssessment() {
    const [selectedFunction, setSelectedFunction] = useState('');
    const [formData, setFormData] = useState({});
    const [response, setResponse] = useState(null);

    const token = localStorage.getItem('token');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleExecute = async () => {
        let url = 'http://localhost:8000/api/assessment/';
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
                case 'getByClientId':
                    url += `user-id/${formData.clientId}`;
                    options.method = 'GET';
                    break;
                case 'getByAssessorId':
                    url += `assessor-id/${formData.assessorId}`;
                    options.method = 'GET';
                    break;
                case 'addAssessor':
                    url += `add-assessor`;
                    options.method = 'PUT';
                    options.body = JSON.stringify({
                        assessor_id: parseInt(formData.assessor_id),
                        assessment_id: parseInt(formData.assessment_id)
                    });
                    break;
                case 'changeResult':
                    url += `change-result/${formData.id}`;
                    options.method = 'PUT';

                    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

                    if (formData.result === 'cancelled') {
                        options.body = JSON.stringify({
                            status: 'cancelled',
                            result_date: today
                        });
                    } else {
                        options.body = JSON.stringify({
                            status: 'ready',
                            result_date: today,
                            result_text: formData.result_text,
                            value: parseInt(formData.value)
                        });
                    }
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
                        placeholder="ID заявки"
                        className="form-control mb-2"
                        onChange={handleInputChange}
                    />
                );
            case 'getByClientId':
                return (
                    <input
                        type="text"
                        name="clientId"
                        placeholder="ID клиента"
                        className="form-control mb-2"
                        onChange={handleInputChange}
                    />
                );
            case 'getByAssessorId':
                return (
                    <input
                        type="text"
                        name="assessorId"
                        placeholder="ID оценщика"
                        className="form-control mb-2"
                        onChange={handleInputChange}
                    />
                );
            case 'addAssessor':
                return (
                    <>
                        <input
                            type="text"
                            name="assessment_id"
                            placeholder="ID заявки"
                            className="form-control mb-2"
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="assessor_id"
                            placeholder="ID оценщика"
                            className="form-control mb-2"
                            onChange={handleInputChange}
                        />
                    </>
                );
            case 'changeResult':
                return (
                    <>
                        <input
                            type="text"
                            name="id"
                            placeholder="ID заявки"
                            className="form-control mb-2"
                            onChange={handleInputChange}
                        />
                        <select
                            name="result"
                            className="form-select mb-2"
                            onChange={handleInputChange}
                        >
                            <option value="">Выберите результат</option>
                            <option value="ready">Готово</option>
                            <option value="cancelled">Отменено</option>
                        </select>

                        {formData.result === 'ready' && (
                            <>
                                <input
                                    type="text"
                                    name="result_text"
                                    placeholder="Текст результата"
                                    className="form-control mb-2"
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="number"
                                    name="value"
                                    placeholder="Оценочная сумма"
                                    className="form-control mb-2"
                                    onChange={handleInputChange}
                                />
                            </>
                        )}
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
                <h2>Панель заявок</h2>

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
                    <option value="getAll">Получить все заявки</option>
                    <option value="getById">Получить заявку по ID</option>
                    <option value="getByClientId">Получить заявки по ID клиента</option>
                    <option value="getByAssessorId">Получить заявки по ID оценщика</option>
                    <option value="addAssessor">Назначить оценщика</option>
                    <option value="changeResult">Изменить результат</option>
                    <option value="delete">Удалить заявку</option>
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
