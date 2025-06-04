const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9876;

const WINDOW_SIZE = 10;
let windowNumbers = []; // Current window state

const API_MAP = {
  p: 'http://20.244.56.144/evaluation-service/primes',
  f: 'http://20.244.56.144/evaluation-service/fibo',
  e: 'http://20.244.56.144/evaluation-service/even',
  r: 'http://20.244.56.144/evaluation-service/rand',
};

app.get('/numbers/:numberid', async (req, res) => {
  const numberid = req.params.numberid;
  const apiUrl = API_MAP[numberid];

  if (!apiUrl) {
    return res.status(400).json({ error: 'Invalid number ID. Use p, f, e, or r.' });
  }

  const prevWindow = [...windowNumbers];
  let newNumbers = [];

  try {
    const response = await axios.get(apiUrl, { timeout: 50000 });
    if (response.data?.numbers) {
      newNumbers = response.data.numbers;
    }
  } catch (error) {
    console.error('Error :',error.message);
    return res.status(500).json({ error: 'Failed to fetch data within 500ms or other error.' });
  }


  const uniqueNewNumbers = newNumbers.filter(num => !windowNumbers.includes(num));
  windowNumbers = [...windowNumbers, ...uniqueNewNumbers].slice(-WINDOW_SIZE);

  // Calculate average
  const average =
    windowNumbers.length > 0
      ? parseFloat((windowNumbers.reduce((a, b) => a + b, 0) / windowNumbers.length).toFixed(2))
      : 0;

  res.json({
    windowPrevState: prevWindow,
    windowCurrState: windowNumbers,
    numbers: newNumbers,
    avg: average,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});