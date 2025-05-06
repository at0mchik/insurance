import React from 'react';
import {Link} from 'react-router-dom';

export default function Header({role}) {
    const renderLinks = () => {
        switch (role) {
            case 'admin':
                return (
                    <>
                        <Link to="/admin/user" className="nav-link">Пользователи</Link>
                        <Link to="/admin/policy" className="nav-link">Полисы</Link>
                        <Link to="/admin/assessment" className="nav-link">Заявки</Link>
                        <Link to="/admin/account" className="nav-link">Аккаунт</Link>
                    </>
                );
            case 'client':
                return (
                    <>
                        <Link to="/client/policies" className="nav-link">Полисы</Link>
                        <Link to="/client/assessments" className="nav-link">Заявки на оценку</Link>
                        <Link to="/client/account" className="nav-link">Аккаунт</Link>
                    </>
                );
            case 'assessor':
                return (
                    <>
                        <Link to="/assessor/assigned" className="nav-link">Ваши заявки</Link>
                        <Link to="/assessor/pending" className="nav-link">Пустые заявки</Link>
                        <Link to="/assessor/account" className="nav-link">Аккаунт</Link>
                    </>
                );
            default:
                return (
                    <>
                        <Link to="/login" className="nav-link">Войти</Link>
                        <Link to="/register" className="nav-link">Зарегистрироваться</Link>
                    </>
                );
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <a className="navbar-brand" href="/">EIns</a>
                <div className="collapse navbar-collapse">
                    <div className="navbar-nav">
                        {renderLinks()}
                    </div>
                </div>
            </div>
        </nav>
    );
}
