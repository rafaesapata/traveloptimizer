const { useState, useEffect, useRef } = React;

// Componente de Skeleton Loader para linhas de voo
function SkeletonRow({ colSpan }) {
  return React.createElement('tr', { className: 'skeleton-row' },
    React.createElement('td', { colSpan: colSpan },
      React.createElement('div', { className: 'skeleton-pulse' })
    )
  );
}

// Componente para detalhes expandidos do voo
function FlightDetails({ flight }) {
  if (!flight || !flight.details) return null;
  
  const { details } = flight;
  
  return React.createElement('div', { className: 'flight-details' },
    // Banner de busca inteligente (se aplicável)
    flight.isSmartCombo && React.createElement('div', { className: 'smart-combo-banner' },
      React.createElement('div', { className: 'smart-combo-banner-icon' }, '🔥'),
      React.createElement('div', { className: 'smart-combo-banner-content' },
        React.createElement('h3', null, 'Bilhetes Separados - Busca Inteligente'),
        React.createElement('p', null, 
          `Economize ${Math.round(flight.smartComboSavingsPercent)}% (${currency === 'USD' ? '$' : 'R$'}${currency === 'USD' ? flight.smartComboSavings.toFixed(2) : Math.round(flight.smartComboSavings * 5.2).toLocaleString()}) comprando bilhetes separados em vez da rota direta.`
        ),
        React.createElement('p', { className: 'smart-combo-banner-note' }, 
          'Nota: Você precisará fazer reservas separadas para cada trecho desta combinação.'
        )
      )
    ),
    // Informações básicas
    React.createElement('div', { className: 'details-section' },
      React.createElement('h4', null, 'Informações do Voo'),
      React.createElement('div', { className: 'details-grid' },
        React.createElement('div', null, 
          React.createElement('strong', null, 'Aeronave: '),
          React.createElement('span', { className: 'aircraft-model' }, details.aircraft)
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Modelo: '),
          React.createElement('span', { className: 'aircraft-type' }, details.aircraftType || 'Boeing 737/Airbus A320')
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Fabricante: '),
          React.createElement('span', { className: 'manufacturer' }, details.manufacturer || (details.aircraft && details.aircraft.includes('Boeing') ? 'Boeing' : 'Airbus'))
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Partida: '),
          React.createElement('span', { className: 'departure-info' }, `${details.departureTime} (${details.departureAirport})`)
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Chegada: '),
          React.createElement('span', { className: 'arrival-info' }, `${details.arrivalTime} (${details.arrivalAirport})`)
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Terminal Partida: '),
          React.createElement('span', { className: 'terminal-info' }, details.departureTerminal || 'Principal')
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Terminal Chegada: '),
          React.createElement('span', { className: 'terminal-info' }, details.arrivalTerminal || 'Principal')
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Número do Voo: '),
          React.createElement('span', { className: 'flight-number' }, details.flightNumber || `${flight.provider.substring(0,2).toUpperCase()}${Math.floor(Math.random() * 1000) + 1000}`)
        )
      )
    ),
    
    // Paradas (se houver)
    details.stops && details.stops.length > 0 && React.createElement('div', { className: 'details-section' },
      React.createElement('h4', null, 'Escalas'),
      React.createElement('ul', { className: 'stops-list' },
        details.stops.map((stop, i) => 
          React.createElement('li', { key: i },
            `${stop.airport} - Duração: ${stop.duration} min, Espera: ${stop.waitTime} min`
          )
        )
      )
    ),
    
    // Bagagem
    React.createElement('div', { className: 'details-section' },
      React.createElement('h4', null, 'Bagagem'),
      React.createElement('div', { className: 'details-grid' },
        React.createElement('div', null, 
          React.createElement('strong', null, 'Bagagem incluída: '),
          React.createElement('span', { className: 'baggage-included' }, details.baggage.included ? 'Sim' : 'Não')
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Bagagem de mão: '),
          React.createElement('span', { className: 'baggage-carry-on' }, details.baggage.carryOn)
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Bagagem despachada: '),
          React.createElement('span', { className: 'baggage-checked' }, details.baggage.checked)
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Peso máximo: '),
          React.createElement('span', { className: 'baggage-weight' }, details.baggage.maxWeight || '23kg por volume')
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Dimensões máximas: '),
          React.createElement('span', { className: 'baggage-dimensions' }, details.baggage.dimensions || '158cm (A+L+C)')
        )
      )
    ),
    
    // Serviços a bordo
    React.createElement('div', { className: 'details-section' },
      React.createElement('h4', null, 'Serviços a Bordo'),
      React.createElement('div', { className: 'details-grid' },
        React.createElement('div', null, 
          React.createElement('strong', null, 'Refeição: '),
          React.createElement('span', { className: 'service-meal' }, details.services.meal ? 'Sim' : 'Não')
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Wi-Fi: '),
          React.createElement('span', { className: 'service-wifi' }, details.services.wifi ? 'Sim' : 'Não')
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Entretenimento: '),
          React.createElement('span', { className: 'service-entertainment' }, details.services.entertainment ? 'Sim' : 'Não')
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Tomadas: '),
          React.createElement('span', { className: 'service-power' }, details.services.powerOutlets || (details.services.entertainment ? 'Sim' : 'Não'))
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Tipo de Refeição: '),
          React.createElement('span', { className: 'meal-type' }, details.services.mealType || (details.services.meal ? 'Refeição completa' : 'Lanches'))
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Velocidade Wi-Fi: '),
          React.createElement('span', { className: 'wifi-speed' }, details.services.wifiSpeed || (details.services.wifi ? 'Padrão' : 'N/A'))
        )
      )
    ),
    
    // Políticas
    React.createElement('div', { className: 'details-section' },
      React.createElement('h4', null, 'Políticas'),
      React.createElement('div', { className: 'details-grid' },
        React.createElement('div', null, 
          React.createElement('strong', null, 'Cancelamento permitido: '),
          React.createElement('span', { className: 'cancellation-allowed' }, details.cancellation.allowed ? 'Sim' : 'Não')
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Taxa de cancelamento: '),
          React.createElement('span', { className: 'cancellation-fee' }, `$${details.cancellation.fee}`)
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Alteração permitida: '),
          React.createElement('span', { className: 'change-allowed' }, details.cancellation.changeAllowed || 'Sim (com taxa)')
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Taxa de alteração: '),
          React.createElement('span', { className: 'change-fee' }, details.cancellation.changeFee || `$${Math.round(details.cancellation.fee * 0.7)}`)
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Prazo para cancelamento: '),
          React.createElement('span', { className: 'cancellation-deadline' }, details.cancellation.deadline || '24 horas antes do voo')
        )
      )
    ),
    
    // Informações de Busca Inteligente (se aplicável)
    flight.isSmartCombo && React.createElement('div', { className: 'details-section smart-combo-details' },
      React.createElement('h4', null, 'Detalhes da Busca Inteligente'),
      React.createElement('div', { className: 'smart-combo-info' },
        React.createElement('p', null, 
          React.createElement('strong', null, 'Economia: '),
          React.createElement('span', { className: 'savings-amount' }, `$${flight.smartComboSavings.toFixed(2)} (${Math.round(flight.smartComboSavingsPercent)}%)`)
        ),
        React.createElement('div', { className: 'combo-segments' },
          React.createElement('p', null, 'Segmentos:'),
          React.createElement('ol', { className: 'segments-list' },
            flight.segments.map((segment, i) => 
              React.createElement('li', { key: i, className: 'segment-item' },
                React.createElement('div', { className: 'segment-details' },
                  React.createElement('span', { className: 'segment-route' }, `${segment.origin} → ${segment.destination}`),
                  React.createElement('span', { className: 'segment-provider' }, `(${segment.provider})`),
                  React.createElement('span', { className: 'segment-price' }, `$${segment.price}`),
                  React.createElement('span', { className: 'segment-duration' }, `${segment.duration}h`)
                )
              )
            )
          ),
          React.createElement('p', { className: 'booking-instructions' }, 
            React.createElement('strong', null, 'Instruções de reserva: '),
            'Reserve cada segmento separadamente para obter esta economia.'
          )
        )
      )
    )
  );
}

