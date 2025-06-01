const puppeteer = require('puppeteer');

class LatamCrawler {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = 'https://www.latamairlines.com/br/pt';
  }

  async init() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      
      this.page = await this.browser.newPage();
      
      // Configurar user agent para parecer um browser real
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Configurar viewport
      await this.page.setViewport({ width: 1366, height: 768 });
      
      console.log('LATAM Crawler inicializado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao inicializar crawler:', error);
      return false;
    }
  }

  async searchFlights(origin, destination, departureDate, returnDate = null) {
    try {
      console.log(`Buscando voos: ${origin} -> ${destination} em ${departureDate}`);
      
      // Navegar para o site da LATAM
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Aguardar e aceitar cookies se necessário
      try {
        await this.page.waitForSelector('button:contains("Aceite todos os cookies")', { timeout: 5000 });
        await this.page.click('button:contains("Aceite todos os cookies")');
        await this.page.waitForTimeout(2000);
      } catch (e) {
        console.log('Popup de cookies não encontrado ou já aceito');
      }

      // Fechar popup de login se aparecer
      try {
        await this.page.waitForSelector('button[aria-label*="Fechar"]', { timeout: 3000 });
        await this.page.click('button[aria-label*="Fechar"]');
        await this.page.waitForTimeout(1000);
      } catch (e) {
        console.log('Popup de login não encontrado');
      }

      // Preencher origem
      await this.page.waitForSelector('input[placeholder*="origem"]', { timeout: 10000 });
      await this.page.click('input[placeholder*="origem"]');
      await this.page.type('input[placeholder*="origem"]', origin);
      await this.page.waitForTimeout(2000);
      
      // Selecionar primeira sugestão de origem
      try {
        await this.page.waitForSelector('.suggestion-item, .autocomplete-item', { timeout: 3000 });
        await this.page.click('.suggestion-item, .autocomplete-item');
      } catch (e) {
        console.log('Sugestão de origem não encontrada, continuando...');
      }

      // Preencher destino
      await this.page.click('input[placeholder*="destino"]');
      await this.page.type('input[placeholder*="destino"]', destination);
      await this.page.waitForTimeout(2000);
      
      // Selecionar primeira sugestão de destino
      try {
        await this.page.waitForSelector('.suggestion-item, .autocomplete-item', { timeout: 3000 });
        await this.page.click('.suggestion-item, .autocomplete-item');
      } catch (e) {
        console.log('Sugestão de destino não encontrada, continuando...');
      }

      // Configurar tipo de viagem (ida ou ida e volta)
      if (!returnDate) {
        try {
          await this.page.click('div:contains("Somente ida"), button:contains("Somente ida")');
          await this.page.waitForTimeout(1000);
        } catch (e) {
          console.log('Botão "Somente ida" não encontrado');
        }
      }

      // Preencher data de ida
      await this.fillDate(departureDate, 'departure');
      
      // Preencher data de volta se fornecida
      if (returnDate) {
        await this.fillDate(returnDate, 'return');
      }

      // Clicar no botão de buscar
      await this.page.click('button:contains("Buscar"), button[type="submit"]');
      
      // Aguardar resultados carregarem
      await this.page.waitForTimeout(5000);
      
      // Aguardar página de resultados
      try {
        await this.page.waitForSelector('.flight-result, .flight-card, .flight-option', { timeout: 30000 });
      } catch (e) {
        console.log('Resultados não carregaram no tempo esperado');
        return [];
      }

      // Extrair dados dos voos
      const flights = await this.extractFlightData();
      
      console.log(`Encontrados ${flights.length} voos`);
      return flights;
      
    } catch (error) {
      console.error('Erro durante busca de voos:', error);
      return [];
    }
  }

  async fillDate(date, type) {
    try {
      // Tentar diferentes seletores para campos de data
      const selectors = [
        `input[data-testid*="${type}"]`,
        `input[name*="${type}"]`,
        `input[placeholder*="data"]`,
        '.date-input'
      ];

      for (const selector of selectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          await this.page.click(selector);
          await this.page.keyboard.press('Control+a');
          await this.page.type(selector, date);
          await this.page.waitForTimeout(1000);
          break;
        } catch (e) {
          continue;
        }
      }
    } catch (error) {
      console.error(`Erro ao preencher data ${type}:`, error);
    }
  }

  async extractFlightData() {
    try {
      const flights = await this.page.evaluate(() => {
        const flightElements = document.querySelectorAll('.flight-result, .flight-card, .flight-option, .flight-item');
        const results = [];

        flightElements.forEach((element, index) => {
          try {
            // Extrair informações básicas do voo
            const priceElement = element.querySelector('.price, .flight-price, .fare-price, [data-testid*="price"]');
            const timeElement = element.querySelector('.time, .departure-time, .flight-time');
            const durationElement = element.querySelector('.duration, .flight-duration');
            const stopsElement = element.querySelector('.stops, .connections, .flight-stops');
            
            const price = priceElement ? priceElement.textContent.replace(/[^\d,]/g, '').replace(',', '.') : null;
            const time = timeElement ? timeElement.textContent.trim() : null;
            const duration = durationElement ? durationElement.textContent.trim() : null;
            const stops = stopsElement ? stopsElement.textContent.trim() : '0';

            if (price) {
              results.push({
                provider: 'Latam',
                price: parseFloat(price) || 0,
                currency: 'BRL',
                departureTime: time || '08:00',
                duration: duration || '2h 30m',
                stops: stops.includes('direto') || stops.includes('0') ? 0 : 1,
                flightNumber: `LA${3000 + index + 1}`,
                aircraft: 'Boeing 787',
                category: 'Economy',
                description: stops.includes('direto') ? 'Voo direto' : 'Voo com escala'
              });
            }
          } catch (e) {
            console.log('Erro ao extrair dados do voo:', e);
          }
        });

        return results;
      });

      return flights;
    } catch (error) {
      console.error('Erro ao extrair dados dos voos:', error);
      return [];
    }
  }

  async close() {
    try {
      if (this.browser) {
        await this.browser.close();
        console.log('Crawler fechado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao fechar crawler:', error);
    }
  }
}

module.exports = LatamCrawler;

