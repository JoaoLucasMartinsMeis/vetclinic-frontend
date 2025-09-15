import React, { useEffect, useState } from 'react';
import PetOwnerService from '../../services/petOwner/PetOwnerService';
import { useNavigate } from 'react-router-dom';
import { translate } from '../../utils/translations';
import { formatCPF, formatPhone } from '../../utils/validators';
import Header from '../layout/Header';
import SearchSelect from '../layout/SearchSelect';

const PetOwnerListComponent = () => {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = () => {
        setLoading(true);
        PetOwnerService.getAllPetOwners()
            .then(res => {
                setOwners(res.data);
                setErrorMessage('');
            })
            .catch(error => {
                console.error('Error fetching owners:', error);
                setErrorMessage(translate('Failed to load pet owners'));
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = (id, ownerName) => {
        if (window.confirm(`${translate('Are you sure you want to delete this pet owner?')} (${ownerName})`)) {
            PetOwnerService.deletePetOwner(id)
                .then(() => {
                    setSuccessMessage(translate('Pet owner deleted successfully.'));
                    setErrorMessage('');
                    fetchOwners();
                    setTimeout(() => setSuccessMessage(''), 3000);
                })
                .catch(error => {
                    console.error('Error deleting owner:', error);
                    setErrorMessage(translate('Failed to delete pet owner.'));
                    setSuccessMessage('');
                    setTimeout(() => setErrorMessage(''), 3000);
                });
        }
    };

    const filteredOwners = owners.filter(owner =>
        owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.cpf.includes(searchTerm.replace(/\D/g, '')) ||
        owner.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Header title="Pet Owners" />
            
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
                        <div className="row g-3 align-items-center">
                            <div className="col-md-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por nome, CPF ou e-mail..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div className="col-md-4">
                                <button 
                                    className="btn btn-primary w-100" 
                                    onClick={() => navigate('/add-pet-owner')}
                                    style={addButtonStyle}
                                >
                                    + {translate('Add Pet Owner')}
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
                                        <th>{translate('Name')}</th>
                                        <th>{translate('CPF')}</th>
                                        <th>{translate('Email')}</th>
                                        <th>{translate('Phone')}</th>
                                        <th>{translate('Address')}</th>
                                        <th>{translate('Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOwners.map(owner => (
                                        <tr key={owner.id} style={tableRowStyle}>
                                            <td style={tableCellStyle}>
                                                <strong>{owner.name}</strong>
                                            </td>
                                            <td style={tableCellStyle}>{formatCPF(owner.cpf)}</td>
                                            <td style={tableCellStyle}>{owner.email}</td>
                                            <td style={tableCellStyle}>{formatPhone(owner.phone)}</td>
                                            <td style={tableCellStyle}>{owner.address}</td>
                                            <td style={tableCellStyle}>
                                                <div className="btn-group" role="group">
                                                    <button
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() => navigate(`/update-pet-owner/${owner.id}`)}
                                                        style={actionButtonStyle}
                                                        title={translate('Edit')}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm me-2"
                                                        onClick={() => handleDelete(owner.id, owner.name)}
                                                        style={actionButtonStyle}
                                                        title={translate('Delete')}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-info btn-sm"
                                                        onClick={() => navigate(`/owner-pets/${owner.id}`)}
                                                        style={actionButtonStyle}
                                                        title="Ver Pets"
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredOwners.length === 0 && (
                                <div className="text-center py-4">
                                    <i className="bi bi-search" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                                    <p className="text-muted mt-2">{translate('No owners found')}</p>
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

export default PetOwnerListComponent;