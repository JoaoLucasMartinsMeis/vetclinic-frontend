import React, { useState, useEffect } from 'react';
import PetService from '../services/PetService';
import { Link } from 'react-router-dom';

const PetListComponent = () => {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        PetService.getPets().then((res) => {
            setPets(res.data);
        });
    }, []);

    const deletePet = (id) => {
        PetService.deletePet(id).then(() => {
            setPets(prevPets => prevPets.filter(pet => pet.id !== id));
        });
    };

    return (
        <div className="container" style={{ paddingTop: '30px' }}>
            <h2 className="text-center">Pet List</h2>
            <div className="row mb-3">
                <Link to="/add-pet" className="btn btn-primary">Add Pet</Link>
            </div>
            <div className="row">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Animal</th>
                            <th>Breed</th>
                            <th>Size</th>
                            <th>Age</th>
                            <th>Weight</th>
                            <th>Sex</th>
                            <th>Owners</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pets.map(pet => (
                            <tr key={pet.id}>
                                <td>{pet.name}</td>
                                <td>{pet.animal}</td>
                                <td>{pet.breed}</td>
                                <td>{pet.size}</td>
                                <td>{pet.age}</td>
                                <td>{pet.weight}</td>
                                <td>{pet.sex}</td>
                                <td>
                                    {pet.owners && pet.owners.length > 0
                                        ? pet.owners.map(owner => owner.name).join(', ')
                                        : 'No owners'}
                                </td>
                                <td>
                                    <Link to={`/update-pet/${pet.id}`} className="btn btn-info btn-sm me-2">Update</Link>
                                    <button onClick={() => deletePet(pet.id)} className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PetListComponent;