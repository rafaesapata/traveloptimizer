console.log("Teste de execução básica do JavaScript");

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

// Componente mínimo de teste
function TestComponent() {
  return React.createElement('div', null, 'Teste de renderização React funcionando!');
}

// Renderizar o componente de teste quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded disparado");
  const rootElement = document.getElementById('root');
  console.log("Elemento root encontrado:", rootElement);
  
  if (rootElement) {
    try {
      console.log("Tentando renderizar o componente de teste");
      ReactDOM.render(React.createElement(TestComponent), rootElement);
      console.log("Renderização do componente de teste concluída com sucesso");
    } catch (error) {
      console.error("Erro ao renderizar o componente de teste:", error);
    }
  }
});
