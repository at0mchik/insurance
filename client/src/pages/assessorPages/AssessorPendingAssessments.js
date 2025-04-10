import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';

export default function AssessorPendingAssessments() {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorAssessment, setErrorAssessment] = useState(null); // Для ошибок конкретной заявки
    const [policyDetails, setPolicyDetails] = useState(null); // Данные полиса
    const [selectedPolicyId, setSelectedPolicyId] = useState(null); // ID выбранного полиса

    useEffect(() => {
        const fetchAssessments = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Токен отсутствует, авторизация не пройдена.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/assessment/empty', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error('Ошибка при загрузке заявок');
                }

                const data = await response.json();

                // Проверка на null и data
                if (data && data.data) {
                    setAssessments(data.data);
                } else {
                    setError('Нет данных для отображения');
                }
            } catch (err) {
                setError(`Ошибка при загрузке заявок: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, []);

    const handleTakeAssessment = async (assessmentId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Токен отсутствует!');
            return;
        }

        const confirmation = window.confirm('Вы уверены, что хотите взять заявку в работу?');
        if (!confirmation) return;

        try {
            const response = await fetch(`http://localhost:8000/api/assessment/add-assessor`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assessment_id: assessmentId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Ошибка при назначении оценщика');
            }

            alert('Заявка успешно взята в работу!');

        } catch (err) {
            setErrorAssessment(`Ошибка при взятии заявки #${assessmentId}: ${err.message}`); // Отображаем ошибку конкретной заявки
        }
    };

    // Функция для получения полиса по ID
    const handleGetPolicyDetails = async (policyId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Токен отсутствует!');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/policy/${policyId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Ошибка при получении полиса');
            }

            const data = await response.json();
            if (data && data.policy) {
                setPolicyDetails(data.policy); // Устанавливаем данные полиса
                setSelectedPolicyId(policyId); // Сохраняем ID выбранного полиса
            } else {
                setError('Полис не найден');
            }

        } catch (err) {
            setError(`Ошибка при загрузке полиса: ${err.message}`);
        }
    };

    // Функция для рендеринга данных полиса в зависимости от типа
    const renderPolicyDetails = (policy) => {
        if (!policy) return null;

        return (
            <div className="card ml-2">
                <div className="card-body">
                    <p><strong>Тип полиса:</strong> {policy.type}</p>
                    <p><strong>Начало:</strong> {policy.start_date}</p>
                    <p><strong>Конец:</strong> {policy.end_date}</p>
                    <p><strong>Премия:</strong> {policy.premium} ₽</p>

                    {/* Отображение данных в зависимости от типа полиса */}
                    {policy.type === 'car' && (
                        <div>
                            <h6>Детали автомобиля:</h6>
                            <p><strong>Марка:</strong> {policy.details.make}</p>
                            <p><strong>Модель:</strong> {policy.details.model}</p>
                            <p><strong>Год:</strong> {policy.details.year}</p>
                            <p><strong>VIN:</strong> {policy.details.vin}</p>
                            <p><strong>Мощность двигателя (л.с.):</strong> {policy.details.engine_power_hp}</p>
                            <p><strong>Пробег (км):</strong> {policy.details.mileage_km}</p>
                        </div>
                    )}

                    {policy.type === 'apartment' && (
                        <div>
                            <h6>Детали апартаментов:</h6>
                            <p><strong>Адрес:</strong> {policy.details.address}</p>
                            <p><strong>Площадь (м²):</strong> {policy.details.area_sqm}</p>
                            <p><strong>Этаж:</strong> {policy.details.floor}</p>
                            <p><strong>Тип здания:</strong> {policy.details.building_type}</p>
                            <p><strong>Год постройки:</strong> {policy.details.year_built}</p>
                        </div>
                    )}

                    {policy.type === 'health' && (
                        <div>
                            <h6>Детали здоровья:</h6>
                            <p><strong>ФИО:</strong> {policy.details.full_name}</p>
                            <p><strong>Дата рождения:</strong> {policy.details.birth_date}</p>
                            <p><strong>Группа крови:</strong> {policy.details.blood_type}</p>
                            <p><strong>Существующие заболевания:</strong> {policy.details.pre_existing_conditions.join(', ')}</p>
                            <p><strong>Сумма страхования:</strong> {policy.details.insured_sum} ₽</p>
                        </div>
                    )}

                    {policy.type === 'crypto' && (
                        <div>
                            <h6>Детали криптовалюты:</h6>
                            {policy.details.crypto_assets.length > 0 ? (
                                <ul>
                                    {policy.details.crypto_assets.map((asset, index) => (
                                        <li key={index}>
                                            <p>
                                                <strong>Сумма:</strong> {asset.amount} {asset.currency}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Нет криптовалютных активов.</p>
                            )}
                            <p><strong>Общая оценочная стоимость (USD):</strong> {policy.details.total_estimated_value_usd} USD</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>; // Показываем ошибку на уровне страницы
    }

    return (
        <div>
            <Header role="assessor" />
            <div className="container mt-3">
                <h2>Заявки требующие оценщика</h2>

                {assessments.length === 0 ? (
                    <p>Нет заявок, требующих оценщика.</p>
                ) : (
                    <div>
                        {assessments.map((assessment) => (
                            <div key={assessment.id} className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">Заявка #{assessment.id}</h5>
                                    <p><strong>Статус:</strong>
                                        <span className='badge bg-warning text-dark'>
                                            В ожидании
                                        </span>
                                    </p>
                                    <p><strong>Дата запроса:</strong> {assessment.request_date}</p>

                                    {/* Вывод кнопки для получения полиса */}
                                    {assessment.policy && (
                                        <button
                                            className="btn btn-info mt-3"
                                            onClick={() => handleGetPolicyDetails(assessment.policy.id)}
                                        >
                                            Получить полис #{assessment.policy.id}
                                        </button>
                                    )}

                                    {/* Вывод полиса, если он есть */}
                                    {selectedPolicyId === assessment.policy?.id && renderPolicyDetails(policyDetails)}

                                    {/* Кнопка для взятия заявки в работу */}
                                    {assessment.status === 'pending' && (
                                        <button
                                            className="btn btn-primary mt-3"
                                            onClick={() => handleTakeAssessment(assessment.id)}
                                        >
                                            Взять в работу
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
