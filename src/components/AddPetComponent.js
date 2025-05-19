import React, { useState } from 'react';
import PetService from '../services/PetService';
import { useNavigate } from 'react-router-dom';

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
        const pet = { name, petAnimal, breed, size, age, weight, petSex };
        PetService.createPet(pet).then(() => {
            navigate('/pet');
        });
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <div className="container" style={{ paddingTop: '50px' }}>
                <div className="row justify-content-center">
                    <div className="card col-md-6" style={{ border: '1px solid #dee2e6', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <h3 className="text-center" style={{ backgroundColor: '#6c757d', color: 'white', padding: '15px', borderRadius: '8px 8px 0 0' }}>Add Pet</h3>
                        <div className="card-body" style={{ padding: '30px' }}>
                            <form onSubmit={savePet}>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Pet Name:</label>
                                    <input placeholder="Name" name="name" className="form-control"
                                        value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Animal:</label>
                                    <input placeholder="Animal" name="petAnimal" className="form-control"
                                        value={petAnimal} onChange={(e) => setAnimal(e.target.value)} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Breed:</label>
                                    <input placeholder="Breed" name="breed" className="form-control"
                                        value={breed} onChange={(e) => setBreed(e.target.value)} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Size:</label>
                                    <input placeholder="Size" name="size" className="form-control"
                                        value={size} onChange={(e) => setSize(e.target.value)} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Age:</label>
                                    <input placeholder="Age" name="age" className="form-control"
                                        value={age} onChange={(e) => setAge(e.target.value)} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Weight:</label>
                                    <input placeholder="Weight" name="weight" className="form-control"
                                        value={weight} onChange={(e) => setWeight(e.target.value)} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Sex:</label>
                                    <input placeholder="Sex" name="petSex" className="form-control"
                                        value={petSex} onChange={(e) => setSex(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPetComponent;