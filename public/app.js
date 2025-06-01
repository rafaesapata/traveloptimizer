console.log("Carregando app.js");

// Componente principal da aplicação
function App() {
  // Estados para formulário de busca
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [departureDate, setDepartureDate] = React.useState('');
  const [returnDate, setReturnDate] = React.useState('');
  const [adults, setAdults] = React.useState(1);
  const [children, setChildren] = React.useState(0);
  const [cabinClass, setCabinClass] = React.useState('economy');
  const [useMiles, setUseMiles] = React.useState(true);
  const [useSmartSearch, setUseSmartSearch] = React.useState(true);
  
  // Estados para busca por período
  const [usePeriodSearch, setUsePeriodSearch] = React.useState(false);
  const [startMonth, setStartMonth] = React.useState('');
  const [endMonth, setEndMonth] = React.useState('');
  const [tripDuration, setTripDuration] = React.useState(7);
  
  // Estados para resultados e filtros
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [stopFilter, setStopFilter] = React.useState('');
  const [cabinFilter, setCabinFilter] = React.useState('');
  const [sortKey, setSortKey] = React.useState('price');
  const [currency, setCurrency] = React.useState('BRL');
  const [periodResults, setPeriodResults] = React.useState([]);
  const [expandedFlightId, setExpandedFlightId] = React.useState(null);
  
  // Função para validar e formatar data
  const validateAndFormatDate = (dateValue) => {
    if (!dateValue) return '';
    
    // Se a data já está no formato correto YYYY-MM-DD, retorna como está
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(dateValue)) {
      return dateValue;
    }
    
    // Se a data está malformada, tenta corrigir
    // Remove caracteres não numéricos e hífens
    const cleanValue = dateValue.replace(/[^\d-]/g, '');
    
    // Se tem mais de 10 caracteres, trunca
    if (cleanValue.length > 10) {
      return cleanValue.substring(0, 10);
    }
    
    return cleanValue;
  };

  // Manipuladores de eventos para formulário
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    console.log(`handleInputChange: id=${id}, value=${value}, type=${typeof value}`);
    
    switch (id) {
      case 'origin':
        setOrigin(value);
        break;
      case 'destination':
        setDestination(value);
        break;
      case 'departure-date':
        // Validar e formatar data de ida
        console.log(`Data de ida recebida: ${value}`);
        const formattedDepartureDate = validateAndFormatDate(value);
        console.log(`Data de ida formatada: ${formattedDepartureDate}`);
        setDepartureDate(formattedDepartureDate);
        break;
      case 'return-date':
        // Validar e formatar data de volta
        console.log(`Data de volta recebida: ${value}`);
        const formattedReturnDate = validateAndFormatDate(value);
        console.log(`Data de volta formatada: ${formattedReturnDate}`);
        setReturnDate(formattedReturnDate);
        break;
      case 'adults':
        setAdults(parseInt(value) || 1);
        break;
      case 'children':
        setChildren(parseInt(value) || 0);
        break;
      case 'cabin-class':
        setCabinClass(value);
        break;
      case 'use-miles':
        setUseMiles(e.target.checked);
        break;
      case 'use-smart-search':
        setUseSmartSearch(e.target.checked);
        break;
      case 'use-period-search':
        setUsePeriodSearch(e.target.checked);
        break;
      case 'start-month':
        setStartMonth(value);
        break;
      case 'end-month':
        setEndMonth(value);
        break;
      case 'trip-duration':
        setTripDuration(parseInt(value) || 7);
        break;
      case 'stop-filter':
        setStopFilter(value);
        break;
      case 'cabin-filter':
        setCabinFilter(value);
        break;
      case 'sort-key':
        setSortKey(value);
        break;
      case 'currency':
        setCurrency(value);
        break;
      default:
        console.warn(`Campo não tratado: ${id}`);
    }
  };
  
  // Buscar voos
  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validar formulário
    const formData = {
      origin,
      destination,
      departureDate,
      returnDate,
      adults,
      children,
      cabinClass,
      useMiles,
      useSmartSearch
    };
    
    const validation = window.Utils.validateSearchForm(formData);
    
    if (!validation.isValid) {
      setError(Object.values(validation.errors).join(', '));
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults([]);
    
    try {
      console.log("Iniciando busca com parâmetros:", formData);
      const data = await window.API.searchFlights(formData);
      console.log("Dados recebidos:", data);
      
      if (data && data.success) {
        setResults(data.results || []);
        if (data.errors && data.errors.length > 0) {
          console.warn("Erros na busca:", data.errors);
          // Mostrar aviso sobre erros, mas não impedir exibição dos resultados
          const errorMessages = data.errors.map(e => `${e.provider}: ${e.error}`).join('; ');
          setError(`Alguns provedores falharam: ${errorMessages}`);
        }
      } else {
        // Se não teve sucesso, mostrar o erro específico
        const errorMessage = data.message || data.error || "Erro desconhecido na busca";
        setError(errorMessage);
        
        // Se há erros específicos dos provedores, incluí-los na mensagem
        if (data.errors && data.errors.length > 0) {
          const providerErrors = data.errors.map(e => `${e.provider}: ${e.error}`).join('; ');
          setError(`${errorMessage}. Detalhes: ${providerErrors}`);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar voos:", error);
      setError(`Falha na comunicação com o servidor: ${error.message || 'Erro de rede'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Buscar por período
  const handlePeriodSearch = async (e) => {
    e.preventDefault();
    
    if (!origin || !destination || !startMonth || !endMonth || !tripDuration) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }
    
    setLoading(true);
    setError(null);
    setPeriodResults([]);
    
    try {
      const periodData = {
        origin,
        destination,
        startMonth,
        endMonth,
        tripDuration,
        adults,
        children,
        cabinClass,
        useMiles,
        useSmartSearch
      };
      
      console.log("Iniciando busca por período com parâmetros:", periodData);
      const data = await window.API.searchPeriod(periodData);
      console.log("Dados recebidos da busca por período:", data);
      
      if (data && data.success) {
        setPeriodResults(data.results || []);
      } else {
        setError(data.error || "Erro desconhecido na busca por período");
      }
    } catch (error) {
      console.error("Erro ao buscar por período:", error);
      setError("Falha ao buscar por período. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  
  // Alternar expansão de detalhes do voo
  const toggleFlightDetails = (flightId) => {
    setExpandedFlightId(expandedFlightId === flightId ? null : flightId);
  };
  
  // Filtrar e ordenar resultados
  const getFilteredAndSortedResults = () => {
    // Verificar se results é um array válido
    if (!results || !Array.isArray(results) || results.length === 0) {
      return [];
    }
    
    // Processar resultados para garantir estrutura consistente
    const processedResults = [];
    
    // Iterar sobre os provedores
    for (const provider of results) {
      if (!provider || !provider.flights || !Array.isArray(provider.flights)) {
        continue; // Pular provedores sem voos válidos
      }
      
      // Processar cada voo do provedor
      for (const flight of provider.flights) {
        if (!flight) continue;
        
        // Criar objeto de voo com valores padrão para propriedades ausentes
        const processedFlight = {
          id: flight.id || `flight-${Math.random().toString(36).substring(2, 9)}`,
          airline: flight.airline || provider.provider || 'Desconhecida',
          flightNumber: flight.flightNumber || 'N/A',
          origin: flight.origin || origin || 'N/A',
          destination: flight.destination || destination || 'N/A',
          price: typeof flight.price === 'number' ? flight.price : 0,
          milesPrice: typeof flight.milesPrice === 'number' ? flight.milesPrice : 0,
          stops: typeof flight.stops === 'number' ? flight.stops : 0,
          duration: flight.duration || 'N/A',
          durationMinutes: typeof flight.durationMinutes === 'number' ? flight.durationMinutes : 0,
          departureTime: flight.departureTime || (flight.details && flight.details.departureTime) || 'N/A',
          arrivalTime: flight.arrivalTime || (flight.details && flight.details.arrivalTime) || 'N/A',
          departureDate: flight.departureDate || departureDate || 'N/A',
          returnDate: flight.returnDate || returnDate || 'N/A',
          cabin: flight.cabin || cabinClass || 'economy',
          isSmartCombo: !!flight.isSmartCombo,
          originalPrice: flight.originalPrice || null,
          details: flight.details || {}
        };
        
        processedResults.push(processedFlight);
      }
    }
    
    let filtered = [...processedResults];
    
    // Aplicar filtros
    if (stopFilter) {
      filtered = filtered.filter(flight => {
        if (stopFilter === '0') return flight.stops === 0;
        if (stopFilter === '1') return flight.stops === 1;
        if (stopFilter === '2+') return flight.stops >= 2;
        return true;
      });
    }
    
    if (cabinFilter) {
      filtered = filtered.filter(flight => flight.cabin === cabinFilter);
    }
    
    // Aplicar ordenação com verificações de segurança
    filtered.sort((a, b) => {
      try {
        switch (sortKey) {
          case 'price':
            return (a.price || 0) - (b.price || 0);
          case 'duration':
            return (a.durationMinutes || 0) - (b.durationMinutes || 0);
          case 'stops':
            return (a.stops || 0) - (b.stops || 0);
          case 'departure':
            return (a.departureTime || '').localeCompare(b.departureTime || '');
          case 'arrival':
            return (a.arrivalTime || '').localeCompare(b.arrivalTime || '');
          default:
            return 0;
        }
      } catch (error) {
        console.error('Erro ao ordenar voos:', error);
        return 0;
      }
    });
    
    return filtered;
  };
  
  // Renderizar rodapé
  React.useEffect(() => {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      try {
        console.log("Tentando renderizar o rodapé");
        ReactDOM.render(React.createElement(window.Components.Footer), footerContainer);
        console.log("Renderização do rodapé concluída com sucesso");
      } catch (error) {
        console.error("Erro ao renderizar o rodapé:", error);
      }
    }
    
    return () => {
      const footerContainer = document.getElementById('footer-container');
      if (footerContainer) {
        ReactDOM.unmountComponentAtNode(footerContainer);
      }
    };
  }, []);
  
  // Renderizar componente
  return React.createElement(window.Components.ErrorBoundary, null,
    React.createElement('div', { className: 'app-container' },
      // Formulário de busca por período
      usePeriodSearch && React.createElement('div', { className: 'search-form period-search' },
        React.createElement('h2', null, 'Busca por Período'),
        React.createElement('form', { onSubmit: handlePeriodSearch },
          React.createElement('div', { className: 'form-row' },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'origin' }, 'Origem'),
              React.createElement(window.Components.AutocompleteInput, {
                id: 'origin',
                placeholder: 'Código do aeroporto',
                value: origin,
                onChange: handleInputChange
              })
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'destination' }, 'Destino'),
              React.createElement(window.Components.AutocompleteInput, {
                id: 'destination',
                placeholder: 'Código do aeroporto',
                value: destination,
                onChange: handleInputChange
              })
            )
          ),
          React.createElement('div', { className: 'form-row' },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'start-month' }, 'Mês inicial'),
              React.createElement('select', {
                id: 'start-month',
                className: 'form-control',
                value: startMonth,
                onChange: handleInputChange
              },
                React.createElement('option', { value: '' }, 'Selecione'),
                React.createElement('option', { value: '2025-07' }, 'Julho 2025'),
                React.createElement('option', { value: '2025-08' }, 'Agosto 2025'),
                React.createElement('option', { value: '2025-09' }, 'Setembro 2025'),
                React.createElement('option', { value: '2025-10' }, 'Outubro 2025'),
                React.createElement('option', { value: '2025-11' }, 'Novembro 2025'),
                React.createElement('option', { value: '2025-12' }, 'Dezembro 2025')
              )
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'end-month' }, 'Mês final'),
              React.createElement('select', {
                id: 'end-month',
                className: 'form-control',
                value: endMonth,
                onChange: handleInputChange
              },
                React.createElement('option', { value: '' }, 'Selecione'),
                React.createElement('option', { value: '2025-07' }, 'Julho 2025'),
                React.createElement('option', { value: '2025-08' }, 'Agosto 2025'),
                React.createElement('option', { value: '2025-09' }, 'Setembro 2025'),
                React.createElement('option', { value: '2025-10' }, 'Outubro 2025'),
                React.createElement('option', { value: '2025-11' }, 'Novembro 2025'),
                React.createElement('option', { value: '2025-12' }, 'Dezembro 2025')
              )
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'trip-duration' }, 'Duração da viagem (dias)'),
              React.createElement('input', {
                id: 'trip-duration',
                type: 'number',
                className: 'form-control',
                min: '1',
                max: '30',
                value: tripDuration,
                onChange: handleInputChange
              })
            )
          ),
          React.createElement('div', { className: 'form-row' },
            React.createElement('div', { className: 'form-group checkbox-group' },
              React.createElement('input', {
                id: 'use-smart-search',
                type: 'checkbox',
                checked: useSmartSearch,
                onChange: handleInputChange
              }),
              React.createElement('label', { htmlFor: 'use-smart-search' }, 'Busca inteligente')
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('button', { 
                type: 'submit', 
                className: 'btn btn-primary',
                disabled: loading
              }, loading ? 'Buscando...' : 'Buscar')
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('button', { 
                type: 'button', 
                className: 'btn btn-secondary',
                onClick: () => setUsePeriodSearch(false)
              }, 'Voltar para busca normal')
            )
          )
        )
      ),
      
      // Formulário de busca normal
      !usePeriodSearch && React.createElement('div', { className: 'search-form' },
        React.createElement('h2', null, 'Busca de Voos'),
        React.createElement('form', { onSubmit: handleSearch },
          React.createElement('div', { className: 'form-row' },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'origin' }, 'Origem'),
              React.createElement(window.Components.AutocompleteInput, {
                id: 'origin',
                placeholder: 'Código do aeroporto',
                value: origin,
                onChange: handleInputChange
              })
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'destination' }, 'Destino'),
              React.createElement(window.Components.AutocompleteInput, {
                id: 'destination',
                placeholder: 'Código do aeroporto',
                value: destination,
                onChange: handleInputChange
              })
            )
          ),
          React.createElement('div', { className: 'form-row' },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'departure-date' }, 'Data de ida'),
              React.createElement('input', {
                id: 'departure-date',
                type: 'date',
                className: 'form-control',
                value: departureDate,
                onChange: (e) => {
                  console.log('Data de ida onChange:', e.target.value);
                  handleInputChange(e);
                },
                onInput: (e) => {
                  console.log('Data de ida onInput:', e.target.value);
                  handleInputChange(e);
                }
              })
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'return-date' }, 'Data de volta'),
              React.createElement('input', {
                id: 'return-date',
                type: 'date',
                className: 'form-control',
                value: returnDate,
                onChange: handleInputChange
              })
            )
          ),
          React.createElement('div', { className: 'form-row' },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'adults' }, 'Adultos'),
              React.createElement('input', {
                id: 'adults',
                type: 'number',
                className: 'form-control',
                min: '1',
                max: '9',
                value: adults,
                onChange: handleInputChange
              })
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'children' }, 'Crianças'),
              React.createElement('input', {
                id: 'children',
                type: 'number',
                className: 'form-control',
                min: '0',
                max: '9',
                value: children,
                onChange: handleInputChange
              })
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { htmlFor: 'cabin-class' }, 'Classe'),
              React.createElement('select', {
                id: 'cabin-class',
                className: 'form-control',
                value: cabinClass,
                onChange: handleInputChange
              },
                React.createElement('option', { value: 'economy' }, 'Econômica'),
                React.createElement('option', { value: 'premium_economy' }, 'Premium Economy'),
                React.createElement('option', { value: 'business' }, 'Executiva'),
                React.createElement('option', { value: 'first' }, 'Primeira Classe')
              )
            )
          ),
          React.createElement('div', { className: 'form-row' },
            React.createElement('div', { className: 'form-group checkbox-group' },
              React.createElement('input', {
                id: 'use-smart-search',
                type: 'checkbox',
                checked: useSmartSearch,
                onChange: handleInputChange
              }),
              React.createElement('label', { htmlFor: 'use-smart-search' }, 'Busca inteligente')
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('button', { 
                type: 'submit', 
                className: 'btn btn-primary',
                disabled: loading
              }, loading ? 'Buscando...' : 'Buscar')
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('button', { 
                type: 'button', 
                className: 'btn btn-secondary',
                onClick: () => setUsePeriodSearch(true)
              }, 'Busca por período')
            )
          )
        )
      ),
      
      // Mensagem de erro
      error && React.createElement('div', { className: 'error-message' }, error),
      
      // Resultados da busca
      results.length > 0 && React.createElement('div', { className: 'results-container' },
        React.createElement('div', { className: 'results-header' },
          React.createElement('h3', null, `${results.length} voos encontrados`),
          React.createElement('div', { className: 'filters' },
            React.createElement('div', { className: 'filter-group' },
              React.createElement('label', { htmlFor: 'stop-filter' }, 'Paradas:'),
              React.createElement('select', {
                id: 'stop-filter',
                className: 'form-control',
                value: stopFilter,
                onChange: handleInputChange
              },
                React.createElement('option', { value: '' }, 'Todas'),
                React.createElement('option', { value: '0' }, 'Sem paradas'),
                React.createElement('option', { value: '1' }, '1 parada'),
                React.createElement('option', { value: '2+' }, '2+ paradas')
              )
            ),
            React.createElement('div', { className: 'filter-group' },
              React.createElement('label', { htmlFor: 'cabin-filter' }, 'Classe:'),
              React.createElement('select', {
                id: 'cabin-filter',
                className: 'form-control',
                value: cabinFilter,
                onChange: handleInputChange
              },
                React.createElement('option', { value: '' }, 'Todas'),
                React.createElement('option', { value: 'economy' }, 'Econômica'),
                React.createElement('option', { value: 'premium_economy' }, 'Premium Economy'),
                React.createElement('option', { value: 'business' }, 'Executiva'),
                React.createElement('option', { value: 'first' }, 'Primeira Classe')
              )
            ),
            React.createElement('div', { className: 'filter-group' },
              React.createElement('label', { htmlFor: 'sort-key' }, 'Ordenar por:'),
              React.createElement('select', {
                id: 'sort-key',
                className: 'form-control',
                value: sortKey,
                onChange: handleInputChange
              },
                React.createElement('option', { value: 'price' }, 'Preço'),
                React.createElement('option', { value: 'duration' }, 'Duração'),
                React.createElement('option', { value: 'stops' }, 'Paradas'),
                React.createElement('option', { value: 'departure' }, 'Horário de partida'),
                React.createElement('option', { value: 'arrival' }, 'Horário de chegada')
              )
            ),
            React.createElement('div', { className: 'filter-group' },
              React.createElement('label', { htmlFor: 'currency' }, 'Moeda:'),
              React.createElement('select', {
                id: 'currency',
                className: 'form-control',
                value: currency,
                onChange: handleInputChange
              },
                React.createElement('option', { value: 'BRL' }, 'BRL'),
                React.createElement('option', { value: 'USD' }, 'USD')
              )
            )
          )
        ),
        React.createElement('div', { className: 'results-table-container' },
          React.createElement('table', { className: 'results-table' },
            React.createElement('thead', null,
              React.createElement('tr', null,
                React.createElement('th', null, 'Companhia'),
                React.createElement('th', null, 'Voo'),
                React.createElement('th', null, 'Preço'),
                React.createElement('th', null, 'Horários'),
                React.createElement('th', null, 'Paradas'),
                React.createElement('th', null, 'Duração'),
                React.createElement('th', null, 'Classe'),
                React.createElement('th', null, 'Data ida'),
                React.createElement('th', null, 'Data volta')
              )
            ),
            React.createElement('tbody', null,
              getFilteredAndSortedResults().map(flight => {
                const isExpanded = expandedFlightId === flight.id;
                const isSmartCombo = flight.isSmartCombo;
                const originalPrice = flight.originalPrice || (flight.price * 1.2);
                const savings = window.Utils.calculateSavings(originalPrice, flight.price);
                
                return [
                  React.createElement('tr', { 
                    key: flight.id,
                    className: isExpanded ? 'flight-row expanded' : 'flight-row',
                    onClick: () => toggleFlightDetails(flight.id)
                  },
                    React.createElement('td', null,
                      React.createElement('div', { className: 'airline-info' },
                        React.createElement('span', { className: 'airline-logo' }, 
                          window.getAirlineIcon(flight.airline)
                        ),
                        React.createElement('span', { className: 'airline-name' }, flight.airline)
                      )
                    ),
                    React.createElement('td', null,
                      React.createElement('div', { className: 'flight-number' },
                        React.createElement('span', { className: 'flight-number-text' }, flight.flightNumber || 'N/A')
                      )
                    ),
                    React.createElement('td', null,
                      React.createElement('div', { className: 'price-display' },
                        React.createElement('div', { className: 'price-currency' }, 
                          currency === 'BRL' ? 
                            window.Utils.formatPrice(flight.price, 'BRL') : 
                            window.Utils.formatPrice(flight.price, 'USD')
                        ),
                        React.createElement('div', { className: 'price-miles' }, window.Utils.formatMiles(flight.milesPrice)),
                        isSmartCombo && React.createElement('div', { className: 'smart-combo-tag' }, `🔥 -${savings}%`)
                      )
                    ),
                    React.createElement('td', null,
                      React.createElement('div', { className: 'flight-times' },
                        React.createElement('div', { className: 'departure-time' }, flight.departureTime),
                        React.createElement('div', { className: 'arrival-time' }, flight.arrivalTime)
                      )
                    ),
                    React.createElement('td', null, `${flight.stops} ${flight.stops === 1 ? 'parada' : 'paradas'}`),
                    React.createElement('td', null, flight.duration),
                    React.createElement('td', null, 
                      flight.cabin === 'economy' ? 'Econômica' : 
                      flight.cabin === 'premium_economy' ? 'Premium Economy' : 
                      flight.cabin === 'business' ? 'Executiva' : 'Primeira Classe'
                    ),
                    React.createElement('td', null, flight.departureDate),
                    React.createElement('td', null, flight.returnDate || '-')
                  ),
                  
                  // Detalhes expandidos do voo
                  isExpanded && React.createElement('tr', { key: `${flight.id}-details`, className: 'flight-details-row' },
                    React.createElement('td', { colSpan: '9' },
                      React.createElement('div', { className: 'flight-details' },
                        React.createElement('div', { className: 'flight-segments' },
                          React.createElement('h4', null, 'Detalhes do voo'),
                          React.createElement('div', { className: 'segment' },
                            React.createElement('div', { className: 'segment-header' },
                              React.createElement('div', { className: 'segment-airline' },
                                React.createElement('span', { className: 'airline-name' }, flight.airline)
                              ),
                              React.createElement('div', { className: 'segment-flight-number' }, `Voo ${flight.flightNumber}`)
                            ),
                            React.createElement('div', { className: 'segment-route' },
                              React.createElement('div', { className: 'segment-departure' },
                                React.createElement('div', { className: 'segment-airport' }, flight.origin),
                                React.createElement('div', { className: 'segment-time' }, flight.departureTime),
                                React.createElement('div', { className: 'segment-date' }, flight.departureDate)
                              ),
                              React.createElement('div', { className: 'segment-arrow' }, '→'),
                              React.createElement('div', { className: 'segment-arrival' },
                                React.createElement('div', { className: 'segment-airport' }, flight.destination),
                                React.createElement('div', { className: 'segment-time' }, flight.arrivalTime),
                                React.createElement('div', { className: 'segment-date' }, flight.arrivalDate || flight.departureDate)
                              )
                            ),
                            React.createElement('div', { className: 'segment-details' },
                              React.createElement('div', { className: 'segment-duration' }, `Duração: ${flight.duration}`),
                              React.createElement('div', { className: 'segment-aircraft' }, `Aeronave: ${flight.aircraft || 'Não informado'}`),
                              React.createElement('div', { className: 'segment-cabin' }, `Classe: ${
                                flight.cabin === 'economy' ? 'Econômica' : 
                                flight.cabin === 'premium_economy' ? 'Premium Economy' : 
                                flight.cabin === 'business' ? 'Executiva' : 'Primeira Classe'
                              }`)
                            )
                          )
                        )
                      )
                    )
                  )
                ];
              }).flat()
            )
          )
        )
      ),
      
      // Resultados da busca por período
      periodResults.length > 0 && React.createElement('div', { className: 'period-results-container' },
        React.createElement('h3', null, 'Melhores preços por período'),
        React.createElement('div', { className: 'period-results-grid' },
          periodResults.map(result => 
            React.createElement('div', { 
              key: result.id,
              className: 'period-result-card',
              onClick: () => {
                setDepartureDate(result.departureDate);
                setReturnDate(result.returnDate);
                setUsePeriodSearch(false);
                handleSearch({ preventDefault: () => {} });
              }
            },
              React.createElement('div', { className: 'period-result-dates' },
                React.createElement('div', { className: 'period-result-departure' }, result.departureDate),
                React.createElement('div', { className: 'period-result-return' }, result.returnDate)
              ),
              React.createElement('div', { className: 'period-result-price' },
                React.createElement('div', { className: 'price-currency' }, 
                  currency === 'BRL' ? 
                    window.Utils.formatPrice(result.price, 'BRL') : 
                    window.Utils.formatPrice(result.price, 'USD')
                ),
                React.createElement('div', { className: 'price-miles' }, window.Utils.formatMiles(result.milesPrice))
              ),
              React.createElement('div', { className: 'period-result-airline' },
                React.createElement('span', { className: 'airline-name' }, result.airline)
              )
            )
          )
        )
      ),
      
      // Mensagem de carregamento
      loading && React.createElement('div', { className: 'loading-overlay' },
        React.createElement('div', { className: 'loading-spinner' }),
        React.createElement('div', { className: 'loading-text' }, 'Buscando as melhores opções...')
      )
    )
  );
}

// Exportar App para uso global
window.App = App;

console.log("app.js carregado com sucesso");
