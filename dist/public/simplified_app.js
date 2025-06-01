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
            options: window.airports || []
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', null, 'Destino'),
          React.createElement(AutocompleteInput, {
            id: 'destination-period',
            value: destination,
            onChange: setDestination,
            placeholder: 'Ex: MCO, Orlando',
            options: window.airports || []
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
  
  // Renderizar aplicação
  return React.createElement('div', { className: 'app' },
    React.createElement('main', { className: 'app-main' },
      searchForm,
      searchResults
    ),
    React.createElement('footer', { className: 'app-footer' },
      React.createElement('div', { className: 'footer-content' },
        React.createElement('div', { className: 'footer-logo' }, 'UDS Travel Optimizer'),
        React.createElement('div', { className: 'footer-version' }, 'v1.2.0'),
        React.createElement('div', { className: 'footer-copyright' }, '© 2025 UDS. Todos os direitos reservados.')
      )
    )
  );
}

// Inicializar o React e montar a aplicação no DOM
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.render(React.createElement(App), root);
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
});
