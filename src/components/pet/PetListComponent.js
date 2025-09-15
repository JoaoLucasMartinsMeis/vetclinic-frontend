import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PetService from '../../services/pet/PetService';
import petSizeOptions from '../../enums/PetSizeOptions';
import petSexOptions from '../../enums/PetSexOptions';
import { translate } from '../../utils/translations';
import Header from '../layout/Header';
import SearchSelect from '../layout/SearchSelect';

const PetListComponent = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSize, setFilterSize] = useState('');
    const [filterSex, setFilterSex] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = () => {
        setLoading(true);
        setErrorMessage('');

        PetService.getPets()
            .then((res) => {
                setPets(res.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching pets:', error);
                setErrorMessage(error.message || translate('Failed to load pets'));
                setLoading(false);

                // Se for erro de conexão, mostra mensagem mais específica
                if (error.message.includes('Backend não está disponível') ||
                    error.message.includes('não está respondendo')) {
                    setErrorMessage(
                        'Backend não está disponível. ' +
                        'Certifique-se de que o servidor Spring está rodando na porta 8080. ' +
                        'Erro: ' + error.message
                    );
                }
            });
    };

    const handleDelete = (id, petName) => {
        if (window.confirm(`${translate('Are you sure you want to delete this pet?')} (${petName})`)) {
            PetService.deletePet(id)
                .then(() => {
                    setSuccessMessage(translate('Pet deleted successfully.'));
                    setErrorMessage('');
                    fetchPets();
                    setTimeout(() => setSuccessMessage(''), 3000);
                })
                .catch(() => {
                    setErrorMessage(translate('Failed to delete pet.'));
                    setSuccessMessage('');
                    setTimeout(() => setErrorMessage(''), 3000);
                });
        }
    };

    const filteredPets = pets.filter(pet =>
        (pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.animal.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterSize === '' || pet.size === filterSize) &&
        (filterSex === '' || pet.sex === filterSex)
    );

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid" style={containerStyle}>
            <Header title="Pet List" />

            <div className="container">
                {successMessage && (
                    <div className="alert alert-success alert-dismissible fade show">
                        {successMessage}
                        <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                    </div>
                )}
                {errorMessage && (
                    <div className="alert alert-danger alert-dismissible fade show">
                        {errorMessage}
                        <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
                    </div>
                )}

                {/* Filtros */}
                <div className="card mb-4" style={filterCardStyle}>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={translate('Search by name or animal...')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>

                            <div className="col-md-3">
                                <select
                                    className="form-control"
                                    value={filterSize}
                                    onChange={(e) => setFilterSize(e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="">{translate('All Sizes')}</option>
                                    {Object.entries(petSizeOptions).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <select
                                    className="form-control"
                                    value={filterSex}
                                    onChange={(e) => setFilterSex(e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="">{translate('All Sexes')}</option>
                                    {Object.entries(petSexOptions).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-2">
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={() => navigate('/add-pet')}
                                    style={addButtonStyle}
                                >
                                    + {translate('Add Pet')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabela */}
                <div className="card" style={tableCardStyle}>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead style={tableHeaderStyle}>
                                    <tr>
                                        <th>{translate('Pet Name')}</th>
                                        <th>{translate('Animal')}</th>
                                        <th>{translate('Breed')}</th>
                                        <th>{translate('Pet Size')}</th>
                                        <th>{translate('Age')}</th>
                                        <th>{translate('Weight')}</th>
                                        <th>{translate('Sex')}</th>
                                        <th>{translate('Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPets.map((pet) => (
                                        <tr key={pet.id} style={tableRowStyle}>
                                            <td style={tableCellStyle}>{pet.name}</td>
                                            <td style={tableCellStyle}>{pet.animal}</td>
                                            <td style={tableCellStyle}>{pet.breed}</td>
                                            <td style={tableCellStyle}>{petSizeOptions[pet.size]}</td>
                                            <td style={tableCellStyle}>{pet.age} {translate('years')}</td>
                                            <td style={tableCellStyle}>{pet.weight} kg</td>
                                            <td style={tableCellStyle}>{petSexOptions[pet.sex]}</td>
                                            <td style={tableCellStyle}>
                                                <div className="btn-group" role="group">
                                                    <button
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() => navigate(`/update-pet/${pet.id}`)}
                                                        style={actionButtonStyle}
                                                        title={translate('Edit')}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(pet.id, pet.name)}
                                                        style={actionButtonStyle}
                                                        title={translate('Delete')}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredPets.length === 0 && (
                                <div className="text-center py-4">
                                    <i className="bi bi-search" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                                    <p className="text-muted mt-2">{translate('No pets found matching your criteria.')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const containerStyle = {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
};

const filterCardStyle = {
    border: 'none',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white'
};

const tableCardStyle = {
    border: 'none',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white'
};

const inputStyle = {
    borderRadius: '8px',
    border: '1px solid #ddd'
};

const addButtonStyle = {
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold'
};

const tableHeaderStyle = {
    backgroundColor: '#2c3e50',
    color: 'white'
};

const tableRowStyle = {
    borderBottom: '1px solid #eee'
};

const tableCellStyle = {
    padding: '15px',
    verticalAlign: 'middle'
};

const actionButtonStyle = {
    borderRadius: '6px',
    padding: '5px 10px'
};

export default PetListComponent;