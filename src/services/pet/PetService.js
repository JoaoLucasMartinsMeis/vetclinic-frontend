import axios from 'axios';

const PET_API_BASE_URL = "http://localhost:8080/vetclinic/pets";

// Configuração base do axios com timeout reduzido para desenvolvimento
const api = axios.create({
  baseURL: PET_API_BASE_URL,
  timeout: 5000, // Reduzido para 5 segundos
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para tratamento de erros mais detalhado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Details:', error);

    if (error.code === 'ECONNREFUSED') {
      throw new Error('Backend não está respondendo. Verifique se o servidor Spring está rodando na porta 8080.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Erro de rede. Verifique sua conexão e se o backend está acessível.');
    } else if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || `Erro do servidor: ${error.response.status}`;
      throw new Error(message);
    } else if (error.request) {
      // Network error
      throw new Error('Erro de rede. Não foi possível conectar ao servidor.');
    } else {
      // Other error
      throw new Error('Erro inesperado: ' + error.message);
    }
  }
);



class PetService {
  async getPets() {
    try {


      return await api.get();
    } catch (error) {
      console.error('Error in getPets:', error);
      throw error;
    }
  }

  async createPet(pet) {
    try {
      return await api.post('', pet);
    } catch (error) {
      console.error('Error in createPet:', error);
      throw error;
    }
  }

  async findPetById(petId) {
    try {
      return await api.get(`/${petId}`);
    } catch (error) {
      console.error('Error in findPetById:', error);
      throw error;
    }
  }

  async updatePet(pet, petId) {
    try {
      return await api.put(`/${petId}`, pet);
    } catch (error) {
      console.error('Error in updatePet:', error);
      throw error;
    }
  }

  async deletePet(petId) {
    try {
      return await api.delete(`/${petId}`);
    } catch (error) {
      console.error('Error in deletePet:', error);
      throw error;
    }
  }

  async addPetToPetOwner(petId, petOwnerId) {
    try {
      // CORREÇÃO: A rota correta é "/pet/{petId}/petOwner/{petOwnerId}"
      return await api.post(`/pet/${petId}/petOwner/${petOwnerId}`);
    } catch (error) {
      console.error('Error in addPetToPetOwner:', error);
      throw error;
    }
  }

  async removeAssociation(petId, petOwnerId) {
    try {
      // CORREÇÃO: A rota correta é "/pet/{petId}/petOwner/{petOwnerId}"
      return await api.delete(`/pet/${petId}/petOwner/${petOwnerId}`);
    } catch (error) {
      console.error('Error in removeAssociation:', error);
      throw error;
    }
  }

  async getPetOwnersByPet(petId) {
    try {
      // Solução temporária: buscar todos os owners e filtrar
      const allOwners = await PetOwnerService.getAllPetOwners();
      const ownersWithPet = allOwners.data.filter(owner => 
        owner.pets && owner.pets.some(pet => pet.id === petId)
      );
      return { data: ownersWithPet };
    } catch (error) {
      console.error('Error fetching pet owners:', error);
      throw error;
    }
  }
}

export default new PetService();