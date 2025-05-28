import React, { useEffect, useState } from 'react';
import PetOwnerService from '../services/PetOwnerService';
import { Link } from 'react-router-dom';

const PetOwnerListComponent = () => {
    const [owners, setOwners] = useState([]);

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = () => {
        PetOwnerService.getAllPetOwners().then(res => {
            setOwners(res.data);
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this pet owner?')) {
            PetOwnerService.deletePetOwner(id).then(() => fetchOwners());
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Pet Owners</h2>
            <Link to="/add-pet-owner" className="btn btn-primary mb-3">Add Pet Owner</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>CPF</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {owners.map(owner => (
                        <tr key={owner.id}>
                            <td>{owner.name}</td>
                            <td>{owner.cpf}</td>
                            <td>{owner.email}</td>
                            <td>{owner.phone}</td>
                            <td>{owner.address}</td>
                            <td>
                                <Link to={`/update-pet-owner/${owner.id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                                <button onClick={() => handleDelete(owner.id)} className="btn btn-danger btn-sm">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PetOwnerListComponent;
