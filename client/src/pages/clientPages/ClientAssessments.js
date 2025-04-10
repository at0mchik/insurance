import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";

export default function ClientAssessments() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Токен отсутствует, авторизация не пройдена.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/assessment/user-token', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || 'Ошибка при загрузке заявок');
                }

                const data = await response.json();
                setRequests(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending':
                return 'badge bg-warning text-dark';
            case 'ready':
                return 'badge bg-success';
            case 'cancelled':
                return 'badge bg-danger';
            default:
                return 'badge bg-secondary';
        }
    };

    const getBorderStatusStyle = (status) => {
        switch (status) {
            case 'pending':
                return 'border-warning list-group-item mb-3 position-relative';
            case 'ready':
                return 'border-success list-group-item mb-3 position-relative';
            case 'cancelled':
                return 'border-danger list-group-item mb-3 position-relative';
            default:
                return 'border-light list-group-item mb-3 position-relative';
        }
    };

    const handleCancelRequest = async (requestId) => {
        const confirmCancel = window.confirm("Вы уверены, что хотите отменить заявку?");
        if (!confirmCancel) return;

        const token = localStorage.getItem('token');
        const today = new Date().toISOString().split('T')[0]; // формат YYYY-MM-DD

        try {
            const response = await fetch(`http://localhost:8000/api/assessment/change-result/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: "cancelled",
                    result_date: today
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Не удалось отменить заявку');
            }

            // обновить UI: убираем или обновляем заявку
            setRequests(prev => prev.map(req => req.id === requestId ? {
                ...req,
                status: 'cancelled',
                result: {
                    ...req.result,
                    result_date: today
                }
            } : req));

        } catch (err) {
            alert("Ошибка отмены: " + err.message);
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div>
            <Header role="client"/>
            <div className="container mt-5">
                <h2>Ваши заявки на оценку</h2>

                {requests.length === 0 ? (
                    <p className="mt-3">У вас нет заявок.</p>
                ) : (
                    <ul className="mt-4 list-group">
                        {requests.map((req) => (
                            <li key={req.id} className={getBorderStatusStyle(req.status)}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5>Заявка №{req.id}</h5>
                                    <span className={getStatusStyle(req.status)}>
                                        {req.status === 'pending' && 'В ожидании'}
                                        {req.status === 'ready' && 'Готово'}
                                        {req.status === 'cancelled' && 'Отменено'}
                                    </span>
                                </div>
                                <p><strong>ID полиса:</strong> {req.policy_id}</p>
                                <p><strong>Дата заявки:</strong> {req.request_date}</p>
                                <p><strong>Оценщик:</strong> {req.assessor_id === 0 ? 'Оценщик не назначен' : `#${req.assessor_id}`}</p>

                                {req.status === 'ready' && (
                                    <div className="mt-2">
                                        <p><strong>Результат:</strong> {req.result.result_text}</p>
                                        <p><strong>Оценочная стоимость:</strong> {req.result.value} ₽</p>
                                        <p><strong>Дата результата:</strong> {req.result.result_date}</p>
                                    </div>
                                )}
                                {req.status === 'cancelled' && (
                                    <div className="mt-2">
                                        <p><strong>Дата результата:</strong> {req.result.result_date}</p>
                                    </div>
                                )}

                                {req.status === 'pending' && (
                                    <button
                                        className="btn btn-danger position-absolute"
                                        style={{ bottom: '10px', right: '10px' }}
                                        onClick={() => handleCancelRequest(req.id)}
                                    >
                                        Отменить заявку
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
