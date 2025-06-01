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
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint para busca de voos
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
  const { origin, destination, startMonth, endMonth, adults = 1, children = 0 } = req.query;
  
  // Converter para números
  const numAdults = parseInt(adults) || 1;
  const numChildren = parseInt(children) || 0;
  const totalPassengers = numAdults + numChildren;
  
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
    
    // Buscar preços para todas as datas em paralelo
    const pricePromises = datesToCheck.map(date => 
      simulatePriceForDate(origin, destination, date, numAdults, numChildren)
        .then(price => ({ date, price }))
    );
    
    // Aguardar todos os resultados
    const prices = await Promise.all(pricePromises);
    
    // Ordenar por preço (do mais barato para o mais caro)
    prices.sort((a, b) => a.price - b.price);
    
    // Pegar os 10 melhores preços
    const bestPrices = prices.slice(0, 10).map(item => {
      // Formatar data para exibição
      const date = new Date(item.date);
      const formattedDate = date.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      
      return {
        ...item,
        formattedDate
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
