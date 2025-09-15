import React, { useEffect, useState } from 'react';
import PetOwnerService from '../../services/petOwner/PetOwnerService';
import PetService from '../../services/pet/PetService';
import { useNavigate, useParams } from 'react-router-dom';
import { translate } from '../../utils/translations';
import { validateCPF, validateEmail, formatCPF, formatPhone } from '../../utils/validators';
import Header from '../layout/Header';
import SearchSelect from '../layout/SearchSelect';

const UpdatePetOwnerComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        cpf: '',
        email: '',
        phone: '',
        address: ''
    });

    const [selectedPets, setSelectedPets] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOwnerData = async () => {
            try {
                const ownerResponse = await PetOwnerService.getPetOwnerById(id);
                const owner = ownerResponse.data;
                
                setFormData({
                    name: owner.name || '',
                    cpf: formatCPF(owner.cpf || ''),
                    email: owner.email || '',
                    phone: formatPhone(owner.phone || ''),
                    address: owner.address || ''
                });

                // Busca os pets associados a este dono
                const petsResponse = await PetOwnerService.getPetsByOwner(id);
                setSelectedPets(petsResponse.data || []);
            } catch (error) {
                console.error('Error fetching owner data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOwnerData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cpf') {
            formattedValue = formatCPF(value);
        } else if (name === 'phone') {
            formattedValue = formatPhone(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePetSelect = (pet) => {
        setSelectedPets(prev => [...prev, pet]);
    };

    const handlePetRemove = (petId) => {
        setSelectedPets(prev => prev.filter(pet => pet.id !== petId));
    };

    const findPets = async (term) => {
        return await PetService.findPetsByName(term);
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = translate('Name is required');
        if (!formData.cpf.trim()) newErrors.cpf = translate('CPF is required');
        if (!formData.email.trim()) newErrors.email = translate('Email is required');
        else if (!validateEmail(formData.email)) newErrors.email = translate('Invalid email format');
        if (!formData.phone.trim()) newErrors.phone = translate('Phone is required');
        if (!formData.address.trim()) newErrors.address = translate('Address is required');
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updatePetOwner = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const owner = {
            ...formData,
            cpf: formData.cpf.replace(/\D/g, ''),
            phone: formData.phone.replace(/\D/g, '')
        };

        try {
            // Atualiza os dados básicos do dono
            await PetOwnerService.updatePetOwner(owner, id);

            // Atualiza as associações com pets
            const currentPetsResponse = await PetOwnerService.getPetsByOwner(id);
            const currentPets = currentPetsResponse.data || [];

            // Encontra pets para adicionar e remover
            const petsToAdd = selectedPets.filter(newPet =>
                !currentPets.some(current => current.id === newPet.id)
            );
            
            const petsToRemove = currentPets.filter(currentPet =>
                !selectedPets.some(newPet => newPet.id === currentPet.id)
            );

            // Executa as operações de associação
            const addPromises = petsToAdd.map(pet =>
                PetOwnerService.addPetToOwner(id, pet.id)
            );

            const removePromises = petsToRemove.map(pet =>
                PetOwnerService.removePetFromOwner(id, pet.id)
            );

            await Promise.all([...addPromises, ...removePromises]);
            
            navigate('/pet-owners');
        } catch (error) {
            console.error('Error updating owner:', error);
            alert(translate('Failed to update pet owner'));
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
            <Header title="Update Pet Owner" />
            
            <div className="container">
                <div className="row justify-content-center">
                    <div className="card col-md-10" style={cardStyle}>
                        <div className="card-body" style={cardBodyStyle}>
                            <form onSubmit={updatePetOwner}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={labelStyle}>{translate('Name')}: *</label>
                                            <input 
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                maxLength="100"
                                            />
                                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                        </div>

                                        <div className="form-group mb-3">
                                            <label style={labelStyle}>{translate('CPF')}: *</label>
                                            <input 
                                                className={`form-control ${errors.cpf ? 'is-invalid' : ''}`}
                                                name="cpf"
                                                value={formData.cpf}
                                                onChange={handleInputChange}
                                                maxLength="14"
                                            />
                                            {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
                                        </div>

                                        <div className="form-group mb-3">
                                            <label style={labelStyle}>{translate('Email')}: *</label>
                                            <input 
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                maxLength="100"
                                            />
                                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={labelStyle}>{translate('Phone')}: *</label>
                                            <input 
                                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                maxLength="15"
                                            />
                                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                        </div>

                                        <div className="form-group mb-4">
                                            <label style={labelStyle}>{translate('Address')}: *</label>
                                            <input 
                                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                maxLength="200"
                                            />
                                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                        </div>

                                        {/* Campo de busca por pets */}
                                        <SearchSelect
                                            label="Pets do Dono:"
                                            placeholder="Buscar pets por nome..."
                                            searchFunction={findPets}
                                            onSelect={handlePetSelect}
                                            selectedItems={selectedPets}
                                            onRemove={handlePetRemove}
                                        />

                                        <div className="form-group mb-3">
                                            <small className="text-muted">* {translate('Required fields')}</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-success" style={submitButtonStyle}>
                                        {translate('Save Changes')}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/pet-owners')}
                                    >
                                        {translate('Cancel')}
                                    </button>
                                </div>
                            </form>
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

const cardStyle = {
    border: 'none',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white'
};

const cardBodyStyle = {
    padding: '30px'
};

const labelStyle = {
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '8px'
};

const submitButtonStyle = {
    backgroundColor: '#27ae60',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontWeight: 'bold'
};

export default UpdatePetOwnerComponent;