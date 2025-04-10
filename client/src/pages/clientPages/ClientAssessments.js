import React from 'react';
import Header from '../../components/Header';

export default function ClientAssessments() {
    return (
        <div>
            <Header role="client" />
            <div className="container mt-3">
                <h2>Ваши заявки</h2>
                {/* Здесь список полисов */}
            </div>
        </div>
    );
}
