console.log("Carregando utils.js");

// Funções utilitárias para o Travel Optimizer
const utils = {
  // Formatar preço para exibição
  formatPrice: (price, currency = 'BRL') => {
    if (currency === 'BRL') {
      return `R$ ${price.toFixed(2)}`;
    } else {
      return `$ ${(price / 5.2).toFixed(2)}`;
    }
  },
  
  // Formatar milhas para exibição
  formatMiles: (miles) => {
    return `${miles.toLocaleString()} milhas`;
  },
  
  // Calcular economia em porcentagem
  calculateSavings: (originalPrice, comboPrice) => {
    if (originalPrice <= 0) return 0;
    const savings = ((originalPrice - comboPrice) / originalPrice) * 100;
    return Math.round(savings);
  },
  
  // Formatar duração de voo
  formatDuration: (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  },
  
  // Gerar ID único
  generateId: () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  },
  
  // Validar formulário de busca
  validateSearchForm: (formData) => {
    const errors = {};
    
    if (!formData.origin) {
      errors.origin = 'Origem é obrigatória';
    }
    
    if (!formData.destination) {
      errors.destination = 'Destino é obrigatório';
    }
    
    if (formData.origin === formData.destination) {
      errors.destination = 'Destino deve ser diferente da origem';
    }
    
    if (!formData.departureDate) {
      errors.departureDate = 'Data de ida é obrigatória';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

// Exportar utils para uso global
window.Utils = utils;

console.log("utils.js carregado com sucesso");
