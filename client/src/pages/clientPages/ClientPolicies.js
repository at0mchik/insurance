import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Header from "../../components/Header";
import RequestAssessmentButton from "../../components/RequestAssessmentButton";


export default function ClientPolicies() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setPolicies(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPolicies();
    }, []);

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
                        {policies.length === 0 ? (
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
                                                            <h6>Детали автомобиля:</h6>
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
                                                            <h6>Детали апартаментов:</h6>
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
                                                            <h6>Детали здоровья:</h6>
                                                            <p><strong>ФИО:</strong> {policy.details.full_name}</p>
                                                            <p><strong>Дата
                                                                рождения:</strong> {policy.details.birth_date}</p>
                                                            <p><strong>Группа
                                                                крови:</strong> {policy.details.blood_type}</p>
                                                            <p><strong>Существующие
                                                                заболевания:</strong> {policy.details.pre_existing_conditions.join(', ')}
                                                            </p>
                                                            <p><strong>Сумма
                                                                страхования:</strong> {policy.details.insured_sum} ₽</p>
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
                                                            <p><strong>Общая оценочная стоимость
                                                                (USD):</strong> {policy.details.total_estimated_value_usd} USD
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <RequestAssessmentButton policyId={policy.id} />
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
