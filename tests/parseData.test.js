const parseData = require('../src/utils/parseData');

describe('parseData function', () => {
  it('should parse the data from the CSV file', async () => {
    const data = await parseData();
    console.log(`Parsed data length: ${data.length}`);
    expect(data.length).toBeGreaterThan(0);
  });
});
