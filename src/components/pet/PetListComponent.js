import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PetService from '../../services/pet/PetService';
import petSizeOptions from '../../enums/PetSizeOptions';
import petSexOptions from '../../enums/PetSexOptions';

const PetListComponent = () => {
    const [pets, setPets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSize, setFilterSize] = useState('');
    const [filterSex, setFilterSex] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = () => {
        PetService.getPets().then((res) => {
            setPets(res.data);
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this pet?')) {
            PetService.deletePet(id).then(() => fetchPets());
        }
    };

    const filteredPets = pets.filter(pet =>
        (pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         pet.animal.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterSize === '' || pet.size === filterSize) &&
        (filterSex === '' || pet.sex === filterSex)
    );

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Pet List</h2>

            <div className="row mb-4">
                <div className="col-md-4 mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or animal..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="col-md-3 mb-2">
                    <select className="form-control" value={filterSize} onChange={(e) => setFilterSize(e.target.value)}>
                        <option value="">All Sizes</option>
                        {Object.entries(petSizeOptions).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-3 mb-2">
                    <select className="form-control" value={filterSex} onChange={(e) => setFilterSex(e.target.value)}>
                        <option value="">All Sexes</option>
                        {Object.entries(petSexOptions).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-2 mb-2">
                    <button className="btn btn-primary w-100" onClick={() => navigate('/add-pet')}>
                        Add Pet
                    </button>
                </div>
            </div>

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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPets.map((pet) => (
                        <tr key={pet.id}>
                            <td>{pet.name}</td>
                            <td>{pet.animal}</td>
                            <td>{pet.breed}</td>
                            <td>{petSizeOptions[pet.size]}</td>
                            <td>{pet.age} years</td>
                            <td>{pet.weight} kg</td>
                            <td>{petSexOptions[pet.sex]}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => navigate(`/update-pet/${pet.id}`)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(pet.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {filteredPets.length === 0 && (
                <p className="text-center text-muted">No pets found matching your criteria.</p>
            )}
        </div>
    );
};

export default PetListComponent;
