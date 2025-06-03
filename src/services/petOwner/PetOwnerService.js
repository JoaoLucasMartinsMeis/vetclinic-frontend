import axios from 'axios';

const PET_OWNER_API_BASE_URL = 'http://localhost:8080/vetclinic/petOwners';

class PetOwnerService {
    getAllPetOwners() {
        return axios.get(`${PET_OWNER_API_BASE_URL}/all`);
    }
    
    createPetOwner(petOwner) {
        return axios.post(PET_OWNER_API_BASE_URL, petOwner);
    }

    getPetOwnerById(petOwnerId) {
        return axios.get(`${PET_OWNER_API_BASE_URL}/${petOwnerId}`);
    }

    updatePetOwner(petOwner, petOwnerId) {
        return axios.put(`${PET_OWNER_API_BASE_URL}/${petOwnerId}`, petOwner);
    }
    
    deletePetOwner(petOwnerId) {
        return axios.delete(`${PET_OWNER_API_BASE_URL}/${petOwnerId}`);
    } 
}

export default new PetOwnerService();
