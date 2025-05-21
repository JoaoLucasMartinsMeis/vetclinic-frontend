import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductListComponent from './components/PetListComponent';
import AddProductComponent from './components/AddPetComponent';
import UpdateProductComponent from './components/UpdatePetComponent';

const App = () => {
    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/" element={<ProductListComponent />} />
                    <Route path="/pets" element={<ProductListComponent />} />
                    <Route path="/add-pet" element={<AddProductComponent />} />
                    <Route path="/update-pet/:id" element={<UpdateProductComponent />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;