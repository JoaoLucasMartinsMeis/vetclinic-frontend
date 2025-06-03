import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomeComponent from './components/HomeComponent';

import PetListComponent from './components/pet/PetListComponent';
import AddPetComponent from './components/pet/AddPetComponent';
import UpdatePetComponent from './components/pet/UpdatePetComponent';

import PetOwnerListComponent from './components/petOwner/PetOwnerListComponent';
import AddPetOwnerComponent from './components/petOwner/AddPetOwnerComponent';
import UpdatePetOwnerComponent from './components/petOwner/UpdatePetOwnerComponent';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeComponent />} />

                {/* Pets */}
                <Route path="/pets" element={<PetListComponent />} />
                <Route path="/add-pet" element={<AddPetComponent />} />
                <Route path="/update-pet/:id" element={<UpdatePetComponent />} />

                {/* Pet Owners */}
                <Route path="/pet-owners" element={<PetOwnerListComponent />} />
                <Route path="/add-pet-owner" element={<AddPetOwnerComponent />} />
                <Route path="/update-pet-owner/:id" element={<UpdatePetOwnerComponent />} />

                {/* Redirect all unknown routes to Home */}
                <Route path="*" element={<HomeComponent />} />
            </Routes>
        </Router>
    );
};

export default App;