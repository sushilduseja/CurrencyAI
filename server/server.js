import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'; 
import predict from './predict.js';
import path from 'path';

const app = express();
app.use(cors());
app.use(bodyParser.json()); // use body-parser for JSON data
app.use(bodyParser.urlencoded({ extended: true })); // use body-parser for urlencoded data

// Serve static files from the 'public' directory
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.send('Currency AI application!');
});

app.post('/predict', async (req, res) => {
  console.log('req.body:', req.body);
  console.log(`Received request with input: ${JSON.stringify(req.body)}`);
  const { currencyPair, timeHorizon } = req.body;
  console.log(`currencyPair: ${currencyPair}, timeHorizon: ${timeHorizon}`);

  if (!currencyPair || !timeHorizon) {
    return res.status(400).send('Currency pair and time horizon are required');
  }

  const predictions = await predict(currencyPair, timeHorizon);
  console.log('Result:', predictions)

  res.json(predictions);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
