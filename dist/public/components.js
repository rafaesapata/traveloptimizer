// Componente de Autocomplete para aeroportos
function AirportAutocomplete({ id, label, value, onChange, placeholder }) {
  const [inputValue, setInputValue] = React.useState(value);
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = React.useRef(null);
  
  // Efeito para sincronizar o valor externo com o interno
  React.useEffect(() => {
    // Se o valor externo for um código de aeroporto válido, mantenha-o
    const airport = airports.find(a => a.code === value);
    if (airport) {
      setInputValue(value);
    }
  }, [value]);
  
  // Função para atualizar as sugestões com base no texto digitado
  const updateSuggestions = (text) => {
    if (!text || text.length < 2) {
      setSuggestions([]);
      return;
    }
    
    const results = searchAirports(text);
    setSuggestions(results);
    setSelectedIndex(-1);
  };
  
  // Manipulador para mudança no input
  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputValue(text);
    updateSuggestions(text);
    setShowSuggestions(true);
  };
  
  // Manipulador para seleção de sugestão
  const handleSelectSuggestion = (airport) => {
    setInputValue(airport.code);
    setSuggestions([]);
    setShowSuggestions(false);
    onChange(airport.code);
  };
  
  // Manipulador para teclas de navegação
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    // Seta para baixo
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    }
    // Seta para cima
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    }
    // Enter para selecionar
    else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[selectedIndex]);
    }
    // Escape para fechar sugestões
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
  // Manipulador para perda de foco
  const handleBlur = () => {
    // Pequeno atraso para permitir cliques nas sugestões
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };
  
  return React.createElement('div', { className: 'form-group' },
    React.createElement('label', { htmlFor: id }, label),
    React.createElement('div', { className: 'autocomplete-container' },
      React.createElement('input', {
        ref: inputRef,
        id: id,
        type: 'text',
        className: 'autocomplete-input',
        value: inputValue,
        onChange: handleInputChange,
        onKeyDown: handleKeyDown,
        onFocus: () => updateSuggestions(inputValue),
        onBlur: handleBlur,
        placeholder: placeholder || 'Digite o código ou nome do aeroporto'
      }),
      showSuggestions && suggestions.length > 0 && 
        React.createElement('div', { className: 'autocomplete-results' },
          suggestions.map((airport, index) => 
            React.createElement('div', {
              key: airport.code,
              className: `autocomplete-item ${index === selectedIndex ? 'selected' : ''}`,
              onClick: () => handleSelectSuggestion(airport)
            },
              React.createElement('span', { className: 'autocomplete-code' }, airport.code),
              React.createElement('span', { className: 'autocomplete-name' }, airport.name),
              React.createElement('span', { className: 'autocomplete-country' }, `(${airport.country})`)
            )
          )
        )
    )
  );
}
