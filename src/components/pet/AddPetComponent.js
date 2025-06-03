import React, { useState } from 'react';
import PetService from '../../services/pet/PetService';
import { useNavigate } from 'react-router-dom';
import petAnimalOptions from '../../enums/PetAnimalOptions';
import petSexOptions from '../../enums/PetSexOptions';
import petSizeOptions from '../../enums/PetSizeOptions';

const AddPetComponent = () => {
    const [name, setName] = useState('');
    const [petAnimal, setAnimal] = useState('');
    const [breed, setBreed] = useState('');
    const [size, setSize] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [petSex, setSex] = useState('');

    const navigate = useNavigate();

    const savePet = (e) => {
        e.preventDefault();

        if (isNaN(age) || isNaN(weight)) {
            alert('Please enter numeric values for age (years) and weight (kg).');
            return;
        }

        const pet = {
            name,
            animal: petAnimal,
            breed,
            size: size,
            age: Number(age),
            weight: Number(weight),
            sex: petSex
        };

        PetService.createPet(pet).then(() => {
            navigate('/pets');
        });
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <div className="container" style={{ paddingTop: '50px' }}>
                <div className="row justify-content-center">
                    <div className="card col-md-6" style={{ border: '1px solid #dee2e6', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <h3 className="text-center" style={{ backgroundColor: '#6c757d', color: 'white', padding: '15px', borderRadius: '8px 8px 0 0' }}>
                            Add Pet
                        </h3>
                        <div className="card-body" style={{ padding: '30px' }}>
                            <form onSubmit={savePet}>
                                <div className="form-group mb-3">
                                    <label>Pet Name:</label>
                                    <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                                </div>

                                <div className="form-group mb-3">
                                    <label>Animal:</label>
                                    <select className="form-control" value={petAnimal} onChange={(e) => setAnimal(e.target.value)}>
                                        <option value="">Select Animal</option>
                                        {Object.entries(petAnimalOptions).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label>Breed:</label>
                                    <input className="form-control" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Breed" />
                                </div>

                                <div className="form-group mb-3">
                                    <label>Pet Size:</label>
                                    <select className="form-control" value={size} onChange={e => setSize(e.target.value)}>
                                        <option value="">Select Size</option>
                                        {Object.entries(petSizeOptions).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label>Age:</label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            placeholder="e.g. 3"
                                            min="0"
                                        />
                                        <span className="input-group-text">years</span>
                                    </div>
                                </div>

                                <div className="form-group mb-3">
                                    <label>Weight:</label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="form-control"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            placeholder="e.g. 12.5"
                                            min="0"
                                        />
                                        <span className="input-group-text">kg</span>
                                    </div>
                                </div>


                                <div className="form-group mb-4">
                                    <label>Sex:</label>
                                    <select className="form-control" value={petSex} onChange={(e) => setSex(e.target.value)}>
                                        <option value="">Select Sex</option>
                                        {Object.entries(petSexOptions).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <button type="submit" className="btn btn-primary w-100">Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPetComponent;

