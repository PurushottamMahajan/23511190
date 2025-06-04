import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);
  const [type, setType] = useState('e');

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:9876/numbers/${type}`);
      setData(res.data);
    } catch (err) {
      alert('Error fetching numbers.');
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Average Calculator Microservice</h1>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border px-2 py-1"
      >
        <option value="p">Prime</option>
        <option value="f">Fibonacci</option>
        <option value="e">Even</option>
        <option value="r">Random</option>
      </select>

      <button
        onClick={fetchData}
        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
      >
        Fetch
      </button>

      {data && (
        <div className="mt-4">
          <p><strong>Previous Window:</strong> {JSON.stringify(data.windowPrevState)}</p>
          <p><strong>Current Window:</strong> {JSON.stringify(data.windowCurrState)}</p>
          <p><strong>New Numbers:</strong> {JSON.stringify(data.numbers)}</p>
          <p><strong>Average:</strong> {data.avg}</p>
        </div>
      )}
    </div>
  );
}

export default App;