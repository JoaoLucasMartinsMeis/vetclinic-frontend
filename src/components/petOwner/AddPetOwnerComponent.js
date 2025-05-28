import React, { useState } from 'react';
import PetOwnerService from '../services/PetOwnerService';
import { useNavigate } from 'react-router-dom';

const AddPetOwnerComponent = () => {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const navigate = useNavigate();

    const savePetOwner = (e) => {
        e.preventDefault();
        const owner = { name, cpf, email, phone, address };

        PetOwnerService.createPetOwner(owner).then(() => {
            navigate('/pet-owners');
        });
    };

    return (
        <div className="container mt-4">
            <div className="card col-md-6 offset-md-3">
                <h3 className="text-center mt-3">Add Pet Owner</h3>
                <div className="card-body">
                    <form onSubmit={savePetOwner}>
                        <div className="form-group mb-3">
                            <label>Name:</label>
                            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label>CPF:</label>
                            <input className="form-control" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label>Email:</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label>Phone:</label>
                            <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className="form-group mb-4">
                            <label>Address:</label>
                            <input className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-success w-100">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPetOwnerComponent;
