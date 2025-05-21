import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PetService from '../services/PetService';

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
        const pet = { name, animal, breed, size, age, weight, sex };
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
                        <form>
                            <div className="form-group">
                                <label> Pet Name: </label>
                                <input placeholder="Name" className="form-control"
                                    value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label> Pet Animal: </label>
                                <input placeholder="Animal" className="form-control"
                                    value={animal} onChange={(e) => setAnimal(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label> Pet Breed: </label>
                                <input placeholder="Breed" className="form-control"
                                    value={breed} onChange={(e) => setBreed(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label> Pet Size: </label>
                                <input placeholder="Size" className="form-control"
                                    value={size} onChange={(e) => setSize(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label> Pet Age: </label>
                                <input placeholder="Age" className="form-control"
                                    value={age} onChange={(e) => setAge(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label> Pet Weight: </label>
                                <input placeholder="Weight" className="form-control"
                                    value={weight} onChange={(e) => setWeight(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label> Pet Sex: </label>
                                <input placeholder="Sex" className="form-control"
                                    value={sex} onChange={(e) => setSex(e.target.value)} />
                            </div>
                            <button className="btn btn-success" onClick={updatePet}>Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePetComponent;