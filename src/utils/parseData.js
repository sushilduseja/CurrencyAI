const csv = require('csv-parser');
const fs = require('fs');

const parseData = () => {
  const results = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('./data/eurusd.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

module.exports = parseData;
