export const translations = {
    // Pets
    'Add Pet': 'Adicionar Pet',
    'Pet List': 'Lista de Pets',
    'Update Pet': 'Atualizar Pet',
    'Pet Name': 'Nome do Pet',
    'Animal': 'Animal',
    'Breed': 'Raça',
    'Pet Size': 'Porte',
    'Age': 'Idade',
    'Weight': 'Peso',
    'Sex': 'Sexo',
    'Actions': 'Ações',
    'Save': 'Salvar',
    'Edit': 'Editar',
    'Delete': 'Excluir',
    'Select Animal': 'Selecionar Animal',
    'Select Size': 'Selecionar Porte',
    'Select Sex': 'Selecionar Sexo',
    'All Sizes': 'Todos os Portes',
    'All Sexes': 'Todos os Sexos',
    'Search by name or animal...': 'Buscar por nome ou animal...',
    'No pets found matching your criteria.': 'Nenhum pet encontrado com os critérios informados.',
    'Please enter numeric values for age (years) and weight (kg).': 'Por favor, insira valores numéricos para idade (anos) e peso (kg).',
    'Are you sure you want to delete this pet?': 'Tem certeza que deseja excluir este pet?',
    'Pet deleted successfully.': 'Pet excluído com sucesso.',
    'Failed to delete pet.': 'Falha ao excluir pet.',
    
    // Animal Types
    'DOG': 'Cachorro',
    'CAT': 'Gato',
    'FISH': 'Peixe',
    'BIRD': 'Pássaro',
    'RABBIT': 'Coelho',
    'HAMSTER': 'Hamster',
    'MOUSE': 'Camundongo',
    'RAT': 'Rato',
    'GUINEA_PIG': 'Porquinho-da-índia',
    'REPTILE': 'Réptil',
    'HEDGEHOG': 'Ouriço',
    'OTHER': 'Outro',
    
    // Sex Options
    'MALE': 'Macho',
    'FEMALE': 'Fêmea',
    
    // Size Options
    'VERY_SMALL': 'Muito Pequeno',
    'SMALL': 'Pequeno',
    'MEDIUM': 'Médio',
    'LARGE': 'Grande',
    'X_LARGE': 'Grande_X',
    'XX_LARGE': 'Grande_XX',
    
    // Pet Owners
    'Add Pet Owner': 'Adicionar Dono',
    'Pet Owners': 'Donos de Pets',
    'Update Pet Owner': 'Atualizar Dono',
    'Name': 'Nome',
    'CPF': 'CPF',
    'Email': 'E-mail',
    'Phone': 'Telefone',
    'Address': 'Endereço',
    'Owner List': 'Lista de Donos',
    'Name is required': 'Nome é obrigatório',
    'CPF is required': 'CPF é obrigatório',
    'Email is required': 'E-mail é obrigatório',
    'Invalid email format': 'Formato de e-mail inválido',
    'Phone is required': 'Telefone é obrigatório',
    'Address is required': 'Endereço é obrigatório',
    'Are you sure you want to delete this pet owner?': 'Tem certeza que deseja excluir este dono?',
    'Pet owner deleted successfully.': 'Dono excluído com sucesso.',
    'Failed to delete pet owner.': 'Falha ao excluir dono.',
    'Failed to load pet owners': 'Falha ao carregar donos',
    'Failed to save pet owner': 'Falha ao salvar dono',
    'Failed to update pet owner': 'Falha ao atualizar dono',
    'No owners found': 'Nenhum dono encontrado',
    
    // Actions
    'Save Changes': 'Salvar Alterações',
    'Cancel': 'Cancelar'
  };

  export const translate = (key) => {
    return translations[key] || key;
  };