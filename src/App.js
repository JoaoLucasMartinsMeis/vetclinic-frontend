import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PetListComponent from './components/PetListComponent';
import AddPetComponent from './components/AddPetComponent';
import UpdatePetComponent from './components/UpdatePetComponent';

const App = () => {
    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/" element={<PetListComponent />} />
                    <Route path="/pets" element={<PetListComponent />} />
                    <Route path="/add-pet" element={<AddPetComponent />} />
                    <Route path="/update-pet/:id" element={<UpdatePetComponent />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
