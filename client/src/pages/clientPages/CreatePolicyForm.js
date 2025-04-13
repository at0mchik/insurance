import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from "../../components/Header";

export default function CreatePolicyPage() {
    const [type, setType] = useState('car'); // по умолчанию тип - автомобиль
    const [formData, setFormData] = useState({
        start_date: '',
        end_date: '',
        premium: '',
        pre_existing_conditions: [],
        crypto_assets: [],

    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value, type} = e.target;
        let parsedValue = value;
        if (type === 'number') {
            parsedValue = value !== '' ? parseFloat(value) : ''; // Преобразуем строку в число, если введено не пустое значение
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: parsedValue,
        }));
    };

    // Добавляем новое заболевание для здоровья
    const addCondition = () => {
        setFormData((prevData) => ({
            ...prevData,
            pre_existing_conditions: [...prevData.pre_existing_conditions, ''],
        }));
    };

    // Обновляем заболевание
    const handleConditionChange = (index, value) => {
        const updatedConditions = [...formData.pre_existing_conditions];
        updatedConditions[index] = value;
        setFormData((prevData) => ({
            ...prevData,
            pre_existing_conditions: updatedConditions,
        }));
    };

    // Удаляем заболевание
    const removeCondition = (index) => {
        const updatedConditions = formData.pre_existing_conditions.filter((_, i) => i !== index);
        setFormData((prevData) => ({
            ...prevData,
            pre_existing_conditions: updatedConditions,
        }));
    };

    // Добавляем новый актив для криптовалюты
    const addCryptoAsset = () => {
        setFormData((prevData) => ({
            ...prevData,
            crypto_assets: [...prevData.crypto_assets, {currency: '', amount: ''}],
        }));
    };

    // Обновляем актив криптовалюты
    const handleCryptoChange = (index, field, value) => {
        const updatedAssets = [...formData.crypto_assets];
        if (field === "amount"){
            updatedAssets[index][field] = parseFloat(value);
        }else{
            updatedAssets[index][field] = value;
        }

        setFormData((prevData) => ({
            ...prevData,
            crypto_assets: updatedAssets,
        }));
    }

    // Удаляем актив криптовалюты
    const removeCryptoAsset = (index) => {
        const updatedAssets = formData.crypto_assets.filter((_, i) => i !== index);
        setFormData((prevData) => ({
            ...prevData,
            crypto_assets: updatedAssets,
        }));
    };

    // Справочник для отображения полей в зависимости от типа полиса
    const renderFormFields = () => {
        switch (type) {
            case 'car':
                return (
                    <>
                        {/* Поля для автомобиля */}
                        <div className="mb-3">
                            <label className="form-label">Марка</label>
                            <input
                                type="text"
                                className="form-control"
                                name="make"
                                value={formData.make || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Модель</label>
                            <input
                                type="text"
                                className="form-control"
                                name="model"
                                value={formData.model || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Год</label>
                            <input
                                type="number"
                                className="form-control"
                                name="year"
                                value={formData.year || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">VIN</label>
                            <input
                                type="text"
                                className="form-control"
                                name="vin"
                                value={formData.vin || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Мощность двигателя (л.с.)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="engine_power_hp"
                                value={formData.engine_power_hp || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Пробег (км)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="mileage_km"
                                value={formData.mileage_km || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                );
            case 'apartment':
                return (
                    <>
                        {/* Поля для апартаментов */}
                        <div className="mb-3">
                            <label className="form-label">Адрес</label>
                            <input
                                type="text"
                                className="form-control"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Площадь (м²)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="area_sqm"
                                value={formData.area_sqm || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Этаж</label>
                            <input
                                type="number"
                                className="form-control"
                                name="level"
                                value={formData.level || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Тип здания</label>
                            <input
                                type="text"
                                className="form-control"
                                name="building_type"
                                value={formData.building_type || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Год постройки</label>
                            <input
                                type="number"
                                className="form-control"
                                name="year_built"
                                value={formData.year_built || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                );
            case 'health':
                return (
                    <>
                        {/* Поля для здоровья */}
                        <div className="mb-3">
                            <label className="form-label">ФИО</label>
                            <input
                                type="text"
                                className="form-control"
                                name="full_name"
                                value={formData.full_name || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Дата рождения</label>
                            <input
                                type="date"
                                className="form-control"
                                name="birth_date"
                                value={formData.birth_date || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Группа крови</label>
                            <input
                                type="text"
                                className="form-control"
                                name="blood_type"
                                value={formData.blood_type || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Существующие заболевания</label>
                            {formData.pre_existing_conditions.map((condition, index) => (
                                <div key={index} className="d-flex mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={condition}
                                        onChange={(e) => handleConditionChange(index, e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-danger ms-2"
                                        onClick={() => removeCondition(index)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            ))}
                            <button type="button" className="btn btn-secondary" onClick={addCondition}>
                                Добавить заболевание
                            </button>
                        </div>
                    </>
                );
            case 'crypto':
                return (
                    <>
                        {/* Поля для криптовалюты */}
                        <div className="mb-3">
                            <label className="form-label">Тип кошелька</label>
                            <input
                                type="text"
                                className="form-control"
                                name="wallet_type"
                                value={formData.wallet_type|| ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Бренд кошелька</label>
                            <input
                                type="text"
                                className="form-control"
                                name="wallet_brand"
                                value={formData.wallet_brand || ''}
                                onChange={handleChange}
                            />
                        </div>
                        {formData.crypto_assets.map((asset, index) => (
                            <div key={index} className="d-flex mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Валюта"
                                    value={asset.currency}
                                    onChange={(e) => handleCryptoChange(index, 'currency', e.target.value)}
                                />
                                <input
                                    type="number"
                                    className="form-control ms-2"
                                    placeholder="Сумма"
                                    value={asset.amount}
                                    onChange={(e) => handleCryptoChange(index, 'amount', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-danger ms-2"
                                    onClick={() => removeCryptoAsset(index)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                        <button type="button" className="btn btn-secondary" onClick={addCryptoAsset}>
                            Добавить криптоактив
                        </button>
                        <div className="mb-3">
                            <label className="form-label">Общая оценочная стоимость (USD)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="total_estimated_value_usd"
                                value={formData.total_estimated_value_usd || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const handleData = () =>{
        let detailsToSend = {}

        switch (type) {
            case 'car':
                return detailsToSend = {
                    make: formData.make,
                    model: formData.model,
                    year: formData.year,
                    vin: formData.vin,
                    engine_power_hp: formData.engine_power_hp,
                    mileage_km: formData.mileage_km,
                }
            case 'apartment':
                return detailsToSend = {
                    address: formData.address,
                    area_sqm: formData.area_sqm,
                    level: formData.level,
                    building_type: formData.building_type,
                    year_built: formData.year_built,
                }
            case 'health':
                return detailsToSend = {
                    full_name: formData.full_name,
                    birth_date: formData.birth_date,
                    blood_type: formData.blood_type,
                    pre_existing_conditions: formData.pre_existing_conditions,
                    insured_sum: formData.insured_sum,
                }
            case 'crypto':
                console.log("data: " + formData.crypto_assets)
                return detailsToSend = {
                    wallet_type: formData.wallet_type,
                    wallet_brand: formData.wallet_brand,
                    crypto_assets: formData.crypto_assets,
                    total_estimated_value_usd: formData.total_estimated_value_usd,
                }
            default:
                return null;

        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (type === 'crypto') {
            const hasValidAssets = formData.crypto_assets.some(asset => asset.currency && parseFloat(asset.amount) > 0);

            if (!hasValidAssets) {
                alert("Пожалуйста, добавьте хотя бы один криптовалютный актив с ненулевой суммой!");
                return;
            }

            if (!formData.total_estimated_value_usd) {
                alert("Пожалуйста, укажите общую оценочную стоимость криптовалюты.");
                return;
            }
        }

        if (type === 'health') {
            const hasValidConditions = formData.pre_existing_conditions.some(condition => condition.trim() !== '' && condition.toLowerCase() !== 'здоров');

            if (!hasValidConditions && !formData.pre_existing_conditions.some(condition => condition.toLowerCase() === 'здоров')) {
                alert("Пожалуйста, добавьте хотя бы одно заболевание, или укажите 'здоров', если заболеваний нет.");
                return;
            }
        }

        let detailsToSend = handleData()

        const dataToSend = {
            type,
            start_date: formData.start_date,
            end_date: formData.end_date,
            premium: formData.premium,
            details: {
                ...detailsToSend,
            },
        };


        console.log("fetching: " + JSON.stringify(dataToSend))


        fetch("http://localhost:8000/api/policy/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            credentials: 'include',
            body: JSON.stringify(dataToSend),
        })
            .then((res) => res.json())
            .then((data) => {
                alert("Полис успешно создан");
                navigate('/client/policies');
            })
            .catch((err) => {
                console.error(err);
                alert("Ошибка создания полиса");
            });
    };


    return (
        <div>
            <Header role="client"/>
            <div className="container mt-5">
                <h2>Создание нового полиса</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Тип полиса</label>
                        <select
                            className="form-select"
                            name="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="car">Машина</option>
                            <option value="apartment">Апартаменты</option>
                            <option value="health">Здоровье</option>
                            <option value="crypto">Криптовалютный кошелек</option>
                        </select>
                    </div>

                    {/* Общие поля */}
                    <div className="mb-3">
                        <label className="form-label">Дата начала</label>
                        <input
                            type="date"
                            className="form-control"
                            name="start_date"
                            value={formData.start_date || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Дата окончания</label>
                        <input
                            type="date"
                            className="form-control"
                            name="end_date"
                            value={formData.end_date || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Премия</label>
                        <input
                            type="number"
                            className="form-control"
                            name="premium"
                            value={formData.premium || ''}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Поля для выбранного типа полиса */}
                    {renderFormFields()}

                    <button type="submit" className="btn btn-primary">Отправить</button>
                </form>
            </div>
        </div>
    );
}