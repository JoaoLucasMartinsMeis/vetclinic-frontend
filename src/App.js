import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PetListComponent from './components/PetList';
import AddPetComponent from './components/AddPet';
import UpdatePetComponent from './components/UpdatePet';

import PetOwnerListComponent from './components/PetOwnerListComponent';
import AddPetOwnerComponent from './components/AddPetOwnerComponent';
import UpdatePetOwnerComponent from './components/UpdatePetOwnerComponent';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    {/* Pets */}
                    <Route path="/pets" element={<PetList />} />
                    <Route path="/add-pet" element={<AddPet />} />
                    <Route path="/update-pet/:id" element={<UpdatePet />} />

                    {/* Pet Owners */}
                    <Route path="/pet-owners" element={<PetOwnerList />} />
                    <Route path="/add-pet-owner" element={<AddPetOwner />} />
                    <Route path="/update-pet-owner/:id" element={<UpdatePetOwner />} />

                    {/* Redirect default to pet list */}
                    <Route path="*" element={<PetList />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
