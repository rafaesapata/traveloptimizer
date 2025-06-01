const express = require('express');
const cors = require('cors');
const searchers = require('./searchers');

const app = express();
app.use(cors());
app.use(express.static('public'));

app.get('/api/flights', async (req, res) => {
  const { origin, destination } = req.query;
  if (!origin || !destination) {
    return res.status(400).json({ error: 'origin and destination are required' });
  }

  try {
    const results = await Promise.all([
      searchers.searchSkyscanner(origin, destination),
      searchers.searchKayak(origin, destination),
      searchers.searchExample(origin, destination)
    ]);
    const flights = results.flat();
    res.json(flights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search flights' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
