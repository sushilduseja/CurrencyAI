import React, { useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

function App() {
  const [chart, setChart] = useState(null);
  const [currencyPair, setCurrencyPair] = useState('');
  const [timeHorizon, setTimeHorizon] = useState('');
  const [predictions, setPredictions] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('postData:', { currencyPair, timeHorizon });
    axios.post('http://localhost:3000/predict', { currencyPair, timeHorizon })
      .then((response) => {
        console.log('response.data:', response.data);
        setPredictions(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert('An error occurred while trying to fetch the predictions. Please try again later.');
      });
  };

  const handleCurrencyPairChange = (event) => {
    setCurrencyPair(event.target.value);
  };

  const handleTimeHorizonChange = (event) => {
    setTimeHorizon(event.target.value);
  };

  const handleReset = () => {
    setCurrencyPair('');
    setTimeHorizon('');
    setPredictions([]);
    if (chart) {
      chart.destroy();
      setChart(null);
    }
  };

  return (
    <div className="container">
      <h1>CurrencyAI</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currencyPair">Currency Pair:</label>
          <select className="form-control" id="currencyPair" value={currencyPair} onChange={handleCurrencyPairChange} required>
            <option value="">-- Please select --</option>
            <option value="eurusd">EUR/USD</option>
            <option value="gbpusd">GBP/USD</option>
            <option value="usdjpy">USD/JPY</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="timeHorizon">Time Horizon:</label>
          <select className="form-control" id="timeHorizon" value={timeHorizon} onChange={handleTimeHorizonChange} required>
            <option value="">-- Please select --</option>
            <option value="6">6 months</option>
            <option value="12">1 year</option>
            <option value="24">2 years</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mr-2">Predict</button>
        <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
      </form>
      {predictions.length > 0 && (
        <>
          <hr />
          <h2>Results</h2>
          <p>Predictions for {currencyPair.toUpperCase()} for the next {timeHorizon} months:</p>
          <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>{prediction}</li>
            ))}
          </ul>
          <canvas id="chart"></canvas>
        </>
      )}
    </div>
  );
}

export default App;
