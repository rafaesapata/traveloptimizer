// Carregar variáveis de ambiente
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const { 
  searchSkyscanner, 
  searchKayak, 
  searchDecolar,
  searchCopa,
  searchAzul,
  searchLatam,
  searchGol,
  validatePermissions,
  simulatePriceForDate
} = require('./searchers');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Servir arquivos estáticos - tentar múltiplos caminhos para compatibilidade
const staticPaths = [
  path.join(__dirname, '../public'),
  path.join(__dirname, '../dist/public'),
  path.join(__dirname, '../../public')
];

staticPaths.forEach(staticPath => {
  console.log(`Tentando servir arquivos estáticos de: ${staticPath}`);
  app.use(express.static(staticPath));
});

// Endpoint para busca de voos - POST /api/search (usado pelo frontend)
app.post('/api/search', async (req, res) => {
  // Configurar timeout global para o endpoint (5 minutos para permitir crawler)
  const ENDPOINT_TIMEOUT = 300000;
  let endpointTimer = null;
  
  // Configurar timeout global para garantir resposta
  endpointTimer = setTimeout(() => {
    console.log('[TIMEOUT] Timeout global do endpoint atingido após 5 minutos');
    if (!res.headersSent) {
      return res.status(408).json({
        success: false,
        results: [],
        errors: [{provider: 'Sistema', error: 'Timeout global do endpoint atingido após 5 minutos'}],
        message: 'A busca demorou mais de 5 minutos para responder. O crawler pode estar enfrentando dificuldades. Tente novamente em alguns minutos.'
      });
    }
  }, ENDPOINT_TIMEOUT);
  
  const { origin, destination, departureDate, returnDate, adults = 1, children = 0, cabinClass = 'economy', useMiles = true, useSmartSearch = true } = req.body;
  
  // Validar parâmetros obrigatórios
  if (!origin || !destination || !departureDate) {
    clearTimeout(endpointTimer);
    return res.status(400).json({
      success: false,
      results: [],
      errors: [{provider: 'Validação', error: 'Origem, destino e data de ida são obrigatórios'}],
      message: 'Parâmetros obrigatórios não fornecidos'
    });
  }
  
  // Validar formato da data de ida
  const departureDateObj = new Date(departureDate);
  if (isNaN(departureDateObj.getTime()) || departureDate.length > 10) {
    clearTimeout(endpointTimer);
    return res.status(400).json({
      success: false,
      results: [],
      errors: [{provider: 'Validação', error: `Data de ida inválida: ${departureDate}. Use formato YYYY-MM-DD`}],
      message: 'Data de ida em formato inválido'
    });
  }
  
  // Validar formato da data de volta (se fornecida)
  if (returnDate) {
    const returnDateObj = new Date(returnDate);
    if (isNaN(returnDateObj.getTime()) || returnDate.length > 10) {
      clearTimeout(endpointTimer);
      return res.status(400).json({
        success: false,
        results: [],
        errors: [{provider: 'Validação', error: `Data de volta inválida: ${returnDate}. Use formato YYYY-MM-DD`}],
        message: 'Data de volta em formato inválido'
      });
    }
  }
  
  // Converter para números
  const numAdults = parseInt(adults) || 1;
  const numChildren = parseInt(children) || 0;
  const totalPassengers = numAdults + numChildren;
  
  // Detectar tipo de busca baseado na presença da data de volta
  const isRoundTrip = returnDate && returnDate.trim() !== '';
  const tripType = isRoundTrip ? 'ida e volta' : 'apenas ida';
  
  console.log(`[INFO] Tipo de busca: ${tripType}`);
  console.log(`[INFO] Data de ida: ${departureDate}, Data de volta: ${returnDate || 'não informada'}`);
  
  // Configurar resposta como JSON normal (não streaming)
  res.setHeader('Content-Type', 'application/json');
  
  // Preparar array para armazenar resultados
  let results = [];
  let errors = [];
  
  console.log(`Busca de voos (POST /api/search): ${origin} → ${destination}, Ida: ${departureDate}, Volta: ${returnDate}, Passageiros: ${numAdults} adultos, ${numChildren} crianças`);
  
    console.log('[INFO] Iniciando busca real em todos os provedores');
  
  // Função para criar uma promessa com timeout
  const searchWithTimeout = (searchFn, provider, timeout = 5000) => {
    console.log(`[INFO] Iniciando busca para ${provider} com timeout de ${timeout}ms`);
    
    return new Promise((resolve) => {
      // Flag para controlar se a promessa já foi resolvida
      let isResolved = false;
      
      // Função para resolver apenas uma vez
      const safeResolve = (result) => {
        if (!isResolved) {
          isResolved = true;
          console.log(`[INFO] Resolvendo promessa para ${provider} com status: ${result.status}`);
          resolve(result);
        }
      };
      
      // Criar uma promessa para o timeout
      const timeoutPromise = setTimeout(() => {
        console.log(`[WARN] Timeout atingido para o provedor ${provider}`);
        safeResolve({ 
          status: 'rejected', 
          reason: new Error(`Timeout ao buscar dados do ${provider}`) 
        });
      }, timeout);
      
      // Criar uma promessa para a busca
      try {
        console.log(`[INFO] Chamando função de busca para ${provider}`);
        
        searchFn(origin, destination, departureDate, returnDate, numAdults, numChildren)
          .then(result => {
            clearTimeout(timeoutPromise); // Limpar o timeout se a busca completar
            console.log(`[INFO] Provedor ${provider} retornou com sucesso`);
            safeResolve({ status: 'fulfilled', value: result });
          })
          .catch(error => {
            clearTimeout(timeoutPromise); // Limpar o timeout se a busca falhar
            console.log(`[WARN] Erro no provedor ${provider}: ${error.message}`);
            safeResolve({ status: 'rejected', reason: error });
          });
      } catch (error) {
        clearTimeout(timeoutPromise); // Limpar o timeout se houver exceção
        console.log(`[ERROR] Exceção ao chamar função de busca para ${provider}: ${error.message}`);
        safeResolve({ 
          status: 'rejected', 
          reason: error 
        });
      }
    });
  };
  
  // Executar busca apenas na LATAM
  try {
    console.log('[INFO] Iniciando busca apenas na LATAM');
    
    const latamResults = await searchLatam(origin, destination, departureDate, returnDate, numAdults, numChildren);
    
    if (latamResults && Array.isArray(latamResults) && latamResults.length > 0) {
      console.log(`[INFO] LATAM retornou ${latamResults.length} voos`);
      results.push({
        provider: 'Latam',
        flights: latamResults
      });
    } else {
      console.log('[WARN] LATAM não retornou resultados');
      errors.push({
        provider: 'Latam',
        error: 'Nenhum voo encontrado'
      });
    }
    
  } catch (error) {
    console.error('[ERROR] Erro ao buscar na LATAM:', error);
    errors.push({
      provider: 'Latam',
      error: error.message || 'Erro desconhecido'
    });
  }
  
  // Limpar o timeout global do endpoint
  if (endpointTimer) {
    clearTimeout(endpointTimer);
    endpointTimer = null;
  }
  
  // Enviar resposta
  console.log('[INFO] Enviando resposta ao frontend');
  console.log(`[INFO] Total de resultados: ${results.length}, Total de erros: ${errors.length}`);
  
  // Se houver erros e nenhum resultado, retornar erro
  if (errors.length > 0 && results.length === 0) {
    return res.status(400).json({
      success: false,
      results: [],
      errors: errors,
      message: `Não foi possível obter dados reais: ${errors.map(e => e.error).join(', ')}`
    });
  }
  
  // Se houver resultados, retornar sucesso (mesmo com alguns erros)
  res.json({
    success: true,
    results,
    errors: errors.length > 0 ? errors : undefined,
    message: results.length > 0 ? 
      `Busca concluída com sucesso (dados reais da LATAM)` : 
      'Nenhum resultado encontrado'
  });
});