// Componente para resultados de um provedor
function ProviderResults({ providerData, useMiles, sortKey, filterStops, filterCabin, onSelectFlight, selectedFlightId, isSmartCombo }) {
  if (!providerData || !providerData.flights) return null;
  
  const { provider, flights } = providerData;
  
  // Filtrar e ordenar voos deste provedor
  const filteredFlights = flights
    .filter(f => (filterStops === '' || f.stops === Number(filterStops)) && 
                (filterCabin === '' || f.category.toLowerCase().includes(filterCabin.toLowerCase())))
        .sort((a, b) => {
      // Sempre ordenar por preço primeiro, independente do sortKey selecionado
      if (true) {
        const aValue = useMiles ? a.milesPrice : a.price;
        const bValue = useMiles ? b.milesPrice : b.price;
        return aValue - bValue;
      }
      
      const aValue = useMiles && sortKey === 'price' ? a.milesPrice : a[sortKey];
      const bValue = useMiles && sortKey === 'price' ? b.milesPrice : b[sortKey];

      if (sortKey === 'price' || sortKey === 'milesPrice') {
        return aValue - bValue;
      }
      return aValue > bValue ? 1 : -1;
    });
  
  if (filteredFlights.length === 0) return null;
  
  return React.createElement(React.Fragment, null,
    // Cabeçalho do provedor
    React.createElement('tr', { 
      className: `provider-header ${isSmartCombo ? 'smart-combo-header' : ''}` 
    },
      React.createElement('th', { colSpan: '8' }, 
        isSmartCombo ? 'Busca Inteligente - Combinações Econômicas' : provider
      )
    ),
    
    // Linhas de voos
    filteredFlights.map((flight, i) => {
      const isSelected = selectedFlightId === `${provider}-${i}${isSmartCombo ? '-smart' : ''}`;
      
      return React.createElement(React.Fragment, { key: i },
        React.createElement('tr', { 
          className: `${isSelected ? 'selected-flight' : ''} ${isSmartCombo ? 'smart-combo-row' : ''}`,
          onClick: () => onSelectFlight(isSelected ? null : `${provider}-${i}${isSmartCombo ? '-smart' : ''}`, flight)
        },
          React.createElement('td', null, 
            isSmartCombo ? 
              React.createElement('div', { className: 'smart-combo-label' },
                React.createElement('span', { className: 'smart-icon' }, '💡'),
                'Combo Inteligente'
              ) : 
              React.createElement('div', { className: 'airline-logo' },
                React.createElement('span', { className: 'airline-icon', dangerouslySetInnerHTML: { __html: getAirlineIcon(flight.provider) } }),
                React.createElement('span', { className: 'airline-name' }, flight.provider)
              )
          ),
          React.createElement('td', null, 
            React.createElement('div', { className: 'price-display dual-price' },
              // Exibição do preço em moeda (sempre visível)
              React.createElement('div', { className: 'price-currency' },
                React.createElement('span', { className: 'price-value' }, 
                  currency === 'USD' ? 
                    `$${flight.price}` : 
                    `R$${Math.round(flight.price * 5.2).toLocaleString()}`
                )
              ),
              // Exibição do preço em milhas (sempre visível)
              React.createElement('div', { className: 'price-miles' },
                React.createElement('span', { className: 'price-value' }, flight.milesPrice.toLocaleString()),
                React.createElement('span', { className: 'price-unit' }, 'milhas')
              ),
              // Informação de economia para combos inteligentes
              isSmartCombo && React.createElement('div', { className: 'smart-combo-info' },
                React.createElement('span', { className: 'price-tag' }, '🔥'),
                React.createElement('span', { className: 'smart-combo-savings' }, `Economia de ${Math.round(flight.smartComboSavingsPercent)}%`)
              )
            )
          ),
          React.createElement('td', null, 
            React.createElement('div', { className: 'flight-times' },
              React.createElement('div', { className: 'time-block departure' },
                React.createElement('span', { className: 'time' }, flight.details.departureTime),
                React.createElement('span', { className: 'airport' }, flight.details.departureAirport)
              ),
              React.createElement('div', { className: 'time-connector' },
                React.createElement('div', { className: 'connector-line' }),
                flight.stops > 0 && 
                  React.createElement('div', { className: 'stops-indicator' },
                    React.createElement('span', { className: 'stops-dot' }),
                    flight.stops > 1 && React.createElement('span', { className: 'stops-dot' }),
                    flight.stops > 2 && React.createElement('span', { className: 'stops-dot' })
                  )
              ),
              React.createElement('div', { className: 'time-block arrival' },
                React.createElement('span', { className: 'time' }, flight.details.arrivalTime),
                React.createElement('span', { className: 'airport' }, flight.details.arrivalAirport)
              )
            )
          ),
          React.createElement('td', null, 
            React.createElement('div', { 
              className: 'stops-badge',
              onClick: (e) => {
                e.stopPropagation(); // Evita que o clique propague para a linha inteira
                if (flight.stops > 0 && flight.details.stops) {
                  // Lógica para mostrar tooltip de paradas
                  const existingTooltip = document.querySelector('.stops-tooltip');
                  if (existingTooltip) {
                    document.body.removeChild(existingTooltip);
                  }
                  
                  const tooltip = document.createElement('div');
                  tooltip.className = 'stops-tooltip';
                  
                  const header = document.createElement('div');
                  header.className = 'tooltip-header';
                  header.textContent = `${flight.stops} ${flight.stops === 1 ? 'Parada' : 'Paradas'}`;
                  tooltip.appendChild(header);
                  
                  const list = document.createElement('ul');
                  list.className = 'tooltip-stops-list';
                  
                  flight.details.stops.forEach(stop => {
                    const item = document.createElement('li');
                    item.className = 'tooltip-stop-item';
                    
                    const airport = document.createElement('div');
                    airport.className = 'tooltip-airport';
                    airport.textContent = stop.airport;
                    
                    const duration = document.createElement('div');
                    duration.className = 'tooltip-duration';
                    duration.textContent = `Espera: ${stop.waitTime} min`;
                    
                    item.appendChild(airport);
                    item.appendChild(duration);
                    list.appendChild(item);
                  });
                  
                  tooltip.appendChild(list);
                  
                  const closeBtn = document.createElement('button');
                  closeBtn.className = 'tooltip-close';
                  closeBtn.textContent = '×';
                  closeBtn.onclick = () => document.body.removeChild(tooltip);
                  tooltip.appendChild(closeBtn);
                  
                  // Posicionar o tooltip
                  document.body.appendChild(tooltip);
                  const rect = e.target.getBoundingClientRect();
                  tooltip.style.position = 'absolute';
                  tooltip.style.left = `${rect.left + window.scrollX}px`;
                  tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
                  
                  // Fechar ao clicar fora
                  document.addEventListener('click', function closeTooltip(event) {
                    if (!tooltip.contains(event.target) && event.target !== e.target) {
                      document.body.removeChild(tooltip);
                      document.removeEventListener('click', closeTooltip);
                    }
                  });
                }
              }
            }, 
            flight.stops === 0 ? 'Direto' : `${flight.stops} ${flight.stops === 1 ? 'parada' : 'paradas'}`
          )),
          React.createElement('td', null, `${flight.duration}h`),
          React.createElement('td', null, flight.category),
          React.createElement('td', null, flight.departureDate),
          React.createElement('td', null, flight.returnDate)
        ),
        isSelected && React.createElement('tr', { className: 'details-row' },
          React.createElement('td', { colSpan: '8' },
            React.createElement(FlightDetails, { flight })
          )
        )
      );
    })
  );
}

// Componente para resultados de busca por período (melhores preços)
function PeriodResults({ results, origin, destination, onSelectDate }) {
  if (!results || results.length === 0) return null;
  
  return React.createElement('div', { className: 'period-results' },
    React.createElement('h3', { className: 'period-results-title' }, 
      `10 Melhores Preços: ${origin} → ${destination}`
    ),
    React.createElement('div', { className: 'best-prices-grid' },
      results.map((result, index) => 
        React.createElement('div', { 
          key: index, 
          className: 'best-price-card',
          onClick: () => onSelectDate(result.departureDate || result.date, result.returnDate)
        },
          React.createElement('div', { className: 'price-card-header' }, 
            React.createElement('span', { className: 'price-rank' }, `#${index + 1}`),
            React.createElement('span', { className: 'price-value' }, `$${result.price}`)
          ),
          React.createElement('div', { className: 'price-card-dates' },
            React.createElement('div', { className: 'price-card-departure' },
              React.createElement('span', { className: 'date-label' }, 'Ida:'),
              React.createElement('span', { className: 'date-value' }, result.formattedDepartureDate || result.formattedDate)
            ),
            result.formattedReturnDate && React.createElement('div', { className: 'price-card-return' },
              React.createElement('span', { className: 'date-label' }, 'Volta:'),
              React.createElement('span', { className: 'date-value' }, result.formattedReturnDate)
            )
          ),
          React.createElement('div', { className: 'price-card-details' },
            result.tripDuration && React.createElement('div', { className: 'price-card-duration' }, 
              `${result.tripDuration} dias de viagem`
            ),
            result.flightNumber && React.createElement('div', { className: 'price-card-flight' }, 
              `Voo: ${result.flightNumber}`
            ),
            result.provider && React.createElement('div', { className: 'price-card-provider' }, 
              `${result.provider}`
            )
          ),
          React.createElement('button', { className: 'select-date-button' }, 'Selecionar')
        )
      )
    )
  );
}

