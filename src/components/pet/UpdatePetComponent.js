import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PetService from '../../services/pet/PetService';
import petAnimalOptions from '../../enums/PetAnimalOptions';
import petSexOptions from '../../enums/PetSexOptions';
import petSizeOptions from '../../enums/PetSizeOptions';

const UpdatePetComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [animal, setAnimal] = useState('');
    const [breed, setBreed] = useState('');
    const [size, setSize] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [sex, setSex] = useState('');

    useEffect(() => {
        PetService.getPetById(id).then((res) => {
            const pet = res.data;
            setName(pet.name);
            setAnimal(pet.animal);
            setBreed(pet.breed);
            setSize(pet.size);
            setAge(pet.age);
            setWeight(pet.weight);
            setSex(pet.sex);
        });
    }, [id]);

    const updatePet = (e) => {
        e.preventDefault();

        if (isNaN(age) || isNaN(weight)) {
            alert('Please enter numeric values for age (years) and weight (kg).');
            return;
        }

        const pet = {
            name,
            animal,
            breed,
            size,
            age: Number(age),
            weight: Number(weight),
            sex
        };

        PetService.updatePet(pet, id).then(() => {
            navigate('/pets');
        });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="card col-md-6 offset-md-3">
                    <h3 className="text-center">Update Pet</h3>
                    <div className="card-body">
                        <form onSubmit={updatePet}>
                            <div className="form-group mb-3">
                                <label>Pet Name:</label>
                                <input
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>Pet Animal:</label>
                                <select
                                    className="form-control"
                                    value={animal}
                                    onChange={(e) => setAnimal(e.target.value)}
                                >
                                    <option value="">Select Animal</option>
                                    {Object.entries(petAnimalOptions).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group mb-3">
                                <label>Pet Breed:</label>
                                <input
                                    className="form-control"
                                    value={breed}
                                    onChange={(e) => setBreed(e.target.value)}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>Pet Size:</label>
                                <select
                                    className="form-control"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                >
                                    <option value="">Select Size</option>
                                    {Object.entries(petSizeOptions).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group mb-3">
                                <label>Pet Age:</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                    <span className="input-group-text">years</span>
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <label>Pet Weight:</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="form-control"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                    />
                                    <span className="input-group-text">kg</span>
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <label>Pet Sex:</label>
                                <select
                                    className="form-control"
                                    value={sex}
                                    onChange={(e) => setSex(e.target.value)}
                                >
                                    <option value="">Select Sex</option>
                                    {Object.entries(petSexOptions).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="btn btn-success w-100">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePetComponent;
