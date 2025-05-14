import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';

export default function AssessorAssignedAssessments() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [resultText, setResultText] = useState('');
    const [resultValue, setResultValue] = useState('');
    const [showResultForm, setShowResultForm] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    const [policyDetails, setPolicyDetails] = useState(null);

    useEffect(() => {
        const fetchAssessments = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Токен не найден, авторизация не пройдена.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/assessment/assessor-token', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Ошибка при получении заявок');
                }

                const data = await response.json();

                // Проверяем, что data не равно null
                if (data && data.data) {
                    setRequests(data.data);
                } else {
                    setError('Нет данных для отображения');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, []);

    const renderStatusBadge = (status) => {
        const badgeStyles = {
            pending: 'badge bg-warning text-dark',
            ready: 'badge bg-success',
            cancelled: 'badge bg-danger',
        };

        const statusLabels = {
            pending: 'В ожидании',
            ready: 'Готово',
            cancelled: 'Отменено',
        };

        return <span className={badgeStyles[status]}>{statusLabels[status]}</span>;
    };

    const handleCancelRequest = async (id) => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Токен не найден, авторизация не пройдена.');
            return;
        }

        const confirmation = window.confirm('Вы уверены, что хотите отменить заявку?');
        if (!confirmation) return;

        try {
            const response = await fetch(`http://localhost:8080/api/assessment/change-result/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'cancelled',
                    result_date: today,
                }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при отмене заявки');
            }

            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === id ? { ...request, status: 'cancelled' } : request
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSetReadyRequest = async (id) => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Токен не найден, авторизация не пройдена.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/assessment/change-result/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'ready',
                    result_text: resultText,
                    value: parseInt(resultValue),
                    result_date: today,
                }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при отправке оценки');
            }

            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === id ? { ...request, status: 'ready', result_text: resultText, value: resultValue } : request
                )
            );
            setShowResultForm(false); // Закрытие формы после отправки
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGetPolicyDetails = async (policyId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Токен отсутствует!');
            return;
        }

        try {
            console.log('fetching')
            const response = await fetch(`http://localhost:8080/api/policy/by-id/${policyId}`, {
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
            if (data && data) {
                setPolicyDetails(data); // Устанавливаем данные полиса
            } else {
                setError('Полис не найден');
            }

        } catch (err) {
            setError(`Ошибка при загрузке полиса: ${err.message}`);
        }
    };

    const getBorderStatusStyle = (status) => {
        switch (status) {
            case 'pending':
                return 'border-warning card mb-3';
            case 'ready':
                return 'border-success card mb-3';
            case 'cancelled':
                return 'border-danger card mb-3';
            default:
                return 'border-light card mb-3';
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
                            <p><strong>Существующие
                                заболевания:</strong> {policy.details.pre_existing_conditions.join(', ')}</p>
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
                            <p><strong>Общая оценочная стоимость: </strong> {policy.details.total_estimated_value_usd}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            <Header role="assessor" />
            <div className="container mt-4">
                <h2>Ваши заявки</h2>

                {loading ? (
                    <p>Загрузка...</p>
                ) : error ? (
                    <p className="text-danger">Ошибка: {error}</p>
                ) : requests.length === 0 ? (
                    <p>Нет заявок, назначенных вам.</p>
                ) : (
                    <div className="mt-3">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className={getBorderStatusStyle(req.status)}
                            >
                                <div className="card-body position-relative">
                                    <h5 className="card-title">
                                        Заявка №{req.id} {' '}
                                        {renderStatusBadge(req.status)}
                                    </h5>
                                    <p><strong>ID полиса:</strong> {req.policy_id}</p>
                                    <p><strong>Дата заявки:</strong> {req.request_date}</p>

                                    {req.status === 'ready' && req.result?.value > 0 && (
                                        <>
                                            <p><strong>Оценка:</strong> {req.result.value}</p>
                                            <p><strong>Комментарий:</strong> {req.result.result_text}</p>
                                            <p><strong>Дата оценки:</strong> {req.result.result_date}</p>
                                        </>
                                    )}

                                    <button
                                        className="btn btn-info mt-3"
                                        onClick={() => handleGetPolicyDetails(req.policy_id)}
                                    >
                                        Получить полис #{req.policy_id}
                                    </button>


                                    {/* Отображение данных полиса, если его ID совпадает с ID заявки */}
                                    {policyDetails && policyDetails.id === req.policy_id && (
                                        renderPolicyDetails(policyDetails)
                                    )}

                                    {req.status === 'cancelled' && (
                                        <p className="text-danger"><strong>Заявка отменена</strong></p>
                                    )}

                                    {req.status === 'pending' && (
                                        <div>
                                            <button
                                                className="btn btn-danger me-2"
                                                onClick={() => handleCancelRequest(req.id)}
                                            >
                                                Отменить заявку
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    setSelectedRequest(req.id);
                                                    setShowResultForm(true);
                                                }}
                                            >
                                                Установить готово
                                            </button>
                                        </div>
                                    )}

                                    {showResultForm && selectedRequest === req.id && (
                                        <div className="mt-3">
                                            <h5>Оценка</h5>
                                            <textarea
                                                className="form-control"
                                                placeholder="Введите текст оценки"
                                                value={resultText}
                                                onChange={(e) => setResultText(e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                className="form-control mt-2"
                                                placeholder="Введите сумму оценки"
                                                value={resultValue}
                                                onChange={(e) => setResultValue(e.target.value)}
                                            />
                                            <button
                                                className="btn btn-success mt-3"
                                                onClick={() => handleSetReadyRequest(req.id)}
                                            >
                                                Отправить
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
    );
}
