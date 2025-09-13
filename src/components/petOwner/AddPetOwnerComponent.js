import React, { useState } from 'react';
import PetOwnerService from '../../services/petOwner/PetOwnerService';
import PetService from '../../services/pet/PetService';
import { useNavigate } from 'react-router-dom';
import { translate } from '../../utils/translations';
import { validateCPF, validateEmail, formatCPF, formatPhone } from '../../utils/validators';
import Header from '../layout/Header';
import SearchSelect from '../common/SearchSelect';

const AddPetOwnerComponent = () => {
    const [formData, setFormData] = useState({
        name: '',
        cpf: '',
        email: '',
        phone: '',
        address: ''
    });

    const [selectedPets, setSelectedPets] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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

    const searchPets = async (term) => {
        return await PetService.searchPetsByName(term);
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = translate('Name is required');
        if (!formData.cpf.trim()) newErrors.cpf = translate('CPF is required');
        else if (!validateCPF(formData.cpf.replace(/\D/g, ''))) newErrors.cpf = translate('Invalid CPF format');
        if (!formData.email.trim()) newErrors.email = translate('Email is required');
        else if (!validateEmail(formData.email)) newErrors.email = translate('Invalid email format');
        if (!formData.phone.trim()) newErrors.phone = translate('Phone is required');
        if (!formData.address.trim()) newErrors.address = translate('Address is required');
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const savePetOwner = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const owner = {
            ...formData,
            cpf: formData.cpf.replace(/\D/g, ''),
            phone: formData.phone.replace(/\D/g, '')
        };

        try {
            // Primeiro cria o dono
            const response = await PetOwnerService.createPetOwner(owner);
            const savedOwner = response.data;

            // Depois associa os pets selecionados
            if (selectedPets.length > 0) {
                const associationPromises = selectedPets.map(pet =>
                    PetOwnerService.addPetToOwner(savedOwner.id, pet.id)
                );
                await Promise.all(associationPromises);
            }

            navigate('/pet-owners');
        } catch (error) {
            console.error('Error saving pet owner:', error);
            alert(translate('Failed to save pet owner'));
        }
    };

    return (
        <div style={containerStyle}>
            <Header title="Add Pet Owner" />
            
            <div className="container">
                <div className="row justify-content-center">
                    <div className="card col-md-10" style={cardStyle}>
                        <div className="card-body" style={cardBodyStyle}>
                            <form onSubmit={savePetOwner}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={labelStyle}>{translate('Name')}: *</label>
                                            <input 
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder={translate('Name')}
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
                                                placeholder="000.000.000-00"
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
                                                placeholder="exemplo@email.com"
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
                                                placeholder="(00) 00000-0000"
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
                                                placeholder={translate('Address')}
                                                maxLength="200"
                                            />
                                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                        </div>

                                        {/* Campo de busca por pets */}
                                        <SearchSelect
                                            label="Pets do Dono:"
                                            placeholder="Buscar pets por nome..."
                                            searchFunction={searchPets}
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
                                    <button type="submit" className="btn btn-primary" style={submitButtonStyle}>
                                        {translate('Save')}
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
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontWeight: 'bold'
};

export default AddPetOwnerComponent;