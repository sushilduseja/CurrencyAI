import * as tf from '@tensorflow/tfjs';

const predict = async (currencyPair, timeHorizon) => {
  // Load the model from the server
  console.log('Load the model from the server');
  
  const weightsUrl = 'http://localhost:3000/eurusd_model_weights.h5';
  //const modelUrl = 'http://localhost:3000/eurusd_model.h5';
  //const model = await tf.loadGraphModel(modelUrl);
  
  const modelUrl = 'http://localhost:3000/eurusd_model.json';
  const model = await tf.loadLayersModel(modelUrl);
  model.summary();
  //await model.loadWeights(weightsUrl);

  
  // Prepare the input data
  const input = tf.tensor2d([[currencyPair, timeHorizon]]);

  // Normalize the input data
  const inputMin = tf.tensor2d([[0, 0]]);
  const inputMax = tf.tensor2d([[7, 1]]);
  const normalizedInput = input.sub(inputMin).div(inputMax.sub(inputMin));

  // Make the prediction
  const prediction = model.predict(normalizedInput);

  // Denormalize the output
  const outputMin = tf.tensor2d([[-0.4999961853027344]]);
  const outputMax = tf.tensor2d([[0.5000057220458984]]);
  const denormalizedOutput = prediction
    .mul(outputMax.sub(outputMin))
    .add(outputMin);

  // Convert the output to a JavaScript array
  const output = denormalizedOutput.arraySync()[0][0];

  return output;
};

export default predict;
