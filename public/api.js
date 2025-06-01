console.log("Carregando api.js");

// Funções para comunicação com o backend
const api = {
  // Buscar voos
  searchFlights: async (params) => {
    console.log("API: Iniciando busca de voos com parâmetros:", params);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("API: Dados recebidos da busca:", data);
      return data;
    } catch (error) {
      console.error("API: Erro ao buscar voos:", error);
      throw error;
    }
  },
  
  // Buscar preços por período
  searchPeriod: async (params) => {
    console.log("API: Iniciando busca por período com parâmetros:", params);
    try {
      const response = await fetch('/api/period', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("API: Dados recebidos da busca por período:", data);
      return data;
    } catch (error) {
      console.error("API: Erro ao buscar preços por período:", error);
      throw error;
    }
  }
};

// Exportar API para uso global
window.API = api;

console.log("api.js carregado com sucesso");
