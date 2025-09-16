import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PetService from './../../services/pet/PetService';
import PetOwnerService from '../../services/petOwner/PetOwnerService';
import petAnimalOptions from '../../enums/PetAnimalOptions';
import petSexOptions from '../../enums/PetSexOptions';
import petSizeOptions from '../../enums/PetSizeOptions';
import { translate } from '../../utils/translations';
import Header from '../layout/Header';
import SearchSelect from '../layout/SearchSelect';

const UpdatePetComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        animal: '',
        breed: '',
        size: '',
        age: '',
        weight: '',
        sex: ''
    });

    const [selectedOwners, setSelectedOwners] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                const petResponse = await PetService.findPetById(id);
                const pet = petResponse.data;
                
                setFormData({
                    name: pet.name || '',
                    animal: pet.animal || '',
                    breed: pet.breed || '',
                    size: pet.size || '',
                    age: pet.age || '',
                    weight: pet.weight || '',
                    sex: pet.sex || ''
                });

                // Busca os donos associados a este pet
                const ownersResponse = await PetService.getPetOwnersByPet(id);
                setSelectedOwners(ownersResponse.data || []);
            } catch (error) {
                console.error('Error fetching pet data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPetData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleOwnerSelect = (owner) => {
        setSelectedOwners(prev => [...prev, owner]);
    };

    const handleOwnerRemove = (ownerId) => {
        setSelectedOwners(prev => prev.filter(owner => owner.id !== ownerId));
    };

    const searchOwners = async (term) => {
        return await PetOwnerService.searchOwnersByName(term);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = translate('Name is required');
        if (!formData.animal) newErrors.animal = translate('Animal selection is required');
        if (!formData.size) newErrors.size = translate('Size selection is required');
        if (!formData.sex) newErrors.sex = translate('Sex selection is required');
        if (!formData.age || isNaN(formData.age) || formData.age < 0) {
            newErrors.age = translate('Please enter a valid age');
        }
        if (!formData.weight || isNaN(formData.weight) || formData.weight <= 0) {
            newErrors.weight = translate('Please enter a valid weight');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updatePet = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const pet = {
            ...formData,
            age: Number(formData.age),
            weight: Number(formData.weight)
        };

        try {
            // Atualiza os dados básicos do pet
            await PetService.updatePet(pet, id);

            // Atualiza as associações com donos
            // Primeiro obtém os donos atuais
            const currentOwnersResponse = await PetService.getPetOwnersByPet(id);
            const currentOwners = currentOwnersResponse.data || [];

            // Encontra donos para adicionar e remover
            const ownersToAdd = selectedOwners.filter(newOwner =>
                !currentOwners.some(current => current.id === newOwner.id)
            );
            
            const ownersToRemove = currentOwners.filter(currentOwner =>
                !selectedOwners.some(newOwner => newOwner.id === currentOwner.id)
            );

            // Executa as operações de associação
            const addPromises = ownersToAdd.map(owner =>
                PetService.addPetToPetOwner(id, owner.id)
            );

            const removePromises = ownersToRemove.map(owner =>
                PetService.removeAssociation(id, owner.id)
            );

            await Promise.all([...addPromises, ...removePromises]);
            
            navigate('/pets');
        } catch (error) {
            console.error('Error updating pet:', error);
            alert(translate('Failed to update pet'));
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
            <Header title="Update Pet" />

            <div className="container">
                <div className="row justify-content-center">
                    <div className="card col-md-10" style={cardStyle}>
                        <div className="card-body" style={cardBodyStyle}>
                            <form onSubmit={updatePet}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={labelStyle}>{translate('Pet Name')}:</label>
                                            <input
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                        </div>

                                        <div className="form-group mb-3">
                                            <label style={labelStyle}>{translate('Animal')}:</label>
                                            <select
                                                className={`form-control ${errors.animal ? 'is-invalid' : ''}`}
                                                name="animal"
                                                value={formData.animal}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">{translate('Select Animal')}</option>
                                                {Object.entries(petAnimalOptions).map(([value, label]) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </select>
                                            {errors.animal && <div className="invalid-feedback">{errors.animal}</div>}
                                        </div>

                                        <div className="form-group mb-3">
                                            <label style={labelStyle}>{translate('Breed')}:</label>
                                            <input
                                                className="form-control"
                                                name="breed"
                                                value={formData.breed}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="form-group mb-3">
                                            <label style={labelStyle}>{translate('Pet Size')}:</label>
                                            <select
                                                className={`form-control ${errors.size ? 'is-invalid' : ''}`}
                                                name="size"
                                                value={formData.size}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">{translate('Select Size')}</option>
                                                {Object.entries(petSizeOptions).map(([value, label]) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </select>
                                            {errors.size && <div className="invalid-feedback">{errors.size}</div>}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={labelStyle}>{translate('Age')}:</label>
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                                                    name="age"
                                                    value={formData.age}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                />
                                                <span className="input-group-text">{translate('years')}</span>
                                            </div>
                                            {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                                        </div>

                                        <div className="form-group mb-3">
                                            <label style={labelStyle}>{translate('Weight')}:</label>
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
                                                    name="weight"
                                                    value={formData.weight}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                />
                                                <span className="input-group-text">kg</span>
                                            </div>
                                            {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
                                        </div>

                                        <div className="form-group mb-4">
                                            <label style={labelStyle}>{translate('Sex')}:</label>
                                            <select
                                                className={`form-control ${errors.sex ? 'is-invalid' : ''}`}
                                                name="sex"
                                                value={formData.sex}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">{translate('Select Sex')}</option>
                                                {Object.entries(petSexOptions).map(([value, label]) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </select>
                                            {errors.sex && <div className="invalid-feedback">{errors.sex}</div>}
                                        </div>

                                        {/* Campo de busca por donos */}
                                        <SearchSelect
                                            label="Donos do Pet:"
                                            placeholder="Buscar donos por nome..."
                                            searchFunction={searchOwners}
                                            onSelect={handleOwnerSelect}
                                            selectedItems={selectedOwners}
                                            onRemove={handleOwnerRemove}
                                        />
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-success" style={submitButtonStyle}>
                                        {translate('Save Changes')}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/pets')}
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

export default UpdatePetComponent;