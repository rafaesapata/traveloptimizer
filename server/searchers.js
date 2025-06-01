function createFlight(provider, origin, destination, price, stops, duration, category) {
  return {
    provider,
    origin,
    destination,
    price,
    stops,
    duration,
    category
  };
}

async function searchSkyscanner(origin, destination) {
  // Placeholder data. In a real implementation this would request the provider's API.
  return [
    createFlight('Skyscanner', origin, destination, 500, 1, 8, 'Economy'),
    createFlight('Skyscanner', origin, destination, 750, 0, 6, 'Business')
  ];
}

async function searchKayak(origin, destination) {
  return [
    createFlight('Kayak', origin, destination, 480, 1, 9, 'Economy'),
    createFlight('Kayak', origin, destination, 670, 0, 7, 'Economy')
  ];
}

async function searchExample(origin, destination) {
  return [
    createFlight('ExampleAir', origin, destination, 520, 2, 10, 'Economy'),
    createFlight('ExampleAir', origin, destination, 900, 1, 8, 'First')
  ];
}

module.exports = { searchSkyscanner, searchKayak, searchExample };
