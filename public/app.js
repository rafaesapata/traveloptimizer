const { useState, useEffect } = React;

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [flights, setFlights] = useState([]);
  const [sortKey, setSortKey] = useState('price');
  const [filterStops, setFilterStops] = useState('');

  const fetchFlights = async () => {
    if (!origin || !destination) return;
    const res = await fetch(`/api/flights?origin=${origin}&destination=${destination}`);
    const data = await res.json();
    setFlights(data);
  };

  const sortedFlights = flights
    .filter(f => filterStops === '' || f.stops === Number(filterStops))
    .sort((a, b) => a[sortKey] > b[sortKey] ? 1 : -1);

  return (
    React.createElement('div', null,
      React.createElement('div', { className: 'search-form' },
        React.createElement('input', {
          placeholder: 'Origin', value: origin,
          onChange: e => setOrigin(e.target.value)
        }),
        React.createElement('input', {
          placeholder: 'Destination', value: destination,
          onChange: e => setDestination(e.target.value)
        }),
        React.createElement('button', { onClick: fetchFlights }, 'Search')
      ),
      React.createElement('div', null,
        'Filter stops:',
        React.createElement('input', {
          type: 'number', min: '0', value: filterStops,
          onChange: e => setFilterStops(e.target.value)
        })
      ),
      React.createElement('table', null,
        React.createElement('thead', null,
          React.createElement('tr', null,
            ['provider','price','stops','duration','category'].map(key =>
              React.createElement('th', {
                key,
                onClick: () => setSortKey(key)
              }, key)
            )
          )
        ),
        React.createElement('tbody', null,
          sortedFlights.map((f, i) =>
            React.createElement('tr', { key: i },
              React.createElement('td', null, f.provider),
              React.createElement('td', null, `$${f.price}`),
              React.createElement('td', null, f.stops),
              React.createElement('td', null, `${f.duration}h`),
              React.createElement('td', null, f.category)
            )
          )
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
