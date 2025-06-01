// Versão real do app.js com componentes reintroduzidos progressivamente
console.log("Carregando app_real.js v1.2.0");

// Verificar se React e ReactDOM estão disponíveis
if (typeof React === 'undefined') {
  console.error("React não está definido! Verifique se a biblioteca React foi carregada.");
} else {
  console.log("React está disponível:", React.version);
}

if (typeof ReactDOM === 'undefined') {
  console.error("ReactDOM não está definido! Verifique se a biblioteca ReactDOM foi carregada.");
} else {
  console.log("ReactDOM está disponível:", ReactDOM.version);
}

// Componente de Autocomplete para aeroportos
function AutocompleteInput({ id, placeholder, onChange, value }) {
  const [inputValue, setInputValue] = React.useState(value || '');
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = React.useRef(null);
  
  React.useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value || '');
    }
  }, [value]);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length >= 2) {
      // Filtrar aeroportos baseado no input
      const filtered = window.airports.filter(airport => 
        airport.code.toLowerCase().includes(value.toLowerCase()) || 
        airport.name.toLowerCase().includes(value.toLowerCase()) ||
        airport.city.toLowerCase().includes(value.toLowerCase()) ||
        airport.country.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
      
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
    if (onChange) {
      onChange(e);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.code);
    setSuggestions([]);
    setShowSuggestions(false);
    
    if (onChange) {
      const syntheticEvent = { target: { id, value: suggestion.code } };
      onChange(syntheticEvent);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
  const handleBlur = () => {
    // Pequeno delay para permitir que o clique na sugestão seja processado
    setTimeout(() => setShowSuggestions(false), 200);
  };
  
  return React.createElement('div', { className: 'autocomplete-container' },
    React.createElement('input', {
      ref: inputRef,
      id: id,
      type: 'text',
      className: 'form-control',
      placeholder: placeholder,
      value: inputValue,
      onChange: handleInputChange,
      onKeyDown: handleKeyDown,
      onFocus: () => inputValue.length >= 2 && setSuggestions.length > 0 && setShowSuggestions(true),
      onBlur: handleBlur
    }),
    showSuggestions && suggestions.length > 0 && React.createElement('div', { className: 'suggestions-container' },
      React.createElement('ul', { className: 'suggestions-list' },
        suggestions.map((suggestion, index) => 
          React.createElement('li', {
            key: suggestion.code,
            className: index === selectedIndex ? 'suggestion-item selected' : 'suggestion-item',
            onClick: () => handleSuggestionClick(suggestion)
          },
            React.createElement('div', { className: 'suggestion-code' }, suggestion.code),
            React.createElement('div', { className: 'suggestion-details' },
              React.createElement('div', { className: 'suggestion-name' }, suggestion.name),
              React.createElement('div', { className: 'suggestion-location' }, `${suggestion.city}, ${suggestion.country}`)
            )
          )
        )
      )
    )
  );
}

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
  
  // Manipuladores de eventos para formulário
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    switch (id) {
      case 'origin':
        setOrigin(value);
        break;
      case 'destination':
        setDestination(value);
        break;
      case 'departure-date':
        setDepartureDate(value);
        break;
      case 'return-date':
        setReturnDate(value);
        break;
      case 'adults':
        setAdults(parseInt(value));
        break;
      case 'children':
        setChildren(parseInt(value));
        break;
      case 'cabin-class':
        setCabinClass(value);
        break;
      case 'start-month':
        setStartMonth(value);
        break;
      case 'end-month':
        setEndMonth(value);
        break;
      case 'trip-duration':
        setTripDuration(parseInt(value));
        break;
      default:
        break;
    }
  };
  
  // Manipuladores para checkboxes
  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    
    switch (id) {
      case 'use-miles':
        setUseMiles(checked);
        break;
      case 'smart-search':
        setUseSmartSearch(checked);
        break;
      case 'period-search':
        setUsePeriodSearch(checked);
        break;
      default:
        break;
    }
  };
  
  // Manipuladores para filtros
  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    
    switch (id) {
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
        break;
    }
  };
  
  // Função para buscar voos
  const searchFlights = () => {
    setLoading(true);
    setError(null);
    setResults([]);
    
    const searchParams = {
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
    
    fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchParams)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na busca de voos');
      }
      return response.json();
    })
    .then(data => {
      setResults(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  };
  
  // Função para buscar voos por período
  const searchFlightsByPeriod = () => {
    setLoading(true);
    setError(null);
    setPeriodResults([]);
    
    const searchParams = {
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
    
    fetch('/api/search/period', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchParams)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na busca de voos por período');
      }
      return response.json();
    })
    .then(data => {
      setPeriodResults(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  };
  
  // Função para alternar detalhes do voo
  const toggleFlightDetails = (flightId) => {
    setExpandedFlightId(expandedFlightId === flightId ? null : flightId);
  };
  
  // Filtrar e ordenar resultados
  const filteredResults = React.useMemo(() => {
    return results
      .filter(flight => {
        if (stopFilter && flight.stops !== parseInt(stopFilter)) {
          return false;
        }
        if (cabinFilter && flight.cabin !== cabinFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortKey === 'price' || sortKey === 'milesPrice') {
          return a[sortKey] - b[sortKey];
        }
        if (sortKey === 'duration') {
          return a.duration - b.duration;
        }
        if (sortKey === 'stops') {
          return a.stops - b.stops;
        }
        return 0;
      });
  }, [results, stopFilter, cabinFilter, sortKey]);
  
  // Renderizar rodapé
  React.useEffect(() => {
    const renderFooter = () => {
      const footerContainer = document.getElementById('footer-container');
      if (footerContainer) {
        ReactDOM.render(
          React.createElement('footer', { className: 'app-footer' },
            React.createElement('div', { className: 'footer-content' },
              React.createElement('div', { className: 'footer-logo' }, 'UDS Travel Optimizer'),
              React.createElement('div', { className: 'footer-version' }, 'v1.2.1'),
              React.createElement('div', { className: 'footer-copyright' }, '© 2025 UDS')
            )
          ),
          footerContainer
        );
      }
    };
    
    renderFooter();
    
    return () => {
      const footerContainer = document.getElementById('footer-container');
      if (footerContainer) {
        ReactDOM.unmountComponentAtNode(footerContainer);
      }
    };
  }, []);
  
  // Renderizar componente
  return React.createElement('div', { className: 'app-container' },
    // Formulário de busca por período
    usePeriodSearch && React.createElement('div', { className: 'search-form period-search' },
      React.createElement('div', { className: 'form-row' },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'origin' }, 'Origem'),
          React.createElement(AutocompleteInput, {
            id: 'origin',
            placeholder: 'Código do aeroporto',
            value: origin,
            onChange: handleInputChange
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'destination' }, 'Destino'),
          React.createElement(AutocompleteInput, {
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
        React.createElement('div', { className: 'form-group' },
          React.createElement('button', {
            className: 'btn btn-primary',
            onClick: searchFlightsByPeriod,
            disabled: loading || !origin || !destination || !startMonth || !endMonth
          }, loading ? 'Buscando...' : 'Buscar')
        ),
        React.createElement('div', { className: 'checkbox-group' },
          React.createElement('div', { className: 'checkbox-container' },
            React.createElement('input', {
              id: 'smart-search',
              type: 'checkbox',
              checked: useSmartSearch,
              onChange: handleCheckboxChange
            }),
            React.createElement('label', { htmlFor: 'smart-search' }, 'Busca inteligente')
          )
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('button', {
            className: 'btn btn-secondary',
            onClick: () => setUsePeriodSearch(false)
          }, 'Voltar para busca normal')
        )
      )
    ),
    
    // Formulário de busca normal (datas específicas)
    !usePeriodSearch && React.createElement('div', { className: 'search-form normal-search' },
      React.createElement('div', { className: 'form-row' },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'origin' }, 'Origem'),
          React.createElement(AutocompleteInput, {
            id: 'origin',
            placeholder: 'Código do aeroporto',
            value: origin,
            onChange: handleInputChange
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'destination' }, 'Destino'),
          React.createElement(AutocompleteInput, {
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
            onChange: handleInputChange
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
        React.createElement('div', { className: 'form-group' },
          React.createElement('button', {
            className: 'btn btn-primary',
            onClick: searchFlights,
            disabled: loading || !origin || !destination || !departureDate
          }, loading ? 'Buscando...' : 'Buscar')
        ),
        React.createElement('div', { className: 'checkbox-container' },
          React.createElement('div', { className: 'checkbox-group' },
            React.createElement('input', {
              id: 'smart-search',
              type: 'checkbox',
              checked: useSmartSearch,
              onChange: handleCheckboxChange
            }),
            React.createElement('label', { htmlFor: 'smart-search' }, 'Busca inteligente')
          )
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('button', {
            className: 'btn btn-secondary',
            onClick: () => setUsePeriodSearch(true)
          }, 'Buscar por período')
        )
      )
    ),
    
    // Seletores de moeda e ordenação
    (results.length > 0 || periodResults.length > 0) && React.createElement('div', { className: 'filters-container' },
      React.createElement('div', { className: 'filter-group' },
        React.createElement('label', { htmlFor: 'stop-filter' }, 'Filtrar por paradas'),
        React.createElement('input', {
          id: 'stop-filter',
          type: 'text',
          className: 'form-control',
          placeholder: 'Número de paradas',
          value: stopFilter,
          onChange: handleFilterChange
        })
      ),
      React.createElement('div', { className: 'filter-group' },
        React.createElement('label', { htmlFor: 'cabin-filter' }, 'Filtrar por cabine'),
        React.createElement('select', {
          id: 'cabin-filter',
          className: 'form-control',
          value: cabinFilter,
          onChange: handleFilterChange
        },
          React.createElement('option', { value: '' }, 'Todas as classes'),
          React.createElement('option', { value: 'economy' }, 'Econômica'),
          React.createElement('option', { value: 'premium_economy' }, 'Premium Economy'),
          React.createElement('option', { value: 'business' }, 'Executiva'),
          React.createElement('option', { value: 'first' }, 'Primeira Classe')
        )
      ),
      React.createElement('div', { className: 'filter-group' },
        React.createElement('label', { htmlFor: 'sort-key' }, 'Ordenar por'),
        React.createElement('select', {
          id: 'sort-key',
          className: 'form-control',
          value: sortKey,
          onChange: handleFilterChange
        },
          React.createElement('option', { value: 'price' }, 'Preço'),
          React.createElement('option', { value: 'duration' }, 'Tempo de voo'),
          React.createElement('option', { value: 'stops' }, 'Número de paradas')
        )
      ),
      React.createElement('div', { className: 'filter-group' },
        React.createElement('label', { htmlFor: 'currency' }, 'Moeda'),
        React.createElement('select', {
          id: 'currency',
          className: 'form-control',
          value: currency,
          onChange: handleFilterChange
        },
          React.createElement('option', { value: 'BRL' }, 'Real (BRL)'),
          React.createElement('option', { value: 'USD' }, 'Dólar (USD)')
        )
      )
    ),
    
    // Mensagem de erro
    error && React.createElement('div', { className: 'error-message' }, error),
    
    // Resultados de busca por período
    usePeriodSearch && periodResults.length > 0 && React.createElement('div', { className: 'period-results' },
      React.createElement('h3', null, 'Melhores preços por período'),
      React.createElement('div', { className: 'period-results-info' },
        `Mostrando os melhores preços para viagens de ${tripDuration} dias entre ${startMonth} e ${endMonth}`
      ),
      React.createElement('div', { className: 'period-results-grid' },
        periodResults.map((result, index) => 
          React.createElement('div', { key: index, className: 'period-result-card' },
            React.createElement('div', { className: 'period-result-header' },
              React.createElement('div', { className: 'period-dates' },
                React.createElement('div', { className: 'departure-date' }, `Ida: ${result.departureDate}`),
                React.createElement('div', { className: 'return-date' }, `Volta: ${result.returnDate}`)
              ),
              React.createElement('div', { className: 'period-price' },
                React.createElement('div', { className: 'price-currency' }, 
                  currency === 'BRL' ? 
                    `R$ ${result.price.toFixed(2)}` : 
                    `$ ${(result.price / 5.2).toFixed(2)}`
                ),
                React.createElement('div', { className: 'price-miles' }, `${result.milesPrice.toLocaleString()} milhas`)
              )
            ),
            React.createElement('div', { className: 'period-result-details' },
              React.createElement('div', { className: 'airline-info' },
                React.createElement('span', { className: 'airline-logo' }, 
                  window.airlineIcons[result.airline] || result.airline
                ),
                React.createElement('span', { className: 'airline-name' }, result.airline)
              ),
              React.createElement('div', { className: 'flight-info' },
                React.createElement('div', { className: 'flight-number' }, `Voo: ${result.flightNumber}`),
                React.createElement('div', { className: 'flight-stops' }, `${result.stops} ${result.stops === 1 ? 'parada' : 'paradas'}`),
                React.createElement('div', { className: 'flight-cabin' }, result.cabin === 'economy' ? 'Econômica' : 
                  result.cabin === 'premium_economy' ? 'Premium Economy' : 
                  result.cabin === 'business' ? 'Executiva' : 'Primeira Classe')
              )
            ),
            React.createElement('button', {
              className: 'btn btn-primary select-flight-btn',
              onClick: () => {
                setDepartureDate(result.departureDate);
                setReturnDate(result.returnDate);
                setUsePeriodSearch(false);
                searchFlights();
              }
            }, 'Selecionar')
          )
        )
      )
    ),
    
    // Resultados de busca normal
    !usePeriodSearch && filteredResults.length > 0 && React.createElement('div', { className: 'search-results' },
      React.createElement('table', { className: 'results-table' },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Companhia'),
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
          filteredResults.map(flight => {
            const isExpanded = expandedFlightId === flight.id;
            const isSmartCombo = flight.isSmartCombo;
            const originalPrice = isSmartCombo ? flight.originalPrice : null;
            const savings = isSmartCombo ? ((originalPrice - flight.price) / originalPrice * 100).toFixed(0) : null;
            
            return [
              // Linha principal do voo
              React.createElement('tr', {
                key: flight.id,
                className: isExpanded ? 'flight-row expanded' : 'flight-row',
                onClick: () => toggleFlightDetails(flight.id)
              },
                React.createElement('td', null,
                  React.createElement('div', { className: 'airline-info' },
                    React.createElement('span', { className: 'airline-logo' }, 
                      window.airlineIcons[flight.airline] || flight.airline
                    ),
                    React.createElement('span', { className: 'airline-name' }, flight.airline)
                  )
                ),
                React.createElement('td', null,
                  React.createElement('div', { className: 'price-display' },
                    React.createElement('div', { className: 'price-currency' }, 
                      currency === 'BRL' ? 
                        `R$ ${flight.price.toFixed(2)}` : 
                        `$ ${(flight.price / 5.2).toFixed(2)}`
                    ),
                    React.createElement('div', { className: 'price-miles' }, `${flight.milesPrice.toLocaleString()} milhas`),
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
                React.createElement('td', { colSpan: '8' },
                  React.createElement('div', { className: 'flight-details' },
                    React.createElement('div', { className: 'flight-segments' },
                      React.createElement('h4', null, 'Detalhes do voo'),
                      React.createElement('div', { className: 'segment' },
                        React.createElement('div', { className: 'segment-header' },
                          React.createElement('div', { className: 'segment-airline' },
                            React.createElement('span', { className: 'airline-logo' }, 
                              window.airlineIcons[flight.airline] || flight.airline
                            ),
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
                      ),
                      flight.stops > 0 && flight.stopDetails && flight.stopDetails.map((stop, idx) => 
                        React.createElement('div', { key: idx, className: 'stop-details' },
                          React.createElement('div', { className: 'stop-header' }, `Parada ${idx + 1}`),
                          React.createElement('div', { className: 'stop-airport' }, `Aeroporto: ${stop.airport}`),
                          React.createElement('div', { className: 'stop-duration' }, `Duração: ${stop.duration}`)
                        )
                      )
                    ),
                    isSmartCombo && React.createElement('div', { className: 'smart-combo-info' },
                      React.createElement('h4', null, 'Informação de Busca Inteligente'),
                      React.createElement('p', null, 'Esta é uma combinação inteligente de bilhetes separados que oferece economia em relação à compra direta.'),
                      React.createElement('div', { className: 'price-comparison' },
                        React.createElement('div', { className: 'original-price' },
                          React.createElement('span', null, 'Preço original:'),
                          React.createElement('span', { className: 'price-value' }, 
                            currency === 'BRL' ? 
                              `R$ ${originalPrice.toFixed(2)}` : 
                              `$ ${(originalPrice / 5.2).toFixed(2)}`
                          )
                        ),
                        React.createElement('div', { className: 'combo-price' },
                          React.createElement('span', null, 'Preço com busca inteligente:'),
                          React.createElement('span', { className: 'price-value' }, 
                            currency === 'BRL' ? 
                              `R$ ${flight.price.toFixed(2)}` : 
                              `$ ${(flight.price / 5.2).toFixed(2)}`
                          )
                        ),
                        React.createElement('div', { className: 'savings' },
                          React.createElement('span', null, 'Economia:'),
                          React.createElement('span', { className: 'savings-value' }, `${savings}%`)
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
    ),
    
    // Mensagem de carregamento
    loading && React.createElement('div', { className: 'loading-message' }, 'Buscando as melhores opções...')
  );
}

// Componente para rodapé
function Footer() {
  return React.createElement('footer', { className: 'app-footer' },
    React.createElement('div', { className: 'footer-content' },
      React.createElement('div', { className: 'footer-logo' }, 'UDS Travel Optimizer'),
      React.createElement('div', { className: 'footer-version' }, 'v1.2.0'),
      React.createElement('div', { className: 'footer-copyright' }, '© 2025 UDS. Todos os direitos reservados.')
    )
  );
}

// Inicializar o React e montar a aplicação no DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded disparado");
  
  const root = document.getElementById('root');
  console.log("Elemento root encontrado:", root);
  
  if (root) {
    try {
      console.log("Tentando renderizar o componente App");
      ReactDOM.render(React.createElement(App), root);
      console.log("Renderização do App concluída com sucesso");
    } catch (error) {
      console.error("Erro ao renderizar o componente App:", error);
    }
  } else {
    console.error("Elemento root não encontrado, criando elemento root");
    const rootDiv = document.createElement('div');
    rootDiv.id = 'root';
    document.body.insertBefore(rootDiv, document.body.firstChild);
    
    try {
      console.log("Tentando renderizar o componente App no root criado");
      ReactDOM.render(React.createElement(App), rootDiv);
      console.log("Renderização do App concluída com sucesso");
    } catch (error) {
      console.error("Erro ao renderizar o componente App no root criado:", error);
    }
  }
  
  // Renderizar o rodapé separadamente
  const footerContainer = document.getElementById('footer-container');
  console.log("Elemento footer-container encontrado:", footerContainer);
  
  if (footerContainer) {
    try {
      console.log("Tentando renderizar o rodapé");
      ReactDOM.render(React.createElement(Footer), footerContainer);
      console.log("Renderização do rodapé concluída com sucesso");
    } catch (error) {
      console.error("Erro ao renderizar o rodapé:", error);
    }
  }
});
