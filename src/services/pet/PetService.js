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

// Função para verificar se o backend está online
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get('http://localhost:8080/actuator/health', {
      timeout: 3000
    });
    return response.status === 200;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
};

class PetService {
    async getPets() {
        try {
            // Verifica se o backend está online antes de fazer a requisição
            const isBackendOnline = await checkBackendHealth();
            if (!isBackendOnline) {
                throw new Error('Backend não está disponível. Inicie o servidor Spring primeiro.');
            }
            
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

    async getPetById(petId) {
        try {
            return await api.get(`/${petId}`);
        } catch (error) {
            console.error('Error in getPetById:', error);
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
            return await api.put(`/${petId}/owners/${petOwnerId}`);
        } catch (error) {
            console.error('Error in addPetToPetOwner:', error);
            throw error;
        }
    }
    
    async removeAssociation(petId, petOwnerId) {
        try {
            return await api.delete(`/${petId}/owners/${petOwnerId}`);
        } catch (error) {
            console.error('Error in removeAssociation:', error);
            throw error;
        }
    }

    async getPetsByOwner(petOwnerId) {
        try {
            return await api.get(`/owner/${petOwnerId}`);
        } catch (error) {
            console.error('Error in getPetsByOwner:', error);
            throw error;
        }
    }
}

export default new PetService();