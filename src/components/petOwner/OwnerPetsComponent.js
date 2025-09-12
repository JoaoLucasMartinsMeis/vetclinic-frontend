import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PetOwnerService from '../../services/petOwner/PetOwnerService';
import PetService from '../../services/pet/PetService';
import { translate } from '../../utils/translations';
import Header from '../layout/Header';

const OwnerPetsComponent = () => {
    const { ownerId } = useParams();
    const navigate = useNavigate();
    
    const [owner, setOwner] = useState(null);
    const [ownerPets, setOwnerPets] = useState([]);
    const [availablePets, setAvailablePets] = useState([]);
    const [selectedPet, setSelectedPet] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOwnerData();
        fetchAvailablePets();
    }, [ownerId]);

    const fetchOwnerData = () => {
        PetOwnerService.getPetOwnerById(ownerId)
            .then(res => {
                setOwner(res.data);
                return PetOwnerService.getPetsByOwner(ownerId);
            })
            .then(res => {
                setOwnerPets(res.data);
            })
            .catch(error => {
                console.error('Error fetching owner data:', error);
            })
            .finally(() => setLoading(false));
    };

    const fetchAvailablePets = () => {
        PetService.getPets()
            .then(res => {
                setAvailablePets(res.data);
            })
            .catch(error => {
                console.error('Error fetching available pets:', error);
            });
    };

    const handleAddPet = () => {
        if (!selectedPet) return;

        PetOwnerService.addPetToOwner(ownerId, selectedPet)
            .then(() => {
                fetchOwnerData();
                setSelectedPet('');
            })
            .catch(error => {
                console.error('Error adding pet to owner:', error);
                alert('Erro ao adicionar pet ao dono');
            });
    };

    const handleRemovePet = (petId) => {
        if (window.confirm('Tem certeza que deseja remover este pet do dono?')) {
            PetOwnerService.removePetFromOwner(ownerId, petId)
                .then(() => {
                    fetchOwnerData();
                })
                .catch(error => {
                    console.error('Error removing pet from owner:', error);
                    alert('Erro ao remover pet do dono');
                });
        }
    };

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
        <div style={containerStyle}>
            <Header title="Pets do Dono" />
            
            <div className="container">
                {owner && (
                    <div className="card mb-4" style={ownerCardStyle}>
                        <div className="card-body">
                            <h4>Dono: {owner.name}</h4>
                            <p>CPF: {owner.cpf}</p>
                            <p>Email: {owner.email}</p>
                        </div>
                    </div>
                )}

                <div className="row">
                    <div className="col-md-6">
                        <div className="card" style={cardStyle}>
                            <div className="card-header">
                                <h5>Pets do Dono</h5>
                            </div>
                            <div className="card-body">
                                {ownerPets.length === 0 ? (
                                    <p className="text-muted">Nenhum pet associado a este dono.</p>
                                ) : (
                                    <div className="list-group">
                                        {ownerPets.map(pet => (
                                            <div key={pet.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>{pet.name}</strong> - {pet.breed}
                                                </div>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleRemovePet(pet.id)}
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card" style={cardStyle}>
                            <div className="card-header">
                                <h5>Adicionar Pet</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Selecionar Pet:</label>
                                    <select
                                        className="form-control"
                                        value={selectedPet}
                                        onChange={(e) => setSelectedPet(e.target.value)}
                                    >
                                        <option value="">Selecione um pet</option>
                                        {availablePets
                                            .filter(pet => !ownerPets.some(op => op.id === pet.id))
                                            .map(pet => (
                                                <option key={pet.id} value={pet.id}>
                                                    {pet.name} - {pet.breed}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleAddPet}
                                    disabled={!selectedPet}
                                >
                                    Adicionar Pet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-3">
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/pet-owners')}
                    >
                        Voltar para Lista de Donos
                    </button>
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

const cardStyle = {
    border: 'none',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white'
};

const ownerCardStyle = {
    ...cardStyle,
    backgroundColor: '#e3f2fd'
};

export default OwnerPetsComponent;