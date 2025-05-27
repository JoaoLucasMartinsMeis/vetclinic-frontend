import axios from 'axios';

const PET_API_BASE_URL = "http://localhost:8080/vetclinic/pets";

class PetService {
    getPets() {
        return axios.get(PET_API_BASE_URL);
    }

    createPet(pet) {
        return axios.post(PET_API_BASE_URL, pet);
    }

    getPetById(petId) {
        return axios.get(`${PET_API_BASE_URL}/${petId}`);
    }

    updatePet(pet, petId) {
        return axios.put(`${PET_API_BASE_URL}/${petId}`, pet);
    }

    deletePet(petId) {
        return axios.delete(`${PET_API_BASE_URL}/${petId}`);
    }

    addPetToPetOwner(petId, petOwnerId) {
        return axios.put(`${PET_API_BASE_URL}/${petId}/owners/${petOwnerId}`);
    }
    
    removeAssociation(petId, petOwnerId) {
        return axios.delete(`${PET_API_BASE_URL}/${petId}/owners/${petOwnerId}`);
    }
}

export default new PetService();