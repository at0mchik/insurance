import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Header from "../../components/Header";
import RequestAssessmentButton from "../../components/RequestAssessmentButton";


export default function ClientPolicies() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errMessage, setErrMessage] = useState(null)
    const [editPolicyId, setEditPolicyId] = useState(null);
    const [formData, setFormData] = useState({ premium: '', start_date: '', end_date: '' });


    useEffect(() => {
        const fetchPolicies = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Токен отсутствует, авторизация не пройдена.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/policy/user-token', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error('Ошибка при загрузке полисов');
                }

                const data = await response.json();
                if (data.data === null){
                    setErrMessage("data = null");
                }else{
                    setPolicies(data.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPolicies();
    }, []);

    const handleDeletePolicy = async (policyId) => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Токен отсутствует');

        const confirmDelete = window.confirm(`Удалить полис №${policyId}?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8000/api/policy/${policyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Не удалось удалить полис');

            // Обновляем список полисов
            setPolicies(prev => prev.filter(p => p.id !== policyId));
        } catch (error) {
            alert('Ошибка при удалении: ' + error.message);
        }
    };

    const handleEditClick = (policy) => {
        setEditPolicyId(policy.id);
        setFormData({
            premium: policy.premium,
            start_date: policy.start_date,
            end_date: policy.end_date,
        });
    };

    const handleEditSubmit = async (e, policyId) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return alert('Токен отсутствует');

        formData.premium = parseInt(formData.premium)
        try {
            const response = await fetch(`http://localhost:8000/api/policy/${policyId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Ошибка при обновлении');

            alert('Полис обновлён');
            setEditPolicyId(null);
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <div>
            <Header role="client"/>
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Ваши полисы</h2>
                    <Link to="/client/create" className="btn btn-primary">Создать новый полис</Link>
                </div>
                <div className="container mt-4">
                    <div>
                        {errMessage != null ? (
                            <p>У вас нет полисов.</p>
                        ) : (
                            <div className="justify-content-between align-items-center align-self-stretch">
                                {policies.map((policy) => (
                                    <div className="card d-flex flex-column mt-3">
                                        <h4 className="card-title pt-3 ps-3">Полис №{policy.id}</h4>
                                        <div className="card-body">
                                            <p><strong>Тип полиса: {policy.type}</strong></p>
                                            <p><strong>Начало:</strong> {policy.start_date}</p>
                                            <p><strong>Конец:</strong> {policy.end_date}</p>
                                            <p><strong>Премия:</strong> {policy.premium} ₽</p>
                                            <div className="card ml-2">
                                                <div className="card-body">
                                                    {/* Отображение данных в зависимости от типа полиса */}
                                                    {policy.type === 'car' && (
                                                        <div>
                                                            <h5>Детали:</h5>
                                                            <p><strong>Марка:</strong> {policy.details.make}</p>
                                                            <p><strong>Модель:</strong> {policy.details.model}</p>
                                                            <p><strong>Год:</strong> {policy.details.year}</p>
                                                            <p><strong>VIN:</strong> {policy.details.vin}</p>
                                                            <p><strong>Мощность двигателя
                                                                (л.с.):</strong> {policy.details.engine_power_hp}
                                                            </p>
                                                            <p><strong>Пробег
                                                                (км):</strong> {policy.details.mileage_km}</p>
                                                        </div>
                                                    )}

                                                    {policy.type === 'apartment' && (
                                                        <div>
                                                            <h5>Детали:</h5>
                                                            <p><strong>Адрес:</strong> {policy.details.address}</p>
                                                            <p><strong>Площадь (м²):</strong> {policy.details.area_sqm}
                                                            </p>
                                                            <p><strong>Этаж:</strong> {policy.details.floor}</p>
                                                            <p><strong>Тип
                                                                здания:</strong> {policy.details.building_type}</p>
                                                            <p><strong>Год
                                                                постройки:</strong> {policy.details.year_built}</p>
                                                        </div>
                                                    )}

                                                    {policy.type === 'health' && (
                                                        <div>
                                                            <h5>Детали:</h5>
                                                            <p><strong>ФИО:</strong> {policy.details.full_name}</p>
                                                            <p><strong>Дата
                                                                рождения:</strong> {policy.details.birth_date}</p>
                                                            <p><strong>Группа
                                                                крови:</strong> {policy.details.blood_type}</p>
                                                            <p><strong>Существующие
                                                                заболевания:</strong> {policy.details.pre_existing_conditions.join(', ')}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {policy.type === 'crypto' && (
                                                        <div>
                                                            <h5>Детали:</h5>
                                                            {policy.details.crypto_assets.length > 0 ? (
                                                                <ul>
                                                                    {policy.details.crypto_assets.map((asset, index) => (
                                                                        <li key={`${asset.currency}-${asset.amount}`}>
                                                                            <p>
                                                                                <strong>Сумма:</strong> {asset.amount} {asset.currency}
                                                                            </p>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <p>Нет криптовалютных активов.</p>
                                                            )}
                                                            <p><strong>Общая оценочная стоимость:
                                                            </strong> {policy.details.total_estimated_value_usd}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <RequestAssessmentButton policyId={policy.id} />

                                            {editPolicyId === policy.id ? (
                                                <form onSubmit={(e) => handleEditSubmit(e, policy.id)} className="mt-3">
                                                    <div className="mb-2">
                                                        <label>Премия</label>
                                                        <input
                                                            type="number"
                                                            name="premium"
                                                            className="form-control"
                                                            value={formData.premium}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label>Дата начала</label>
                                                        <input
                                                            type="date"
                                                            name="start_date"
                                                            className="form-control"
                                                            value={formData.start_date}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label>Дата окончания</label>
                                                        <input
                                                            type="date"
                                                            name="end_date"
                                                            className="form-control"
                                                            value={formData.end_date}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-start gap-2">
                                                        <button type="submit" className="btn btn-success">Сохранить</button>
                                                        <button type="button" className="btn btn-secondary" onClick={() => setEditPolicyId(null)}>Отмена</button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="d-flex justify-content-start gap-2 mt-3">
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        onClick={() => handleEditClick(policy)}
                                                    >
                                                        Изменить
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => handleDeletePolicy(policy.id)}
                                                    >
                                                        Удалить
                                                    </button>
                                                </div>
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
