// components/RequestEvaluationButton.js

import React, { useState } from 'react';

export default function RequestAssessmentButton({ policyId }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleRequest = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Токен не найден. Авторизуйтесь.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('http://localhost:8000/api/assessment/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    policy_id: policyId,
                    request_date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Ошибка запроса');
            }

            setSuccess('Заявка успешно отправлена!');
        } catch (err) {
            setError(`Ошибка: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-3">
            <button
                onClick={handleRequest}
                className="btn btn-danger"
                disabled={loading}
            >
                {loading ? 'Отправка...' : 'Заявить о страховом случае'}
            </button>
            {success && <p className="text-success mt-2">{success}</p>}
            {error && <p className="text-danger mt-2">{error}</p>}
        </div>
    );
}