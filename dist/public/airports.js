// Lista de aeroportos principais com código IATA e nome
const airports = [
  { code: 'MGF', name: 'Maringá - Silvio Name Junior Regional Airport', country: 'Brasil' },
  { code: 'MCO', name: 'Orlando International Airport', country: 'Estados Unidos' },
  { code: 'GRU', name: 'São Paulo - Guarulhos International Airport', country: 'Brasil' },
  { code: 'BSB', name: 'Brasília - Presidente Juscelino Kubitschek International Airport', country: 'Brasil' },
  { code: 'CGH', name: 'São Paulo - Congonhas Airport', country: 'Brasil' },
  { code: 'GIG', name: 'Rio de Janeiro - Galeão International Airport', country: 'Brasil' },
  { code: 'SDU', name: 'Rio de Janeiro - Santos Dumont Airport', country: 'Brasil' },
  { code: 'CNF', name: 'Belo Horizonte - Confins International Airport', country: 'Brasil' },
  { code: 'SSA', name: 'Salvador - Deputado Luís Eduardo Magalhães International Airport', country: 'Brasil' },
  { code: 'REC', name: 'Recife - Guararapes–Gilberto Freyre International Airport', country: 'Brasil' },
  { code: 'FOR', name: 'Fortaleza - Pinto Martins International Airport', country: 'Brasil' },
  { code: 'CWB', name: 'Curitiba - Afonso Pena International Airport', country: 'Brasil' },
  { code: 'POA', name: 'Porto Alegre - Salgado Filho International Airport', country: 'Brasil' },
  { code: 'VCP', name: 'Campinas - Viracopos International Airport', country: 'Brasil' },
  { code: 'FLN', name: 'Florianópolis - Hercílio Luz International Airport', country: 'Brasil' },
  { code: 'NAT', name: 'Natal - São Gonçalo do Amarante International Airport', country: 'Brasil' },
  { code: 'BEL', name: 'Belém - Val de Cans International Airport', country: 'Brasil' },
  { code: 'MAO', name: 'Manaus - Eduardo Gomes International Airport', country: 'Brasil' },
  { code: 'JFK', name: 'New York - John F. Kennedy International Airport', country: 'Estados Unidos' },
  { code: 'LAX', name: 'Los Angeles International Airport', country: 'Estados Unidos' },
  { code: 'ORD', name: 'Chicago - O\'Hare International Airport', country: 'Estados Unidos' },
  { code: 'ATL', name: 'Atlanta - Hartsfield-Jackson Atlanta International Airport', country: 'Estados Unidos' },
  { code: 'DFW', name: 'Dallas/Fort Worth International Airport', country: 'Estados Unidos' },
  { code: 'DEN', name: 'Denver International Airport', country: 'Estados Unidos' },
  { code: 'SFO', name: 'San Francisco International Airport', country: 'Estados Unidos' },
  { code: 'LAS', name: 'Las Vegas - Harry Reid International Airport', country: 'Estados Unidos' },
  { code: 'MIA', name: 'Miami International Airport', country: 'Estados Unidos' },
  { code: 'BOS', name: 'Boston - Logan International Airport', country: 'Estados Unidos' },
  { code: 'SEA', name: 'Seattle-Tacoma International Airport', country: 'Estados Unidos' },
  { code: 'LHR', name: 'London - Heathrow Airport', country: 'Reino Unido' },
  { code: 'CDG', name: 'Paris - Charles de Gaulle Airport', country: 'França' },
  { code: 'FRA', name: 'Frankfurt Airport', country: 'Alemanha' },
  { code: 'AMS', name: 'Amsterdam - Schiphol Airport', country: 'Holanda' },
  { code: 'MAD', name: 'Madrid - Adolfo Suárez Madrid–Barajas Airport', country: 'Espanha' },
  { code: 'FCO', name: 'Rome - Leonardo da Vinci–Fiumicino Airport', country: 'Itália' },
  { code: 'BCN', name: 'Barcelona - El Prat Airport', country: 'Espanha' },
  { code: 'IST', name: 'Istanbul Airport', country: 'Turquia' },
  { code: 'DXB', name: 'Dubai International Airport', country: 'Emirados Árabes Unidos' },
  { code: 'HKG', name: 'Hong Kong International Airport', country: 'China' },
  { code: 'SIN', name: 'Singapore Changi Airport', country: 'Singapura' },
  { code: 'ICN', name: 'Seoul - Incheon International Airport', country: 'Coreia do Sul' },
  { code: 'NRT', name: 'Tokyo - Narita International Airport', country: 'Japão' },
  { code: 'HND', name: 'Tokyo - Haneda Airport', country: 'Japão' },
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', country: 'Austrália' },
  { code: 'MEL', name: 'Melbourne Airport', country: 'Austrália' },
  { code: 'AKL', name: 'Auckland Airport', country: 'Nova Zelândia' },
  { code: 'JNB', name: 'Johannesburg - O. R. Tambo International Airport', country: 'África do Sul' },
  { code: 'CAI', name: 'Cairo International Airport', country: 'Egito' },
  { code: 'GRU', name: 'São Paulo - Guarulhos International Airport', country: 'Brasil' },
  { code: 'EZE', name: 'Buenos Aires - Ministro Pistarini International Airport', country: 'Argentina' },
  { code: 'SCL', name: 'Santiago - Arturo Merino Benítez International Airport', country: 'Chile' },
  { code: 'LIM', name: 'Lima - Jorge Chávez International Airport', country: 'Peru' },
  { code: 'BOG', name: 'Bogotá - El Dorado International Airport', country: 'Colômbia' },
  { code: 'MEX', name: 'Mexico City International Airport', country: 'México' },
  { code: 'CUN', name: 'Cancún International Airport', country: 'México' },
  { code: 'PTY', name: 'Panama City - Tocumen International Airport', country: 'Panamá' },
  { code: 'UIO', name: 'Quito - Mariscal Sucre International Airport', country: 'Equador' },
  { code: 'CCS', name: 'Caracas - Simón Bolívar International Airport', country: 'Venezuela' },
  { code: 'HAV', name: 'Havana - José Martí International Airport', country: 'Cuba' }
];

// Função para buscar aeroportos com base em um termo de pesquisa
function searchAirports(term) {
  if (!term || term.length < 2) return [];
  
  const searchTerm = term.toLowerCase();
  return airports.filter(airport => 
    airport.code.toLowerCase().includes(searchTerm) || 
    airport.name.toLowerCase().includes(searchTerm) ||
    airport.country.toLowerCase().includes(searchTerm)
  ).slice(0, 10); // Limitar a 10 resultados para não sobrecarregar a interface
}
