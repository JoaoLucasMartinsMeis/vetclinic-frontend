import React, { useEffect, useState } from 'react';
import PetOwnerService from '../../services/petOwner/PetOwnerService';
import { Link } from 'react-router-dom';

const PetOwnerListComponent = () => {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = () => {
        setLoading(true);
        PetOwnerService.getAllPetOwners()
            .then(res => {
                setOwners(res.data);
                setErrorMessage('');
            })
            .catch(() => {
                setErrorMessage('Failed to fetch pet owners.');
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this pet owner?')) {
            PetOwnerService.deletePetOwner(id)
                .then(() => {
                    setSuccessMessage('Pet owner deleted successfully.');
                    setErrorMessage('');
                    fetchOwners();
                })
                .catch(() => {
                    setErrorMessage('Error deleting pet owner.');
                    setSuccessMessage('');
                });
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Pet Owners</h2>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <Link to="/add-pet-owner" className="btn btn-primary mb-3">Add Pet Owner</Link>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
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
            )}
        </div>
    );
};

export default PetOwnerListComponent;
