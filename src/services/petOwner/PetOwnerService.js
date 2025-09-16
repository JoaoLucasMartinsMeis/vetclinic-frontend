import axios from 'axios';

const PET_OWNER_API_BASE_URL = 'http://localhost:8080/vetclinic/petOwners';

// Configuração base do axios
const api = axios.create({
    baseURL: PET_OWNER_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        if (error.response) {
            throw new Error(error.response.data.message || 'Server error');
        } else if (error.request) {
            throw new Error('Network error. Please check your connection.');
        } else {
            throw new Error('An unexpected error occurred.');
        }
    }
);

class PetOwnerService {
    async getAllPetOwners() {
        try {
            return await api.get('/all');
        } catch (error) {
            throw error;
        }
    }

    async createPetOwner(petOwner) {
        try {
            return await api.post('', petOwner);
        } catch (error) {
            throw error;
        }
    }

    async getPetOwnerById(petOwnerId) {
        try {
            return await api.get(`/${petOwnerId}`);
        } catch (error) {
            throw error;
        }
    }

    async updatePetOwner(petOwner, petOwnerId) {
        try {
            return await api.put(`/${petOwnerId}`, petOwner);
        } catch (error) {
            throw error;
        }
    }

    async deletePetOwner(petOwnerId) {
        try {
            return await api.delete(`/${petOwnerId}`);
        } catch (error) {
            throw error;
        }
    }

    // Métodos para relacionamento com Pets
    async getPetsByOwner(petOwnerId) {
        try {
            return await api.get(`/${petOwnerId}/pets`);
        } catch (error) {
            throw error;
        }
    }

      async addPetToOwner(petOwnerId, petId) {
    try {
      // CORREÇÃO: A rota correta é "/petOwner/{petOwnerId}/pet/{petId}"
      return await api.post(`/petOwner/${petOwnerId}/pet/${petId}`);
    } catch (error) {
      throw error;
    }
  }

  async removePetFromOwner(petOwnerId, petId) {
    try {
      // CORREÇÃO: A rota correta é "/petOwner/{petOwnerId}/pet/{petId}"
      return await api.delete(`/petOwner/${petOwnerId}/pet/${petId}`);
    } catch (error) {
      throw error;
    }
  }

  async searchOwnersByName(name) {
        try {
            return await api.get(`/name?name=${encodeURIComponent(name)}`);
        } catch (error) {
            console.error('Error searching owners:', error);
            throw error;
        }
    }
}

export default new PetOwnerService();