import React from 'react';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';

export default function AdminMain() {
    return (
        <div>
            <Header role="admin" />
            <div className="container mt-3">
                <h2>Админ панель</h2>

                <div className="mt-4 d-flex flex-column gap-3 px-5">
                    <Link to="/admin/user" className="btn btn-dark btn-lg">
                        Пользователи
                    </Link>
                    <Link to="/admin/policy" className="btn btn-dark btn-lg">
                        Полисы
                    </Link>
                    <Link to="/admin/assessment" className="btn btn-dark btn-lg">
                        Заявки
                    </Link>
                </div>
            </div>
        </div>
    );
}