// Endpoint para busca de voos - GET /api/flights (legado)
app.get('/api/flights', async (req, res) => {
  const { origin, destination, departureDate, returnDate, adults = 1, children = 0 } = req.query;
  
  // Converter para números
  const numAdults = parseInt(adults) || 1;
  const numChildren = parseInt(children) || 0;
  const totalPassengers = numAdults + numChildren;
  
  // Configurar resposta como JSON normal (não streaming)
  res.setHeader('Content-Type', 'application/json');
  
  // Preparar array para armazenar resultados
  let results = [];
  let errors = [];
  
  try {
    console.log(`Busca de voos: ${origin} → ${destination}, Ida: ${departureDate}, Volta: ${returnDate}, Passageiros: ${numAdults} adultos, ${numChildren} crianças`);
    
    // Validar permissões antes de buscar dados
    await validatePermissions();
    
    // Buscar em todos os provedores em paralelo
    const searchPromises = [
      searchSkyscanner(origin, destination, departureDate, returnDate, numAdults, numChildren)
        .then(flights => {
          // Adicionar milhas para cada voo (simulação)
          flights.forEach(flight => {
            flight.milesPrice = Math.round(flight.price * 60); // Aproximadamente 60 milhas por dólar
            
            // Adicionar detalhes para cada voo
            flight.details = {
              aircraft: 'Boeing 737-800',
              aircraftType: 'Narrow-body jet airliner',
              manufacturer: 'Boeing',
              departureTime: '08:30',
              arrivalTime: '16:30',
              departureAirport: origin,
              arrivalAirport: destination,
              departureTerminal: 'T2',
              arrivalTerminal: 'T3',
              flightNumber: `SK${Math.floor(Math.random() * 1000) + 1000}`,
              baggage: {
                included: flight.price > 600,
                carryOn: '1 peça de 10kg',
                checked: flight.price > 600 ? '1 peça de 23kg' : 'Não incluída',
                maxWeight: '23kg',
                dimensions: '158cm (A+L+C)'
              },
              services: {
                meal: flight.price > 500,
                wifi: flight.price > 700,
                entertainment: flight.price > 600,
                powerOutlets: flight.price > 550,
                mealType: flight.price > 800 ? 'Refeição completa' : 'Lanches',
                wifiSpeed: flight.price > 800 ? 'Alta velocidade' : 'Básico'
              },
              cancellation: {
                allowed: true,
                fee: Math.round(flight.price * 0.2),
                changeAllowed: true,
                changeFee: Math.round(flight.price * 0.15),
                deadline: '24 horas antes do voo'
              },
              stops: flight.stops === 0 ? [] : Array.from({ length: flight.stops }, (_, i) => ({
                airport: ['GRU', 'MIA', 'ATL', 'JFK'][i % 4],
                duration: Math.floor(Math.random() * 30) + 30,
                waitTime: Math.floor(Math.random() * 90) + 60
              }))
            };
          });
          
          results.push({
            provider: 'Skyscanner',
            flights
          });
        })
        .catch(err => {
          console.error('Erro no Skyscanner:', err);
          errors.push({ provider: 'Skyscanner', error: err.message });
        }),
      
      searchKayak(origin, destination, departureDate, returnDate, numAdults, numChildren)
        .then(flights => {
          // Adicionar milhas para cada voo (simulação)
          flights.forEach(flight => {
            flight.milesPrice = Math.round(flight.price * 55); // Aproximadamente 55 milhas por dólar
            
            // Adicionar detalhes para cada voo
            flight.details = {
              aircraft: 'Airbus A320',
              aircraftType: 'Narrow-body jet airliner',
              manufacturer: 'Airbus',
              departureTime: '10:15',
              arrivalTime: '18:45',
              departureAirport: origin,
              arrivalAirport: destination,
              departureTerminal: 'T1',
              arrivalTerminal: 'T2',
              flightNumber: `KY${Math.floor(Math.random() * 1000) + 1000}`,
              baggage: {
                included: flight.price > 550,
                carryOn: '1 peça de 8kg',
                checked: flight.price > 550 ? '1 peça de 23kg' : 'Não incluída',
                maxWeight: '23kg',
                dimensions: '158cm (A+L+C)'
              },
              services: {
                meal: flight.price > 450,
                wifi: flight.price > 650,
                entertainment: flight.price > 550,
                powerOutlets: flight.price > 500,
                mealType: flight.price > 750 ? 'Refeição completa' : 'Lanches',
                wifiSpeed: flight.price > 750 ? 'Alta velocidade' : 'Básico'
              },
              cancellation: {
                allowed: true,
                fee: Math.round(flight.price * 0.25),
                changeAllowed: true,
                changeFee: Math.round(flight.price * 0.2),
                deadline: '48 horas antes do voo'
              },
              stops: flight.stops === 0 ? [] : Array.from({ length: flight.stops }, (_, i) => ({
                airport: ['GRU', 'MIA', 'ATL', 'JFK'][i % 4],
                duration: Math.floor(Math.random() * 30) + 30,
                waitTime: Math.floor(Math.random() * 90) + 60
              }))
            };
          });
          
          results.push({
            provider: 'Kayak',
            flights
          });
        })
        .catch(err => {
          console.error('Erro no Kayak:', err);
          errors.push({ provider: 'Kayak', error: err.message });
        }),
      
      searchDecolar(origin, destination, departureDate, returnDate, numAdults, numChildren)
        .then(flights => {
          // Adicionar milhas para cada voo (simulação)
          flights.forEach(flight => {
            flight.milesPrice = Math.round(flight.price * 65); // Aproximadamente 65 milhas por dólar
            
            // Adicionar detalhes para cada voo
            flight.details = {
              aircraft: 'Boeing 787 Dreamliner',
              aircraftType: 'Wide-body jet airliner',
              manufacturer: 'Boeing',
              departureTime: '22:30',
              arrivalTime: '06:45',
              departureAirport: origin,
              arrivalAirport: destination,
              departureTerminal: 'T3',
              arrivalTerminal: 'T1',
              flightNumber: `DC${Math.floor(Math.random() * 1000) + 1000}`,
              baggage: {
                included: flight.price > 700,
                carryOn: '1 peça de 10kg',
                checked: flight.price > 700 ? '2 peças de 23kg' : 'Não incluída',
                maxWeight: '23kg',
                dimensions: '158cm (A+L+C)'
              },
              services: {
                meal: flight.price > 600,
                wifi: flight.price > 800,
                entertainment: flight.price > 700,
                powerOutlets: flight.price > 650,
                mealType: flight.price > 850 ? 'Refeição completa' : 'Lanches',
                wifiSpeed: flight.price > 850 ? 'Alta velocidade' : 'Básico'
              },
              cancellation: {
                allowed: true,
                fee: Math.round(flight.price * 0.15),
                changeAllowed: true,
                changeFee: Math.round(flight.price * 0.1),
                deadline: '72 horas antes do voo'
              },
              stops: flight.stops === 0 ? [] : Array.from({ length: flight.stops }, (_, i) => ({
                airport: ['GRU', 'MIA', 'ATL', 'JFK'][i % 4],
                duration: Math.floor(Math.random() * 30) + 30,
                waitTime: Math.floor(Math.random() * 90) + 60
              }))
            };
          });
          
          results.push({
            provider: 'Decolar',
            flights
          });
        })
        .catch(err => {
          console.error('Erro na Decolar:', err);
          errors.push({ provider: 'Decolar', error: err.message });
        }),
      
      searchCopa(origin, destination, departureDate, returnDate, numAdults, numChildren)
        .then(flights => {
          // Adicionar milhas para cada voo (simulação)
          flights.forEach(flight => {
            flight.milesPrice = Math.round(flight.price * 58); // Aproximadamente 58 milhas por dólar
            
            // Adicionar detalhes para cada voo
            flight.details = {
              aircraft: 'Boeing 737-800',
              aircraftType: 'Narrow-body jet airliner',
              manufacturer: 'Boeing',
              departureTime: '14:20',
              arrivalTime: '22:15',
              departureAirport: origin,
              arrivalAirport: destination,
              departureTerminal: 'T2',
              arrivalTerminal: 'T3',
              flightNumber: `CM${Math.floor(Math.random() * 1000) + 1000}`,
              baggage: {
                included: true,
                carryOn: '1 peça de 10kg',
                checked: '1 peça de 23kg',
                maxWeight: '23kg',
                dimensions: '158cm (A+L+C)'
              },
              services: {
                meal: true,
                wifi: flight.category === 'Business',
                entertainment: true,
                powerOutlets: true,
                mealType: flight.category === 'Business' ? 'Refeição completa' : 'Lanches',
                wifiSpeed: flight.category === 'Business' ? 'Alta velocidade' : 'Básico'
              },
              cancellation: {
                allowed: true,
                fee: Math.round(flight.price * 0.18),
                changeAllowed: true,
                changeFee: Math.round(flight.price * 0.12),
                deadline: '48 horas antes do voo'
              },
              stops: flight.stops === 0 ? [] : Array.from({ length: flight.stops }, (_, i) => ({
                airport: ['PTY', 'MIA', 'GRU', 'BOG'][i % 4],
                duration: Math.floor(Math.random() * 30) + 30,
                waitTime: Math.floor(Math.random() * 90) + 60
              }))
            };
          });
          
          results.push({
            provider: 'Copa Airlines',
            flights
          });
        })
        .catch(err => {
          console.error('Erro na Copa Airlines:', err);
          errors.push({ provider: 'Copa Airlines', error: err.message });
        }),
      
      searchAzul(origin, destination, departureDate, returnDate, numAdults, numChildren)
        .then(flights => {
          // Adicionar milhas para cada voo (simulação)
          flights.forEach(flight => {
            flight.milesPrice = Math.round(flight.price * 62); // Aproximadamente 62 milhas por dólar
            
            // Adicionar detalhes para cada voo
            flight.details = {
              aircraft: 'Embraer E195-E2',
              aircraftType: 'Narrow-body jet airliner',
              manufacturer: 'Embraer',
              departureTime: '06:45',
              arrivalTime: '14:30',
              departureAirport: origin,
              arrivalAirport: destination,
              departureTerminal: 'T1',
              arrivalTerminal: 'T2',
              flightNumber: `AD${Math.floor(Math.random() * 1000) + 1000}`,
              baggage: {
                included: flight.category !== 'Economy',
                carryOn: '1 peça de 10kg',
                checked: flight.category !== 'Economy' ? '1 peça de 23kg' : 'Não incluída',
                maxWeight: '23kg',
                dimensions: '158cm (A+L+C)'
              },
              services: {
                meal: flight.category !== 'Economy',
                wifi: flight.category === 'Business',
                entertainment: true,
                powerOutlets: true,
                mealType: flight.category === 'Business' ? 'Refeição completa' : 'Lanches',
                wifiSpeed: flight.category === 'Business' ? 'Alta velocidade' : 'Básico'
              },
              cancellation: {
                allowed: true,
                fee: Math.round(flight.price * 0.2),
                changeAllowed: true,
                changeFee: Math.round(flight.price * 0.15),
                deadline: '24 horas antes do voo'
              },
              stops: flight.stops === 0 ? [] : Array.from({ length: flight.stops }, (_, i) => ({
                airport: ['VCP', 'CNF', 'GRU', 'BSB'][i % 4],
                duration: Math.floor(Math.random() * 30) + 30,
                waitTime: Math.floor(Math.random() * 90) + 60
              }))
            };
          });
          
          results.push({
            provider: 'Azul',
            flights
          });
        })
        .catch(err => {
          console.error('Erro na Azul:', err);
          errors.push({ provider: 'Azul', error: err.message });
        }),
      
      searchLatam(origin, destination, departureDate, returnDate, numAdults, numChildren)
        .then(flights => {
          // Adicionar milhas para cada voo (simulação)
          flights.forEach(flight => {
            flight.milesPrice = Math.round(flight.price * 60); // Aproximadamente 60 milhas por dólar
            
            // Adicionar detalhes para cada voo
            flight.details = {
              aircraft: 'Airbus A350-900',
              aircraftType: 'Wide-body jet airliner',
              manufacturer: 'Airbus',
              departureTime: '12:15',
              arrivalTime: '20:45',
              departureAirport: origin,
              arrivalAirport: destination,
              departureTerminal: 'T3',
              arrivalTerminal: 'T4',
              flightNumber: `LA${Math.floor(Math.random() * 1000) + 1000}`,
              baggage: {
                included: flight.category !== 'Economy',
                carryOn: '1 peça de 10kg',
                checked: flight.category !== 'Economy' ? '2 peças de 23kg' : 'Não incluída',
                maxWeight: '23kg',
                dimensions: '158cm (A+L+C)'
              },
              services: {
                meal: true,
                wifi: flight.category !== 'Economy',
                entertainment: true,
                powerOutlets: true,
                mealType: flight.category === 'Premium Economy' || flight.category === 'Business' ? 'Refeição completa' : 'Lanches',
                wifiSpeed: flight.category === 'Business' ? 'Alta velocidade' : 'Básico'
              },
              cancellation: {
                allowed: true,
                fee: Math.round(flight.price * 0.22),
                changeAllowed: true,
                changeFee: Math.round(flight.price * 0.18),
                deadline: '48 horas antes do voo'
              },
              stops: flight.stops === 0 ? [] : Array.from({ length: flight.stops }, (_, i) => ({
                airport: ['GRU', 'SCL', 'LIM', 'BOG'][i % 4],
                duration: Math.floor(Math.random() * 30) + 30,
                waitTime: Math.floor(Math.random() * 90) + 60
              }))
            };
          });
          
          results.push({
            provider: 'Latam',
            flights
          });
        })
        .catch(err => {
          console.error('Erro na Latam:', err);
          errors.push({ provider: 'Latam', error: err.message });
        }),
      
      searchGol(origin, destination, departureDate, returnDate, numAdults, numChildren)
        .then(flights => {
          // Adicionar milhas para cada voo (simulação)
          flights.forEach(flight => {
            flight.milesPrice = Math.round(flight.price * 57); // Aproximadamente 57 milhas por dólar
            
            // Adicionar detalhes para cada voo
            flight.details = {
              aircraft: 'Boeing 737-800',
              aircraftType: 'Narrow-body jet airliner',
              manufacturer: 'Boeing',
              departureTime: '16:30',
              arrivalTime: '00:15',
              departureAirport: origin,
              arrivalAirport: destination,
              departureTerminal: 'T2',
              arrivalTerminal: 'T1',
              flightNumber: `G3${Math.floor(Math.random() * 1000) + 1000}`,
              baggage: {
                included: flight.category === 'Premium',
                carryOn: '1 peça de 10kg',
                checked: flight.category === 'Premium' ? '2 peças de 23kg' : 'Não incluída',
                maxWeight: '23kg',
                dimensions: '158cm (A+L+C)'
              },
              services: {
                meal: true,
                wifi: flight.category === 'Premium',
                entertainment: true,
                powerOutlets: flight.category === 'Premium',
                mealType: flight.category === 'Premium' ? 'Refeição completa' : 'Lanches',
                wifiSpeed: flight.category === 'Premium' ? 'Alta velocidade' : 'Básico'
              },
              cancellation: {
                allowed: true,
                fee: Math.round(flight.price * 0.25),
                changeAllowed: true,
                changeFee: Math.round(flight.price * 0.2),
                deadline: '24 horas antes do voo'
              },
              stops: flight.stops === 0 ? [] : Array.from({ length: flight.stops }, (_, i) => ({
                airport: ['GRU', 'BSB', 'CNF', 'GIG'][i % 4],
                duration: Math.floor(Math.random() * 30) + 30,
                waitTime: Math.floor(Math.random() * 90) + 60
              }))
            };
          });
          
          results.push({
            provider: 'Gol',
            flights
          });
        })
        .catch(err => {
          console.error('Erro na Gol:', err);
          errors.push({ provider: 'Gol', error: err.message });
        })
    ];
    
    // Aguardar todas as buscas
    await Promise.all(searchPromises);
    
    // Enviar resposta completa
    res.json({
      results,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (err) {
    console.error('Erro geral na busca:', err);
    res.status(500).json({ 
      error: 'Falha ao buscar voos',
      details: err.message
    });
  }
});

// Endpoint para busca por menor preço em um período
app.get('/api/best-prices', async (req, res) => {
  const { origin, destination, startMonth, endMonth, tripDuration = 7, adults = 1, children = 0 } = req.query;
  
  // Converter para números
  const numAdults = parseInt(adults) || 1;
  const numChildren = parseInt(children) || 0;
  const totalPassengers = numAdults + numChildren;
  const numTripDuration = parseInt(tripDuration) || 7;
  
  try {
    console.log(`Busca de melhores preços: ${origin} → ${destination}, Período: ${startMonth} a ${endMonth}, Passageiros: ${numAdults} adultos, ${numChildren} crianças`);
    
    // Validar permissões antes de buscar dados
    await validatePermissions();
    
    // Extrair ano e mês inicial
    const [startYear, startMonthNum] = startMonth.split('-').map(Number);
    
    // Extrair ano e mês final
    const [endYear, endMonthNum] = endMonth.split('-').map(Number);
    
    // Calcular número total de meses no intervalo
    const totalMonths = (endYear - startYear) * 12 + (endMonthNum - startMonthNum) + 1;
    
    // Limitar a no máximo 12 meses para evitar sobrecarga
    const monthsToCheck = Math.min(totalMonths, 12);
    
    // Gerar datas para verificar
    const datesToCheck = [];
    let currentDate = new Date(startYear, startMonthNum - 1, 1);
    
    for (let i = 0; i < monthsToCheck; i++) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // Adicionar 10 dias aleatórios deste mês
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      for (let j = 0; j < 10; j++) {
        const day = Math.floor(Math.random() * daysInMonth) + 1;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Evitar datas duplicadas
        if (!datesToCheck.includes(dateStr)) {
          datesToCheck.push(dateStr);
        }
      }
      
      // Avançar para o próximo mês
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // Buscar preços para todas as combinações de ida e volta respeitando a duração da viagem
    const tripCombinations = [];
    
    // Gerar todas as combinações possíveis de ida e volta com a duração especificada
    for (const departureDate of datesToCheck) {
      const departDate = new Date(departureDate);
      const returnDate = new Date(departDate);
      returnDate.setDate(returnDate.getDate() + numTripDuration);
      const returnDateStr = returnDate.toISOString().split('T')[0];
      
      // Verificar se a data de retorno ainda está dentro do período selecionado
      const returnMonth = returnDate.getFullYear() + '-' + String(returnDate.getMonth() + 1).padStart(2, '0');
      const isReturnDateInRange = returnMonth <= endMonth;
      
      if (isReturnDateInRange) {
        tripCombinations.push({
          departureDate,
          returnDate: returnDateStr
        });
      }
    }
    
    console.log(`Geradas ${tripCombinations.length} combinações possíveis de ida e volta com duração de ${numTripDuration} dias`);
    
    // Buscar preços para todas as combinações em paralelo usando APIs reais
    const pricePromises = tripCombinations.map(async combo => {
      // Buscar em provedores reais
      const providers = [
        searchSkyscanner(origin, destination, combo.departureDate, combo.returnDate, numAdults, numChildren),
        searchKayak(origin, destination, combo.departureDate, combo.returnDate, numAdults, numChildren),
        searchDecolar(origin, destination, combo.departureDate, combo.returnDate, numAdults, numChildren)
      ];
      
      try {
        // Obter resultados de pelo menos um provedor
        const results = await Promise.any(providers);
        
        // Encontrar o voo mais barato para esta combinação
        const cheapestFlight = results.reduce((cheapest, flight) => 
          flight.price < cheapest.price ? flight : cheapest, 
          { price: Infinity }
        );
        
        // Retornar dados da combinação e preço do voo mais barato, incluindo número do voo
        return { 
          departureDate: combo.departureDate,
          returnDate: combo.returnDate,
          price: cheapestFlight.price,
          flightNumber: cheapestFlight.details?.flightNumber || `${cheapestFlight.provider.substring(0,2).toUpperCase()}${cheapestFlight.id || ''}`,
          provider: cheapestFlight.provider,
          tripDuration: numTripDuration
        };
      } catch (error) {
        // Se todas as buscas falharem, propagar o erro para ser tratado pelo chamador
        console.error(`Erro ao buscar preços para ${combo.departureDate} - ${combo.returnDate}:`, error);
        throw new Error(`Não foi possível obter dados reais para o período ${combo.departureDate} - ${combo.returnDate}`);
      }
    });
    
    // Aguardar todos os resultados
    const prices = await Promise.all(pricePromises);
    
    // Ordenar por preço (do mais barato para o mais caro)
    prices.sort((a, b) => a.price - b.price);
    
    // Pegar os 10 melhores preços
    const bestPrices = prices.slice(0, 10).map(item => {
      // Formatar datas para exibição
      const departDate = new Date(item.departureDate);
      const returnDate = new Date(item.returnDate);
      
      const formattedDepartureDate = departDate.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      
      const formattedReturnDate = returnDate.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      
      return {
        ...item,
        formattedDepartureDate,
        formattedReturnDate,
        totalPrice: item.price // Preço total da viagem (ida + volta)
      };
    });
    
    // Enviar resposta
    res.json({
      bestPrices,
      origin,
      destination,
      period: `${startMonth} a ${endMonth}`
    });
    
  } catch (err) {
    console.error('Erro na busca por melhores preços:', err);
    res.status(500).json({ 
      error: 'Falha ao buscar melhores preços',
      details: err.message
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on 0.0.0.0:${PORT}`));
