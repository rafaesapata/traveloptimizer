// Versão simplificada do app.js para depuração
console.log("Carregando app.js v1.2.0");

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

// Componente simples para teste
function TestComponent() {
  return React.createElement('div', { style: { padding: '20px', backgroundColor: '#f0f0f0', margin: '20px' } },
    React.createElement('h2', null, 'UDS Travel Optimizer v1.2.0'),
    React.createElement('p', null, 'Se você está vendo esta mensagem, o React está funcionando corretamente.'),
    React.createElement('button', { 
      style: { padding: '10px', backgroundColor: '#0078D7', color: 'white', border: 'none', borderRadius: '4px' },
      onClick: () => alert('React está funcionando!')
    }, 'Clique para testar')
  );
}

// Inicializar o React e montar a aplicação no DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded disparado");
  
  const root = document.getElementById('root');
  console.log("Elemento root encontrado:", root);
  
  if (root) {
    try {
      console.log("Tentando renderizar o componente de teste");
      ReactDOM.render(React.createElement(TestComponent), root);
      console.log("Renderização concluída com sucesso");
    } catch (error) {
      console.error("Erro ao renderizar o componente:", error);
    }
  } else {
    console.error("Elemento root não encontrado, criando elemento root");
    const rootDiv = document.createElement('div');
    rootDiv.id = 'root';
    document.body.insertBefore(rootDiv, document.body.firstChild);
    
    try {
      console.log("Tentando renderizar o componente de teste no root criado");
      ReactDOM.render(React.createElement(TestComponent), rootDiv);
      console.log("Renderização concluída com sucesso");
    } catch (error) {
      console.error("Erro ao renderizar o componente no root criado:", error);
    }
  }
  
  // Renderizar o rodapé separadamente
  const footerContainer = document.getElementById('footer-container');
  console.log("Elemento footer-container encontrado:", footerContainer);
  
  if (footerContainer) {
    try {
      console.log("Tentando renderizar o rodapé");
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
      console.log("Renderização do rodapé concluída com sucesso");
    } catch (error) {
      console.error("Erro ao renderizar o rodapé:", error);
    }
  }
});