// Funções auxiliares
function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function getNextWeekDate() {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  return nextWeek.toISOString().split('T')[0];
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthAfter(months) {
  const future = new Date();
  future.setMonth(future.getMonth() + months);
  return `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthName(monthStr) {
  cofunction App() {
  // Estados para formulário de busca
  const [origin, setOrigin] = useState('MGF');
  const [destination, setDestination] = useState('MCO');
  const [departureDate, setDepartureDate] = useState(getTomorrowDate());
  const [returnDate, setReturnDate] = useState(getNextWeekDate());
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [useMiles, setUseMiles] = useState(true); // Busca por milhas ativada por padrão
  const [useSmartSearch, setUseSmartSearch] = useState(false);
  
  // Estados para busca por período
  const [usePeriodSearch, setUsePeriodSearch] = useState(false);
  const [startMonth, setStartMonth] = useState(getCurrentMonth());
  const [endMonth, setEndMonth] = useState(getNextMonth());
  const [tripDuration, setTripDuration] = useState(7);
  const [periodResults, setPeriodResults] = useState([]);
  
  // Estados para resultados
  const [providerResults, setProviderResults] = useState([]);
  const [smartComboResults, setSmartComboResults] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState({});
  const [error, setError] = useState(null);
  
  // Estados para filtros e ordenação
  const [filterStops, setFilterStops] = useState('');
  const [filterCabin, setFilterCabin] = useState('');
  const [sortKey, setSortKey] = useState('price');
  const [currency, setCurrency] = useState('USD');
  
  // Estado para voo selecionado
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  
  // Lista de todos os provedores para skeleton loaders
  const allProviders = [
    'Skyscanner', 'Kayak', 'Decolar', 'Copa Airlines', 'Azul', 'Latam', 'Gol'
  ];
  
  // Lista de tipos de cabine para filtro
  const cabinTypes = [
    '', 'Economy', 'Economy Plus', 'Premium Economy', 'Business', 'First', 'Premium'
  ];
  
  // Verificar se algum provedor ainda está carregando
  const isLoading = Object.values(loadingProviders).some(loading => loading);
  
  // Função para gerar combinações inteligentes
  const generateSmartCombinations = (results) => {
    if (!results || results.length < 2) return;
    
    // Extrair todos os voos de todos os provedores
    const allFlights = results.flatMap(r => r.flights);
    
    // Encontrar combinações mais baratas
    const combinations = [];
    
    // Simular algumas combinações inteligentes
    for (let i = 0; i < 3; i++) {
      // Selecionar dois voos aleatórios para simular uma combinação
      const flight1 = allFlights[Math.floor(Math.random() * allFlights.length)];
      const flight2 = allFlights[Math.floor(Math.random() * allFlights.length)];
      
      if (!flight1 || !flight2) continue;
      
      // Calcular preço direto (simulado)
      const directPrice = Math.round((flight1.price + flight2.price) * 1.2);
      
      // Calcular economia
      const comboPrice = flight1.price + flight2.price;
      const savings = directPrice - comboPrice;
      const savingsPercent = (savings / directPrice) * 100;
      
      // Criar combinação inteligente
      combinations.push({
        id: `combo-${i}`,
        provider: 'Combo Inteligente',
        origin: flight1.origin,
        destination: flight2.destination,
        price: comboPrice,
        milesPrice: Math.round(comboPrice * 60),
        stops: flight1.stops + flight2.stops + 1,
        duration: flight1.duration + flight2.duration + 2,
        category: flight1.category,
        departureDate: flight1.departureDate,
        returnDate: flight2.returnDate,
        isSmartCombo: true,
        smartComboSavings: savings,
        smartComboSavingsPercent: savingsPercent,
        segments: [
          {
            origin: flight1.origin,
            destination: flight1.destination,
            provider: flight1.provider,
            price: flight1.price,
            duration: flight1.duration
          },
          {
            origin: flight2.origin,
            destination: flight2.destination,
            provider: flight2.provider,
            price: flight2.price,
            duration: flight2.duration
          }
        ],
        details: {
          aircraft: flight1.details.aircraft,
          departureTime: flight1.details.departureTime,
          arrivalTime: flight2.details.arrivalTime,
          departureAirport: flight1.details.departureAirport,
          arrivalAirport: flight2.details.arrivalAirport,
          baggage: flight1.details.baggage,
          services: flight1.details.services,
          cancellation: flight1.details.cancellation,
          stops: [
            ...flight1.details.stops,
            {
              airport: flight1.destination,
              duration: 0,
              waitTime: 120
            },
            ...flight2.details.stops
          ]
        }
      });
    }
    
    // Atualizar estado com as combinações inteligentes
    setSmartComboResults(combinations);
  };
  
  // Função para selecionar uma data dos resultados de período
  const handleSelectDate = (date) => {
    setDepartureDate(date);
    setUsePeriodSearch(false);
    
    // Calcular data de retorno (7 dias após a ida)
    const returnDate = new Date(date);
    returnDate.setDate(returnDate.getDate() + 7);
    setReturnDate(returnDate.toISOString().split('T')[0]);
  };

  // Função para buscar voos
  const handleSearch = async () => {
    setError(null);
    setProviderResults([]);
    setSmartComboResults([]);
    setPeriodResults([]);
    
    // Iniciar loading para todos os provedores
    const initialLoadingState = {};
    allProviders.forEach(provider => {
      initialLoadingState[provider] = true;
    });
    setLoadingProviders(initialLoadingState);
    
    try {
      if (usePeriodSearch) {
        // Busca por menor preço em um período
        const searchParams = new URLSearchParams({
          origin,
          destination,
          startMonth,
          endMonth,
          adults: adults.toString(),
          children: children.toString()
        });
        
        // Fazer requisição para a API de melhores preços
        const response = await fetch(`/api/best-prices?${searchParams.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Erro na busca: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Processar resultados do período
        setPeriodResults(data.bestPrices || []);
        
      } else {
        // Busca normal por datas específicas
        const searchParams = new URLSearchParams({
          origin,
          destination,
          departureDate,
          returnDate,
          adults: adults.toString(),
          children: children.toString()
        });
        
        // Fazer requisição para a API
        const response = await fetch(`/api/flights?${searchParams.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Erro na busca: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Processar resultados
        setProviderResults(data.results || []);
        
        // Se busca inteligente estiver ativada, gerar combinações
        if (useSmartSearch) {
          generateSmartCombinations(data.results);
        }
      }
      
      // Limpar loading
      setLoadingProviders({});
      
    } catch (err) {
      console.error('Erro ao buscar voos:', err);
      setError(err.message);
      setLoadingProviders({});
    }
  };

  // Função para selecionar um voo e mostrar detalhes
  const handleSelectFlight = (id, flight) => {
    setSelectedFlightId(id);
    setSelectedFlight(id ? flight : null);
  };

  // Formulário de busca
  const searchForm = React.createElement('div', { className: 'search-form' },
    // Modo de busca
    React.createElement('div', { className: 'search-mode-selector' },
      React.createElement('div', { 
        className: `search-mode-option ${!usePeriodSearch ? 'active' : ''}`,
        onClick: () => {
          setUsePeriodSearch(false);
        }
      }, 'Busca por Datas'),
      React.createElement('div', { 
        className: `search-mode-option ${usePeriodSearch ? 'active' : ''}`,
        onClick: () => {
          setUsePeriodSearch(true);
        }
      }, 'Busca por Período (Menor Preço)')
    ),
    
    // Formulário de busca padrão (por datas específicas)
    !usePeriodSearch && R    // Formulário de busca normal (datas específicas)
    !usePeriodSearch && React.createElement('div', { className: 'form-row' },
      React.createElement(AirportAutocomplete, {
        id: 'origin',
        label: 'Origem',
        value: origin,
        onChange: setOrigin,
        placeholder: 'Ex: MGF ou Maringá'
      }),
      React.createElement(AirportAutocomplete, {
        id: 'destination',
        label: 'Destino',
        value: destination,
        onChange: setDestination,
        placeholder: 'Ex: MCO ou Orlando'
      }),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'departureDate' }, 'Data de Ida'),
          React.createElement('input', {
            id: 'departureDate',
            type: 'date',
            value: departureDate,
            onChange: e => setDepartureDate(e.target.value)
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'returnDate' }, 'Data de Volta'),
          React.createElement('input', {
            id: 'returnDate',
            type: 'date',
            value: returnDate,
            onChange: e => setReturnDate(e.target.value)
          })
        )
      ),
      React.createElement('div', { className: 'form-row passengers-row' },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'adults' }, 'Adultos'),
          React.createElement('div', { className: 'number-input' },
            React.createElement('button', { 
              type: 'button',
              className: 'decrement',
              onClick: () => setAdults(prev => Math.max(1, prev - 1)),
              disabled: adults <= 1
            }, '-'),
            React.createElement('input', {
              id: 'adults',
              type: 'number',
              min: '1',
              max: '9',
              value: adults,
              onChange: e => setAdults(Math.min(9, Math.max(1, parseInt(e.target.value) || 1)))
            }),
            React.createElement('button', { 
              type: 'button',
              className: 'increment',
              onClick: () => setAdults(prev => Math.min(9, prev + 1)),
              disabled: adults >= 9
            }, '+')
          )
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'children' }, 'Crianças'),
          React.createElement('div', { className: 'number-input' },
            React.createElement('button', { 
              type: 'button',
              className: 'decrement',
              onClick: () => setChildren(prev => Math.max(0, prev - 1)),
              disabled: children <= 0
            }, '-'),
            React.createElement('input', {
              id: 'children',
              type: 'number',
              min: '0',
              max: '8',
              value: children,
              onChange: e => setChildren(Math.min(8, Math.max(0, parseInt(e.target.value) || 0)))
            }),
            React.createElement('button', { 
              type: 'button',
              className: 'increment',
              onClick: () => setChildren(prev => Math.min(8, prev + 1)),
              disabled: children >= 8
            }, '+')
          )
        ),
        React.createElement('div', { className: 'form-group passenger-info' },
          React.createElement('span', { className: 'passenger-count' }, 
            `${adults + children} ${adults + children === 1 ? 'passageiro' : 'passageiros'}`
          ),
          React.createElement('span', { className: 'passenger-details' }, 
            `(${adults} ${adults === 1 ? 'adulto' : 'adultos'}${children > 0 ? `, ${children} ${children === 1 ? 'criança' : 'crianças'}` : ''})`
          )
        )
      )
    ),
    
    // Formulário de busca por período (menor preço)
    usePeriodSearch && React.createElement('div', null,
      React.createElement('div', { className: 'form-row' },
        React.createElement(AirportAutocomplete, {
          id: 'origin-period',
          label: 'Origem',
          value: origin,
          onChange: setOrigin,
          placeholder: 'Ex: MGF ou Maringá'
        }),
        React.createElement(AirportAutocomplete, {
          id: 'destination-period',
          label: 'Destino',
          value: destination,
          onChange: setDestination,
          placeholder: 'Ex: MCO ou Orlando'
        })
      ),
      React.createElement('div', { className: 'form-row' },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'startMonth' }, 'Mês Inicial'),
          React.createElement('input', {
            id: 'startMonth',
            type: 'month',
            value: startMonth,
            onChange: e => setStartMonth(e.target.value),
            min: getCurrentMonth()
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'endMonth' }, 'Mês Final'),
          React.createElement('input', {
            id: 'endMonth',
            type: 'month',
            value: endMonth,
            onChange: e => setEndMonth(e.target.value),
            min: startMonth
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'tripDuration' }, 'Duração da Viagem (dias)'),
          React.createElement('div', { className: 'number-input' },
            React.createElement('button', { 
              type: 'button',
              className: 'decrement',
              onClick: () => setTripDuration(prev => Math.max(1, prev - 1)),
              disabled: tripDuration <= 1
            }, '-'),
            React.createElement('input', {
              id: 'tripDuration',
              type: 'number',
              min: '1',
              max: '30',
              value: tripDuration,
              onChange: e => setTripDuration(Math.min(30, Math.max(1, parseInt(e.target.value) || 7)))
            }),
            React.createElement('button', { 
              type: 'button',
              className: 'increment',
              onClick: () => setTripDuration(prev => Math.min(30, prev + 1)),
              disabled: tripDuration >= 30
            }, '+')
          )
        )
      )
    ),
        // Opções de busca (visíveis apenas no modo de busca por datas)
    !usePeriodSearch && React.createElement('div', { className: 'checkbox-container' },
      React.createElement('div', { className: 'checkbox-group' },
        React.createElement('label', { className: 'checkbox-label' },
          React.createElement('input', {
            type: 'checkbox',
            checked: useSmartSearch,
            onChange: e => setUseSmartSearch(e.target.checked)
          }),
          'Busca Inteligente'
        )
      )
    ),
    
    // Informação sobre a busca por período
    usePeriodSearch && React.createElement('div', { className: 'period-search-info' },
      React.createElement('p', null, 
        `Buscando os 10 períodos de ${tripDuration} dias com passagens mais baratas entre ${getMonthName(startMonth)} e ${getMonthName(endMonth)}`
      )
    ),
    
    // Botão de busca
    React.createElement('button', {
      className: 'search-button',
      onClick: handleSearch,
      disabled: isLoading
    }, isLoading ? 'Buscando...' : usePeriodSearch ? 'Buscar Melhores Preços' : 'Buscar Voos')
  );
  
  // Resultados da busca
  const searchResults = React.createElement('div', { className: 'search-results' },
    // Mensagem de erro
    error && React.createElement('div', { 
      className: 'error-message'
    }, error),
    
    // Resultados da busca por período
    usePeriodSearch && periodResults.length > 0 && 
      React.createElement(PeriodResults, { 
        results: periodResults,
        origin,
        destination,
        onSelectDate: handleSelectDate
      }),
    
    // Filtros (apenas para busca normal)
    !usePeriodSearch && (providerResults.length > 0 || isLoading) && 
      React.createElement('div', { className: 'filter-bar' },
        React.createElement('div', { className: 'form-group filter-input' },
          React.createElement('label', null, 'Filtrar por paradas'),
          React.createElement('input', {
            type: 'number',
            min: '0',
            placeholder: 'Número de paradas',
            value: filterStops,
            onChange: e => setFilterStops(e.target.value)
          })
        ),
        React.createElement('div', { className: 'form-group filter-select' },
          React.createElement('label', null, 'Filtrar por cabine'),
          React.createElement('select', {
            value: filterCabin,
            onChange: e => setFilterCabin(e.target.value)
          },
            cabinTypes.map((type, i) => 
              React.createElement('option', { key: i, value: type }, 
                type || 'Todas as classes'
              )
            )
          )
        ),
        React.createElement('div', { className: 'form-group filter-select' },
          React.createElement('label', null, 'Ordenar por'),
          React.createElement('select', {
            value: sortKey,
            onChange: e => setSortKey(e.target.value)
          },
            [
              { value: 'price', label: 'Preço' },
              { value: 'duration', label: 'Tempo de voo' },
              { value: 'stops', label: 'Número de paradas' },
              { value: 'category', label: 'Classe' },
              { value: 'provider', label: 'Companhia aérea' }
            ].map((option, i) => 
              React.createElement('option', { key: i, value: option.value }, option.label)
            )
          )
        ),
        React.createElement('div', { className: 'form-group filter-select' },
          React.createElement('label', null, 'Moeda'),
          React.createElement('select', {
            value: currency,
            onChange: e => setCurrency(e.target.value)
          },
            [
              { value: 'USD', label: 'Dólar (USD)' },
              { value: 'BRL', label: 'Real (BRL)' }
            ].map((option, i) => 
              React.createElement('option', { key: i, value: option.value }, option.label)
            )
          )
        )
      ),
    
    // Tabela de resultados (apenas para busca normal)
    !usePeriodSearch && (providerResults.length > 0 || isLoading) && 
      React.createElement('table', { className: 'results-table' },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Companhia'),
            React.createElement('th', { 
              className: 'sortable', 
              onClick: () => setSortKey('price')
            }, useMiles ? 'Milhas' : 'Preço'),
            React.createElement('th', null, 'Horários'),
            React.createElement('th', { 
              className: 'sortable', 
              onClick: () => setSortKey('stops')
            }, 'Paradas'),
            React.createElement('th', { 
              className: 'sortable', 
              onClick: () => setSortKey('duration')
            }, 'Duração'),
            React.createElement('th', { 
              className: 'sortable', 
              onClick: () => setSortKey('category')
            }, 'Classe'),
            React.createElement('th', null, 'Ida'),
            React.createElement('th', null, 'Volta')
          )
        ),
        React.createElement('tbody', null,
          // Skeleton loaders durante carregamento
          isLoading && allProviders.map((provider, i) => 
            loadingProviders[provider] && React.createElement(React.Fragment, { key: i },
              React.createElement('tr', { className: 'provider-header' },
                React.createElement('th', { colSpan: '8' }, provider)
              ),
              React.createElement(SkeletonRow, { colSpan: 8 }),
              React.createElement(SkeletonRow, { colSpan: 8 }),
              React.createElement(SkeletonRow, { colSpan: 8 })
            )
          ),
          
          // Resultados reais
          !isLoading && providerResults.map((providerData, i) => 
            React.createElement(ProviderResults, {
              key: i,
              providerData,
              useMiles,
              sortKey,
              filterStops,
              filterCabin,
              onSelectFlight: handleSelectFlight,
              selectedFlightId
            })
          ),
          
          // Resultados de busca inteligente
          !isLoading && useSmartSearch && smartComboResults.length > 0 && 
            React.createElement(ProviderResults, {
              providerData: { 
                provider: 'Busca Inteligente', 
                flights: smartComboResults 
              },
              useMiles,
              sortKey,
              filterStops,
              filterCabin,
              onSelectFlight: handleSelectFlight,
              selectedFlightId,
              isSmartCombo: true
            })
        )
      ),
    
    // Mensagem quando não há resultados
    !isLoading && !error && !usePeriodSearch && providerResults.length === 0 && 
      React.createElement('div', { className: 'no-results' }, 
        'Nenhum resultado encontrado. Tente ajustar os filtros ou alterar as datas.'
      ),
    
    // Mensagem quando não há resultados de período
    !isLoading && !error && usePeriodSearch && periodResults.length === 0 && 
      React.createElement('div', { className: 'no-results' }, 
        'Nenhum resultado encontrado para o período selecionado. Tente ajustar o intervalo de meses.'
      )
  );
  
  // Rodapé
  const footer = React.createElement('footer', { className: 'app-footer' },
    React.createElement('div', { className: 'footer-content' },
      React.createElement('div', { className: 'footer-logo' }, 'UDS Travel Optimizer'),
      React.createElement('div', { className: 'footer-version' }, 'v1.2.0'),
      React.createElement('div', { className: 'footer-copyright' }, '© 2025 UDS. Todos os direitos reservados.')
    )
  );
  
  // Renderizar aplicação
  return React.createElement('div', { className: 'app' },
    React.createElement('header', { className: 'app-header' },
      React.createElement('div', { className: 'header-content' },
        React.createElement('img', { 
          src: 'uds_logo.svg+xml', 
          alt: 'UDS Logo', 
          className: 'logo' 
        }),
        React.createElement('h1', null, 'Travel Optimizer')
      )
    ),
    React.createElement('main', { className: 'app-main' },
      searchForm,
      searchResults
    ),
    footer
  );
}

// Definição de componentes auxiliares
const AutocompleteInput = (props) => {
  const { id, value, onChange, placeholder, options } = props;
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [filteredOptions, setFilteredOptions] = React.useState([]);
  
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    
    if (inputValue.length > 1) {
      const filtered = options.filter(option => 
        option.code.toLowerCase().includes(inputValue.toLowerCase()) || 
        option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.country.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 5);
      
      setFilteredOptions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  
  const handleSelectOption = (option) => {
    onChange(option.code);
    setShowSuggestions(false);
  };
  
  return React.createElement('div', { className: 'autocomplete-container' },
    React.createElement('input', {
      id,
      type: 'text',
      value,
      onChange: handleInputChange,
      placeholder,
      onFocus: () => value.length > 1 && setShowSuggestions(true),
      onBlur: () => setTimeout(() => setShowSuggestions(false), 200)
    }),
    showSuggestions && filteredOptions.length > 0 && React.createElement('div', { className: 'suggestions-list' },
      filteredOptions.map((option, index) => 
        React.createElement('div', {
          key: index,
          className: 'suggestion-item',
          onClick: () => handleSelectOption(option)
        },
          React.createElement('div', { className: 'suggestion-code' }, option.code),
          React.createElement('div', { className: 'suggestion-details' },
            React.createElement('div', { className: 'suggestion-name' }, option.name),
            React.createElement('div', { className: 'suggestion-country' }, option.country)
          )
        )
      )
    )
  );
};

// Componente para resultados de busca por período
const PeriodResults = ({ results, currency, tripDuration }) => {
  if (!results || results.length === 0) {
    return null;
  }
  
  return React.createElement('div', { className: 'period-results' },
    // Informação sobre a busca por período
    React.createElement('div', { className: 'period-info' },
      React.createElement('h3', null, 'Melhores preços por período'),
      React.createElement('p', null, `Mostrando os melhores preços para viagens de ${tripDuration} dias.`)
    ),
    
    // Tabela de resultados por período
    React.createElement('table', { className: 'results-table period-table' },
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Data Ida'),
          React.createElement('th', null, 'Data Volta'),
          React.createElement('th', null, 'Preço Total'),
          React.createElement('th', null, 'Milhas'),
          React.createElement('th', null, 'Companhias'),
          React.createElement('th', null, 'Ação')
        )
      ),
      React.createElement('tbody', null,
        results.map((result, index) => 
          React.createElement('tr', { key: index },
            React.createElement('td', null, result.departureDate),
            React.createElement('td', null, result.returnDate),
            React.createElement('td', { className: 'price-cell' }, 
              `${currency === 'USD' ? '$' : 'R$'}${currency === 'USD' ? result.totalPrice.toFixed(2) : Math.round(result.totalPrice * 5.2).toLocaleString()}`
            ),
            React.createElement('td', null, `${result.totalMiles.toLocaleString()} milhas`),
            React.createElement('td', null, 
              React.createElement('div', { className: 'airlines-list' },
                result.airlines.map((airline, i) => 
                  React.createElement('span', { key: i, className: 'airline-tag' }, airline)
                )
              )
            ),
            React.createElement('td', null,
              React.createElement('button', { 
                className: 'select-period-button',
                onClick: () => {
                  // Implementação de seleção de período
                  alert(`Selecionado período: ${result.departureDate} a ${result.returnDate}`);
                }
              }, 'Selecionar')
            )
          )
        )
      )
    )
  );
};

// Componente para detalhes expandidos do voo
const FlightDetails = ({ flight }) => {
  if (!flight || !flight.details) return null;
  
  const { details } = flight;
  
  return React.createElement('div', { className: 'flight-details' },
    // Banner de busca inteligente (se aplicável)
    flight.isSmartCombo && React.createElement('div', { className: 'smart-combo-banner' },
      React.createElement('div', { className: 'smart-combo-banner-icon' }, '🔥'),
      React.createElement('div', { className: 'smart-combo-banner-content' },
        React.createElement('h3', null, 'Bilhetes Separados - Busca Inteligente'),
        React.createElement('p', null, 
          `Economize ${Math.round(flight.smartComboSavingsPercent)}% (${currency === 'USD' ? '$' : 'R$'}${currency === 'USD' ? flight.smartComboSavings.toFixed(2) : Math.round(flight.smartComboSavings * 5.2).toLocaleString()}) comprando bilhetes separados em vez da rota direta.`
        ),
        React.createElement('p', { className: 'smart-combo-banner-note' }, 
          'Nota: Você precisará fazer reservas separadas para cada trecho desta combinação.'
        )
      )
    ),
    // Informações básicas
    React.createElement('div', { className: 'details-section' },
      React.createElement('h4', null, 'Informações do Voo'),
      React.createElement('div', { className: 'details-grid' },
        React.createElement('div', null, 
          React.createElement('strong', null, 'Aeronave: '),
          React.createElement('span', { className: 'aircraft-model' }, details.aircraft)
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Modelo: '),
          React.createElement('span', { className: 'aircraft-type' }, details.aircraftType || 'Boeing 737/Airbus A320')
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Fabricante: '),
          React.createElement('span', { className: 'manufacturer' }, details.manufacturer || (details.aircraft && details.aircraft.includes('Boeing') ? 'Boeing' : 'Airbus'))
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Partida: '),
          React.createElement('span', { className: 'departure-info' }, `${details.departureTime} (${details.departureAirport})`)
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Chegada: '),
          React.createElement('span', { className: 'arrival-info' }, `${details.arrivalTime} (${details.arrivalAirport})`)
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Número do Voo: '),
          React.createElement('span', { className: 'flight-number' }, details.flightNumber || 'N/A')
        )
      )
    ),
    // Detalhes das paradas
    flight.stops > 0 && React.createElement('div', { className: 'details-section' },
      React.createElement('h4', null, 'Detalhes das Paradas'),
      React.createElement('div', { className: 'stops-list' },
        (details.stops || []).map((stop, index) => 
          React.createElement('div', { key: index, className: 'stop-item' },
            React.createElement('div', { className: 'stop-airport' }, 
              React.createElement('strong', null, stop.airport),
              React.createElement('span', { className: 'stop-city' }, ` (${stop.city})`)
            ),
            React.createElement('div', { className: 'stop-time' },
              React.createElement('span', null, `Chegada: ${stop.arrivalTime}`),
              React.createElement('span', { className: 'time-separator' }, ' | '),
              React.createElement('span', null, `Partida: ${stop.departureTime}`)
            ),
            React.createElement('div', { className: 'stop-duration' },
              `Tempo de espera: ${stop.layoverDuration}`
            )
          )
        )
      )
    ),
    // Detalhes adicionais
    React.createElement('div', { className: 'details-section' },
      React.createElement('h4', null, 'Detalhes Adicionais'),
      React.createElement('div', { className: 'details-grid' },
        React.createElement('div', null, 
          React.createElement('strong', null, 'Bagagem: '),
          React.createElement('span', null, details.baggage || '1 bagagem de mão + 1 bagagem despachada')
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Refeições: '),
          React.createElement('span', null, details.meals || 'Refeição completa')
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Entretenimento: '),
          React.createElement('span', null, details.entertainment || 'Wi-Fi, TV ao vivo, filmes')
        ),
        React.createElement('div', null, 
          React.createElement('strong', null, 'Assentos: '),
          React.createElement('span', null, details.seats || 'Seleção de assentos disponível')
        )
      )
    )
  );
};

// Componente de Skeleton Loader para linhas de voo
const SkeletonRow = ({ colSpan }) => {
  return React.createElement('tr', { className: 'skeleton-row' },
    React.createElement('td', { colSpan: colSpan },
      React.createElement('div', { className: 'skeleton-pulse' })
    )
  );
};

// Função auxiliar para obter ícone da companhia aérea
const getAirlineIcon = (airline) => {
  if (!window.airlineIcons) return '✈️';
  return window.airlineIcons[airline] || '✈️';
};

// Componente principal App
function App() {
  // Estados para formulário de busca
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [departureDate, setDepartureDate] = React.useState('');
  const [returnDate, setReturnDate] = React.useState('');
  const [adults, setAdults] = React.useState(1);
  const [children, setChildren] = React.useState(0);
  const [cabinClass, setCabinClass] = React.useState('Economy');
  const [useMiles, setUseMiles] = React.useState(true);
  const [useSmartSearch, setUseSmartSearch] = React.useState(true);
  const [currency, setCurrency] = React.useState('USD');
  const [sortKey, setSortKey] = React.useState('price');
  const [sortDirection, setSortDirection] = React.useState('asc');
  
  // Estados para busca por período
  const [usePeriodSearch, setUsePeriodSearch] = React.useState(false);
  const [startMonth, setStartMonth] = React.useState('');
  const [endMonth, setEndMonth] = React.useState('');
  const [tripDuration, setTripDuration] = React.useState(7);
  
  // Estados para resultados
  const [results, setResults] = React.useState([]);
  const [periodResults, setPeriodResults] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [expandedFlightId, setExpandedFlightId] = React.useState(null);
  const [filterStops, setFilterStops] = React.useState('');
  const [filterCabin, setFilterCabin] = React.useState('');
  
  // Formulário de busca normal
  const searchForm = React.createElement('div', { className: 'search-container' },
    React.createElement('div', { className: 'search-tabs' },
      React.createElement('button', { 
        className: usePeriodSearch ? 'tab' : 'tab active',
        onClick: () => setUsePeriodSearch(false)
      }, 'Busca por Data'),
      React.createElement('button', { 
        className: usePeriodSearch ? 'tab active' : 'tab',
        onClick: () => setUsePeriodSearch(true)
      }, 'Busca por Período')
    ),
    
    // Formulário de busca por datas específicas
    !usePeriodSearch && React.createElement('form', { className: 'search-form' },
      React.createElement('div', { className: 'form-row' },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Origem'),
          React.createElement(AutocompleteInput, {
            id: 'origin',
            value: origin,
            onChange: setOrigin,
            placeholder: 'Ex: GRU, São Paulo',
            options: window.airports || []
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Destino'),
          React.createElement(AutocompleteInput, {
            id: 'destination',
            value: destination,
            onChange: setDestination,
            placeholder: 'Ex: MCO, Orlando',
            options: window.airports || []
          })
        )
      ),
      React.createElement('div', { className: 'form-row' },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Data de Ida'),
          React.createElement('input', {
            type: 'date',
            value: departureDate,
            onChange: (e) => setDepartureDate(e.target.value),
            required: true
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Data de Volta'),
          React.createElement('input', {
            type: 'date',
            value: returnDate,
            onChange: (e) => setReturnDate(e.target.value),
            required: false
          })
        )
      ),
      React.createElement('div', { className: 'form-row' },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Adultos'),
          React.createElement('select', {
            value: adults,
            onChange: (e) => setAdults(parseInt(e.target.value))
          },
            [1, 2, 3, 4, 5, 6].map(num => 
              React.createElement('option', { key: num, value: num }, num)
            )
          )
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Crianças'),
          React.createElement('select', {
            value: children,
            onChange: (e) => setChildren(parseInt(e.target.value))
          },
            [0, 1, 2, 3, 4].map(num => 
              React.createElement('option', { key: num, value: num }, num)
            )
          )
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Classe'),
          React.createElement('select', {
            value: cabinClass,
            onChange: (e) => setCabinClass(e.target.value)
          },
            ['Economy', 'Premium Economy', 'Business', 'First'].map(cls => 
              React.createElement('option', { key: cls, value: cls }, cls)
            )
          )
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Moeda'),
          React.createElement('select', {
            value: currency,
            onChange: (e) => setCurrency(e.target.value)
          },
            [
              { value: 'USD', label: 'Dólar (USD)' },
              { value: 'BRL', label: 'Real (BRL)' }
            ].map(curr => 
              React.createElement('option', { key: curr.value, value: curr.value }, curr.label)
            )
          )
        )
      ),
      
      // Opções de busca (visíveis apenas no modo de busca por datas)
    !usePeriodSearch && React.createElement('div', { className: 'checkbox-container' },
      React.createElement('div', { className: 'checkbox-group' },
        React.createElement('label', null,
          React.createElement('input', {
            type: 'checkbox',
            checked: useSmartSearch,
            onChange: (e) => setUseSmartSearch(e.target.checked)
          }),
          ' Busca inteligente (combinar voos de diferentes companhias)'
        )
      )
    ),
      
      React.createElement('div', { className: 'form-row' },
        React.createElement('button', {
          type: 'button',
          className: 'search-button',
          onClick: () => {
            setIsLoading(true);
            setError(null);
            
            // Construir URL de busca
            const searchParams = new URLSearchParams({
              origin,
              destination,
              departureDate,
              returnDate,
              adults,
              children,
              cabinClass,
              useMiles: useMiles ? '1' : '0',
              useSmartSearch: useSmartSearch ? '1' : '0'
            });
            
            // Fazer requisição para a API
            fetch(`/api/flights?${searchParams.toString()}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Erro ao buscar voos');
                }
                return response.json();
              })
              .then(data => {
                setResults(data);
                setIsLoading(false);
              })
              .catch(err => {
                setError(err.message);
                setIsLoading(false);
              });
          },
          disabled: isLoading
        }, isLoading ? 'Buscando...' : 'Buscar Voos')
      )
    ),
    
    // Formulário de busca por período
    usePeriodSearch && React.createElement('form', { className: 'search-form' },
      React.createElement('div', { className: 'form-row' },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Origem'),
          React.createElement(AutocompleteInput, {
            id: 'origin-period',
            value: origin,
            onChange: setOrigin,
            placeholder: 'Ex: GRU, São Paulo',
            options: airports
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Destino'),
          React.createElement(AutocompleteInput, {
            id: 'destination-period',
            value: destination,
            onChange: setDestination,
            placeholder: 'Ex: MCO, Orlando',
            options: airports
          })
        )
      ),
      React.createElement('div', { className: 'form-row' },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Mês Inicial'),
          React.createElement('select', {
            value: startMonth,
            onChange: (e) => setStartMonth(e.target.value),
            required: true
          },
            React.createElement('option', { value: '' }, 'Selecione'),
            ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
             'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((month, index) => 
              React.createElement('option', { key: index, value: index + 1 }, month)
            )
          )
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Mês Final'),
          React.createElement('select', {
            value: endMonth,
            onChange: (e) => setEndMonth(e.target.value),
            required: true
          },
            React.createElement('option', { value: '' }, 'Selecione'),
            ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
             'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((month, index) => 
              React.createElement('option', { key: index, value: index + 1 }, month)
            )
          )
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Duração da Viagem (dias)'),
          React.createElement('select', {
            value: tripDuration,
            onChange: (e) => setTripDuration(parseInt(e.target.value))
          },
            [3, 5, 7, 10, 14, 21, 30].map(days => 
              React.createElement('option', { key: days, value: days }, days)
            )
          )
        )
      ),
      React.createElement('div', { className: 'form-row' },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Adultos'),
          React.createElement('select', {
            value: adults,
            onChange: (e) => setAdults(parseInt(e.target.value))
          },
            [1, 2, 3, 4, 5, 6].map(num => 
              React.createElement('option', { key: num, value: num }, num)
            )
          )
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Crianças'),
          React.createElement('select', {
            value: children,
            onChange: (e) => setChildren(parseInt(e.target.value))
          },
            [0, 1, 2, 3, 4].map(num => 
              React.createElement('option', { key: num, value: num }, num)
            )
          )
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Classe'),
          React.createElement('select', {
            value: cabinClass,
            onChange: (e) => setCabinClass(e.target.value)
          },
            ['Economy', 'Premium Economy', 'Business', 'First'].map(cls => 
              React.createElement('option', { key: cls, value: cls }, cls)
            )
          )
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Moeda'),
          React.createElement('select', {
            value: currency,
            onChange: (e) => setCurrency(e.target.value)
          },
            [
              { value: 'USD', label: 'Dólar (USD)' },
              { value: 'BRL', label: 'Real (BRL)' }
            ].map(curr => 
              React.createElement('option', { key: curr.value, value: curr.value }, curr.label)
            )
          )
        )
      ),
      React.createElement('div', { className: 'form-row' },
        React.createElement('button', {
          type: 'button',
          className: 'search-button',
          onClick: () => {
            setIsLoading(true);
            setError(null);
            
            // Construir URL de busca por período
            const searchParams = new URLSearchParams({
              origin,
              destination,
              startMonth,
              endMonth,
              tripDuration,
              adults,
              children,
              cabinClass,
              useMiles: useMiles ? '1' : '0'
            });
            
            // Fazer requisição para a API
            fetch(`/api/flights/period?${searchParams.toString()}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Erro ao buscar voos por período');
                }
                return response.json();
              })
              .then(data => {
                setPeriodResults(data);
                setIsLoading(false);
              })
              .catch(err => {
                setError(err.message);
                setIsLoading(false);
              });
          },
          disabled: isLoading
        }, isLoading ? 'Buscando...' : 'Buscar Melhores Preços')
      )
    ),
    
    // Mensagem de erro (se houver)
    error && React.createElement('div', { className: 'error-message' }, error)
  );
  
  // Componente para resultados de busca normal
  const searchResults = React.createElement('div', { className: 'results-container' },
    // Indicador de carregamento
    isLoading && React.createElement('div', { className: 'loading-indicator' }, 'Buscando voos...'),
    
    // Resultados da busca normal
    !isLoading && !error && !usePeriodSearch && results.length > 0 && React.createElement('div', null,
      // Filtros
      React.createElement('div', { className: 'filter-bar' },
        React.createElement('div', { className: 'filter-group' },
          React.createElement('label', null, 'Filtrar por paradas'),
          React.createElement('input', {
            type: 'text',
            className: 'filter-input',
            placeholder: 'Número de paradas',
            value: filterStops,
            onChange: (e) => setFilterStops(e.target.value)
          })
        ),
        React.createElement('div', { className: 'filter-group' },
          React.createElement('label', null, 'Filtrar por cabine'),
          React.createElement('select', {
            className: 'filter-select',
            value: filterCabin,
            onChange: (e) => setFilterCabin(e.target.value)
          },
            React.createElement('option', { value: '' }, 'Todas as classes'),
            ['Economy', 'Premium Economy', 'Business', 'First'].map(cls => 
              React.createElement('option', { key: cls, value: cls }, cls)
            )
          )
        ),
        React.createElement('div', { className: 'filter-group' },
          React.createElement('label', null, 'Ordenar por'),
          React.createElement('select', {
            className: 'filter-select',
            value: sortKey,
            onChange: (e) => setSortKey(e.target.value)
          },
            [
              { value: 'price', label: 'Preço' },
              { value: 'milesPrice', label: 'Milhas' },
              { value: 'duration', label: 'Tempo de voo' },
              { value: 'stops', label: 'Número de paradas' },
              { value: 'airline', label: 'Companhia aérea' }
            ].map(option => 
              React.createElement('option', { key: option.value, value: option.value }, option.label)
            )
          )
        ),
        React.createElement('div', { className: 'filter-group' },
          React.createElement('label', null, 'Direção'),
          React.createElement('select', {
            className: 'filter-select',
            value: sortDirection,
            onChange: (e) => setSortDirection(e.target.value)
          },
            [
              { value: 'asc', label: 'Crescente' },
              { value: 'desc', label: 'Decrescente' }
            ].map(option => 
              React.createElement('option', { key: option.value, value: option.value }, option.label)
            )
          )
        )
      ),
      
      // Tabela de resultados
      React.createElement('table', { className: 'results-table' },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Companhia'),
            React.createElement('th', null, 'Preço'),
            React.createElement('th', null, 'Horário'),
            React.createElement('th', null, 'Paradas'),
            React.createElement('th', null, 'Duração'),
            React.createElement('th', null, 'Classe'),
            React.createElement('th', null, 'Data Ida'),
            React.createElement('th', null, 'Data Volta')
          )
        ),
        React.createElement('tbody', null,
          // Filtrar e ordenar resultados
          results
            .filter(flight => {
              // Filtrar por número de paradas
              if (filterStops && !flight.stops.toString().includes(filterStops)) {
                return false;
              }
              
              // Filtrar por classe de cabine
              if (filterCabin && flight.category !== filterCabin) {
                return false;
              }
              
              return true;
            })
            .sort((a, b) => {
              // Ordenar resultados com base na chave e direção selecionadas
              if (sortKey === 'price' || sortKey === 'milesPrice') {
                return sortDirection === 'asc' 
                  ? a[sortKey] - b[sortKey]
                  : b[sortKey] - a[sortKey];
              } else if (sortKey === 'duration') {
                return sortDirection === 'asc'
                  ? a.duration - b.duration
                  : b.duration - a.duration;
              } else if (sortKey === 'stops') {
                return sortDirection === 'asc'
                  ? a.stops - b.stops
                  : b.stops - a.stops;
              } else if (sortKey === 'airline') {
                return sortDirection === 'asc'
                  ? a.airline.localeCompare(b.airline)
                  : b.airline.localeCompare(a.airline);
              }
              
              return 0;
            })
            .map((flight, index) => {
              const isExpanded = expandedFlightId === flight.id;
              const isSmartCombo = flight.isSmartCombo;
              
              return React.createElement(React.Fragment, { key: flight.id },
                React.createElement('tr', { 
                  className: `flight-row ${isExpanded ? 'expanded' : ''} ${isSmartCombo ? 'smart-combo' : ''}`,
                  onClick: () => setExpandedFlightId(isExpanded ? null : flight.id)
                },
                  // Companhia aérea
                  React.createElement('td', null,
                    React.createElement('div', { className: 'airline-container' },
                      React.createElement('span', { className: 'airline-icon' }, 
                        getAirlineIcon(flight.airline) || '✈️'
                      ),
                      React.createElement('span', null, flight.airline),
                      React.createElement('div', { className: 'flight-number' }, `Voo ${flight.details?.flightNumber || 'N/A'}`)
                    )
                  ),
                  
                  // Preço
                  React.createElement('td', null,
                    React.createElement('div', { className: 'price-container' },
                      React.createElement('div', { className: 'price-display' },
                        React.createElement('span', { className: 'price-value' }, 
                          `${currency === 'USD' ? '$' : 'R$'}${currency === 'USD' ? flight.price.toFixed(2) : Math.round(flight.price * 5.2).toLocaleString()}`
                        ),
                        isSmartCombo && React.createElement('span', { className: 'smart-combo-tag' }, 
                          React.createElement('span', { className: 'fire-icon' }, '🔥'),
                          React.createElement('span', { className: 'savings' }, `-${Math.round(flight.smartComboSavingsPercent)}%`)
                        )
                      ),
                      React.createElement('div', { className: 'miles-display' },
                        React.createElement('span', { className: 'miles-value' }, 
                          `${flight.milesPrice.toLocaleString()} milhas`
                        )
                      )
                    )
                  ),
                  
                  // Horário
                  React.createElement('td', null,
                    React.createElement('div', { className: 'time-container' },
                      React.createElement('div', { className: 'time-display' },
                        React.createElement('span', { className: 'departure-time' }, flight.departureTime || '10:15'),
                        React.createElement('span', { className: 'time-separator' }, ' → '),
                        React.createElement('span', { className: 'arrival-time' }, flight.arrivalTime || '18:45')
                      ),
                      React.createElement('div', { className: 'airport-codes' },
                        `${flight.origin} → ${flight.destination}`
                      )
                    )
                  ),
                  
                  // Paradas
                  React.createElement('td', { className: 'stops-cell' },
                    React.createElement('div', { className: 'stops-container' },
                      flight.stops === 0
                        ? React.createElement('span', { className: 'direct-flight' }, 'Direto')
                        : React.createElement('span', { className: 'stops-count' }, 
                            `${flight.stops} ${flight.stops === 1 ? 'parada' : 'paradas'}`
                          )
                    )
                  ),
                  
                  // Duração
                  React.createElement('td', null,
                    React.createElement('div', { className: 'duration-display' },
                      `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m`
                    )
                  ),
                  
                  // Classe
                  React.createElement('td', null,
                    React.createElement('div', { className: 'cabin-class' },
                      flight.category
                    )
                  ),
                  
                  // Data Ida
                  React.createElement('td', null,
                    React.createElement('div', { className: 'date-display' },
                      flight.departureDate
                    )
                  ),
                  
                  // Data Volta
                  React.createElement('td', null,
                    React.createElement('div', { className: 'date-display' },
                      flight.returnDate || '-'
                    )
                  )
                ),
                
                // Detalhes expandidos
                isExpanded && React.createElement('tr', { className: 'details-row' },
                  React.createElement('td', { colSpan: 8 },
                    React.createElement(FlightDetails, { flight })
                  )
                )
              );
            })
        )
      )
    ),
    
    // Resultados da busca por período
    !isLoading && !error && usePeriodSearch && React.createElement(PeriodResults, { 
      results: periodResults, 
      currency,
      tripDuration
    }),
    
    // Mensagem quando não há resultados
    !isLoading && !error && !usePeriodSearch && results.length === 0 && 
      React.createElement('div', { className: 'no-results' }, 
        'Nenhum resultado encontrado. Tente ajustar os filtros ou datas de busca.'
      ),
    
    // Mensagem quando não há resultados de período
    !isLoading && !error && usePeriodSearch && periodResults.length === 0 && 
      React.createElement('div', { className: 'no-results' }, 
        'Nenhum resultado encontrado para o período selecionado. Tente ajustar o intervalo de meses.'
      )
  );
  
  // Rodapé
  const footer = React.createElement('footer', { className: 'app-footer' },
    React.createElement('div', { className: 'footer-content' },
      React.createElement('div', { className: 'footer-logo' }, 'UDS Travel Optimizer'),
      React.createElement('div', { className: 'footer-version' }, 'v1.2.0'),
      React.createElement('div', { className: 'footer-copyright' }, '© 2025 UDS. Todos os direitos reservados.')
    )
  );
  
  // Renderizar aplicação
  return React.createElement('div', { className: 'app' },
    React.createElement('main', { className: 'app-main' },
      searchForm,
      searchResults
    ),
    footer
  );
}

// Tornar App disponível globalmente
window.App = App;

// Inicializar o React e montar a aplicação no DOM
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.render(React.createElement(App), root);
  } else {
    console.error('Elemento root não encontrado, criando elemento root');
    const rootDiv = document.createElement('div');
    rootDiv.id = 'root';
    document.body.appendChild(rootDiv);
    ReactDOM.render(React.createElement(App), rootDiv);
  }
  
  // Renderizar o rodapé separadamente se necessário
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    ReactDOM.render(
      React.createElement('footer', { className: 'app-footer' },
        React.createElement('div', { className: 'footer-content' },
          React.createElement('div', { className: 'footer-logo' }, 'UDS Travel Optimizer'),
          React.createElement('div', { className: 'footer-version' }, 'v1.2.0'),
          React.createElement('div', { className: 'footer-copyright' }, '© 2025 UDS. Todos os direitos reservados.')
        )
      ),
      footerContainer
    );
  }
});lement.textContent = `
  :root {
    --uds-primary: #0078D7;
    --uds-secondary: #0099BC;
    --uds-accent: #FF4081;
    --uds-light: #F5F5F5;
    --uds-dark: #333333;
    --uds-success: #4CAF50;
    --uds-warning: #FFC107;
    --uds-error: #F44336;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f9f9f9;
    color: var(--uds-dark);
  }
  
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .app-header {
    background-color: var(--uds-primary);
    color: white;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .header-content {
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  
  .logo {
    height: 40px;
    margin-right: 1rem;
  }
  
  .app-main {
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }
  
  .app-footer {
    background-color: var(--uds-dark);
    color: white;
    padding: 1rem;
    margin-top: 2rem;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  
  .search-form {
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }
  
  .search-mode-selector {
    display: flex;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
  }
  
  .search-mode-option {
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    font-weight: 500;
    border-bottom: 3px solid transparent;
    transition: all 0.2s ease;
  }
  
  .search-mode-option.active {
    border-bottom: 3px solid var(--uds-primary);
    color: var(--uds-primary);
  }
  
  .search-mode-option:hover:not(.active) {
    background-color: #f5f5f5;
  }
  
  .form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  .form-group {
    flex: 1;
    min-width: 200px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .checkbox-container {
    display: flex;
    gap: 2rem;
    margin: 1rem 0;
  }
  
  .checkbox-group {
    display: flex;
    align-items: center;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .checkbox-label input {
    margin-right: 0.5rem;
    width: 18px;
    height: 18px;
  }
  
  .search-button {
    background-color: var(--uds-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 1rem;
    width: 100%;
  }
  
  .search-button:hover {
    background-color: #0062b1;
  }
  
  .search-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .period-search-info {
    background-color: #e3f2fd;
    padding: 0.75rem;
    border-radius: 4px;
    margin: 1rem 0;
    font-style: italic;
  }
  
  .filter-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .filter-input {
    max-width: 200px;
  }
  
  .filter-select {
    max-width: 250px;
  }
  
  .results-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .results-table th {
    background-color: #f5f5f5;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
  }
  
  .results-table th.sortable {
    cursor: pointer;
  }
  
  .results-table th.sortable:hover {
    background-color: #e0e0e0;
  }
  
  .results-table td {
    padding: 1rem;
    border-top: 1px solid #eee;
  }
  
  .provider-header {
    background-color: var(--uds-primary);
    color: white;
  }
  
  .smart-combo-header {
    background-color: #4a148c;
    color: white;
  }
  
  .smart-combo-row {
    background-color: #f3e5f5;
  }
  
  .smart-combo-row:hover {
    background-color: #e1bee7;
  }
  
  .smart-combo-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .smart-icon {
    font-size: 1.2rem;
  }
  
  .airline-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .airline-name {
    font-weight: 500;
  }
  
  .price-display {
    display: flex;
    flex-direction: column;
  }
  
  .price-value {
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--uds-primary);
  }
  
  .price-unit {
    font-size: 0.8rem;
    color: #666;
  }
  
  .price-tag {
    margin-left: 0.5rem;
    font-size: 1.2rem;
  }
  
  .flight-times {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .time-block {
    display: flex;
    flex-direction: column;
  }
  
  .time {
    font-weight: 600;
  }
  
  .airport {
    font-size: 0.8rem;
    color: #666;
  }
  
  .time-connector {
    flex: 1;
    height: 2px;
    background-color: #ddd;
    position: relative;
    margin: 0 0.5rem;
    min-width: 50px;
  }
  
  .connector-line {
    height: 2px;
    background-color: #ddd;
    width: 100%;
  }
  
  .stops-indicator {
    position: absolute;
    top: -4px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-evenly;
  }
  
  .stops-dot {
    width: 8px;
    height: 8px;
    background-color: var(--uds-primary);
    border-radius: 50%;
  }
  
  .stops-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background-color: #f5f5f5;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
  }
  
  .stops-badge:hover {
    background-color: #e0e0e0;
  }
  
  .selected-flight {
    background-color: #e3f2fd;
  }
  
  .selected-flight:hover {
    background-color: #bbdefb;
  }
  
  .details-row td {
    padding: 0;
  }
  
  .flight-details {
    padding: 1.5rem;
    background-color: #f9f9f9;
    border-top: 1px solid #ddd;
  }
  
  .details-section {
    margin-bottom: 1.5rem;
  }
  
  .details-section h4 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    color: var(--uds-primary);
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }
  
  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .stops-list {
    padding-left: 1.5rem;
  }
  
  .stops-list li {
    margin-bottom: 0.5rem;
  }
  
  .smart-combo-details {
    background-color: #f3e5f5;
    padding: 1rem;
    border-radius: 4px;
  }
  
  .smart-combo-info {
    margin-top: 0.5rem;
  }
  
  .savings-amount {
    color: #4caf50;
    font-weight: 600;
  }
  
  .segments-list {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
  
  .segment-item {
    margin-bottom: 0.5rem;
  }
  
  .segment-details {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .booking-instructions {
    margin-top: 1rem;
    font-style: italic;
  }
  
  .skeleton-row td {
    padding: 0.5rem 0;
  }
  
  .skeleton-pulse {
    height: 50px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: pulse 1.5s infinite;
    border-radius: 4px;
  }
  
  @keyframes pulse {
    0% {
      background-position: 0% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
  
  .error-message {
    background-color: #ffebee;
    color: #d32f2f;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  .no-results {
    background-color: #fff;
    padding: 2rem;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  /* Estilos para resultados de busca por período */
  .period-results {
    margin-bottom: 2rem;
  }
  
  .period-results-title {
    margin-bottom: 1rem;
    color: var(--uds-primary);
  }
  
  .best-prices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }
  
  .best-price-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .best-price-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .price-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .price-rank {
    background-color: var(--uds-primary);
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  
  .price-card-date {
    margin: 0.5rem 0 1rem;
    font-size: 0.9rem;
    color: #666;
  }
  
  .select-date-button {
    background-color: var(--uds-primary);
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .select-date-button:hover {
    background-color: #0062b1;
  }
  
  /* Estilos para o tooltip de paradas */
  .stops-tooltip {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    padding: 15px;
    min-width: 250px;
    max-width: 350px;
    font-size: 14px;
    position: absolute;
    z-index: 1000;
  }
  
  .tooltip-header {
    font-weight: bold;
    color: var(--uds-primary);
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
    margin-bottom: 8px;
    font-size: 16px;
  }
  
  .tooltip-stops-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .tooltip-stop-item {
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .tooltip-stop-item:last-child {
    border-bottom: none;
  }
  
  .tooltip-airport {
    font-weight: 500;
    color: #333;
  }
  
  .tooltip-duration {
    color: #666;
    font-size: 12px;
  }
  
  .tooltip-close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #999;
  }
  
  .tooltip-close:hover {
    color: #333;
  }
  
  @media (max-width: 768px) {
    .details-grid {
      grid-template-columns: 1fr;
    }
    
    .checkbox-container {
      flex-direction: column;
      gap: 10px;
    }
    
    .filter-bar {
      flex-direction: column;
      gap: 10px;
    }
    
    .flight-times {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .time-connector {
      width: 2px;
      height: 30px;
      margin: 5px 0;
    }
    
    .connector-line {
      width: 2px;
      height: 100%;
    }
    
    .stops-indicator {
      flex-direction: column;
      height: 100%;
      width: auto;
      left: -3px;
      top: 0;
    }
    
    .stops-dot {
      margin: 5px 0;
    }
    
    .stops-tooltip {
      max-width: 90%;
      left: 5% !important;
    }
  }
`;
document.head.appendChild(styleElement);

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
