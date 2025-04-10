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

    useEffect(() => {
        const fetchAssessments = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Токен не найден, авторизация не пройдена.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/assessment/assessor-token', {
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
            const response = await fetch(`http://localhost:8000/api/assessment/change-result/${id}`, {
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
            const response = await fetch(`http://localhost:8000/api/assessment/change-result/${id}`, {
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
                                className={`card mb-3 ${req.status === 'cancelled' ? 'border-danger' : ''}`}
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
                                            <p><strong>Оценка:</strong> {req.result.value} USD</p>
                                            <p><strong>Комментарий:</strong> {req.result.result_text}</p>
                                            <p><strong>Дата оценки:</strong> {req.result.result_date}</p>
                                        </>
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
