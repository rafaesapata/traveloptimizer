// Mapeamento de companhias aéreas para seus ícones SVG
window.airlineIcons = {
  'Skyscanner': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="#0770e3" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16.5l-5-5 1.41-1.41L11 15.67l6.59-6.59L19 10.5l-8 8z"/>
  </svg>`,
  
  'Kayak': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="#FF690F" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
  </svg>`,
  
  'Decolar': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="#00B2EF" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z"/>
  </svg>`,
  
  'Copa Airlines': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="#004B87" d="M22 16.21v-1.895L14 8V4a2 2 0 0 0-4 0v4L2 14.315v1.895L10 16v2a2 2 0 0 0 4 0v-2l8 .21z"/>
  </svg>`,
  
  'Azul': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="#00AEEF" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
  </svg>`,
  
  'Latam': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="#E30613" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>`,
  
  'Gol': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="#FF7800" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z"/>
  </svg>`,
  
  'Combo Inteligente': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="#FF6B00" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>`,
  
  'default': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="#757575" d="M22 16.21v-1.895L14 8V4a2 2 0 0 0-4 0v4L2 14.315v1.895L10 16v2a2 2 0 0 0 4 0v-2l8 .21z"/>
  </svg>`
};

// Função para obter o ícone de uma companhia aérea
window.getAirlineIcon = function(airline) {
  if (!airline) return window.airlineIcons['default'];
  
  // Normalizar o nome da companhia aérea para aumentar chances de correspondência
  const normalizedAirline = airline.toString().trim();
  
  // Verificar correspondência exata
  if (window.airlineIcons[normalizedAirline]) {
    return window.airlineIcons[normalizedAirline];
  }
  
  // Verificar correspondência case-insensitive
  const airlineKeys = Object.keys(window.airlineIcons);
  for (const key of airlineKeys) {
    if (key.toLowerCase() === normalizedAirline.toLowerCase()) {
      return window.airlineIcons[key];
    }
  }
  
  // Fallback para ícone padrão
  return window.airlineIcons['default'];
}
