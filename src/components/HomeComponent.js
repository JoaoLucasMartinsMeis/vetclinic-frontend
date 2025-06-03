import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeComponent = () => {
    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="text-center p-5 rounded shadow" style={{ backgroundColor: '#ffffff', maxWidth: '400px' }}>
                <h2 className="mb-4 text-primary">VetClinic</h2>
                <p className="mb-4 text-muted">Bem-vindo ao sistema de gerenciamento.</p>
                <div className="d-grid gap-3">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => navigate('/pets')}
                    >
                        Gerenciar Pets
                    </button>
                    <button
                        className="btn btn-outline-info"
                        onClick={() => navigate('/pet-owners')}
                    >
                        Gerenciar Donos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomeComponent;
