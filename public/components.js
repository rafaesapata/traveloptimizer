console.log("Carregando components.js");

// Componente Error Boundary para capturar erros de renderização
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre a UI alternativa
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Você também pode registrar o erro em um serviço de relatório de erros
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI alternativa
      return React.createElement('div', { className: 'error-container' },
        React.createElement('h2', null, 'Algo deu errado'),
        React.createElement('p', null, 'Ocorreu um erro ao renderizar esta parte da aplicação.'),
        React.createElement('p', null, 'Detalhes: ', this.state.error && this.state.error.toString()),
        React.createElement('button', { 
          onClick: () => window.location.reload(),
          className: 'btn btn-primary'
        }, 'Recarregar página')
      );
    }

    return this.props.children;
  }
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
        (airport.code && airport.code.toLowerCase().includes(value.toLowerCase())) || 
        (airport.name && airport.name.toLowerCase().includes(value.toLowerCase())) ||
        (airport.city && airport.city.toLowerCase().includes(value.toLowerCase())) ||
        (airport.country && airport.country.toLowerCase().includes(value.toLowerCase()))
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
      onFocus: () => inputValue.length >= 2 && suggestions.length > 0 && setShowSuggestions(true),
      onBlur: handleBlur
    }),
    showSuggestions && suggestions.length > 0 && React.createElement('div', { className: 'suggestions-container' },
      React.createElement('ul', { className: 'suggestions-list' },
        suggestions.map((suggestion, index) => 
          React.createElement('li', {
            key: `${suggestion.code}-${index}`,
            className: index === selectedIndex ? 'suggestion-item selected' : 'suggestion-item',
            onClick: () => handleSuggestionClick(suggestion)
          },
            React.createElement('div', { className: 'suggestion-code' }, suggestion.code || ''),
            React.createElement('div', { className: 'suggestion-details' },
              React.createElement('div', { className: 'suggestion-name' }, suggestion.name || ''),
              React.createElement('div', { className: 'suggestion-location' }, `${suggestion.city || ''}, ${suggestion.country || ''}`)
            )
          )
        )
      )
    )
  );
}

// Componente de rodapé
function Footer() {
  return React.createElement('footer', { className: 'footer' },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'footer-content' },
        React.createElement('div', { className: 'footer-copyright' },
          React.createElement('p', null, '© 2025 UDS Travel Optimizer v1.3.2')
        ),
        React.createElement('div', { className: 'footer-links' },
          React.createElement('a', { href: '#', className: 'footer-link' }, 'Termos de Uso'),
          React.createElement('a', { href: '#', className: 'footer-link' }, 'Política de Privacidade'),
          React.createElement('a', { href: '#', className: 'footer-link' }, 'Contato')
        )
      )
    )
  );
}

// Exportar componentes para uso global
window.Components = {
  ErrorBoundary,
  AutocompleteInput,
  Footer
};

console.log("components.js carregado com sucesso");
