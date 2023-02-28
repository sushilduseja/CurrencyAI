import * as tf from '@tensorflow/tfjs';
import * as webgl from '@tensorflow/tfjs-backend-webgl';
// import * as wasm from '@tensorflow/tfjs-backend-wasm';
// import * as webgpu from '@tensorflow/tfjs-backend-webgpu';
import setBackend from '@tensorflow/tfjs-core';
//import { backend } from '@tensorflow/tfjs-core/dist/ops/operation';

import * as cpu from '@tensorflow/tfjs-backend-cpu';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import http from 'http';


await tf.ready();

// Set up the backend order
tf.registerBackend('webgl', () => new tf.webgl.WebGLBackend());
// await tf.setPlatform('cpu');

await tf.setBackend('webgl').then(() => {
  console.log('WebGL backend initialized');
}).catch((err) => {
  console.log('Failed to initialize WebGL backend:', err.message);
});

// console.log('Current backend:', backend());

console.log('tf.version = ',tf.version);
console.log('tf.backend = ', tf.getBackend());
console.log('tf.version.backend = ', tf.version.backend);

//tf.registerBackend('wasm', () => new wasm.WasmBackend());

const NUM_FEATURES = 2;

// Load the model
const loadModel = async () => {
  try {
    // Load the model from the server
    console.log('Load the model from the server');

    const modelUrl = 'http://localhost:3000/eurusd_model.json';
    const model = await tf.loadLayersModel(modelUrl);
    model.summary();

    console.log('Model loaded as JSON file');
    return model;
  } catch (error) {
    console.log(`Failed to load model with error: ${error.message}`);
    throw new Error('Failed to load model');
  }

};

// Preprocess the data
const preprocessData = async (path) => {
  const x = [];
  const y = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (row) => {
        const rowData = Object.values(row).slice(1, -1).map(Number);
        x.push(rowData);
        y.push(row.close);
      })
      .on('end', () => {
        resolve({ x, y });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

// Get the predictions
// const getPredictions = async (model, x) => {
//   // await tf.setBackend('cpu');
//   // await tf.setPlatform('cpu');

//   // const tensorX = tf.tensor(x);
//   const typedArrayX = new Float32Array(x);
//   const tensorX = tf.tensor(typedArrayX);
//   console.log('tensorX.shape', tensorX.shape);

//   const predictions = model.predict(tensorX).dataSync();
//   tensorX.dispose();
  
//   return predictions;
// };

const getPredictions = async (model, x) => {
  try {
    const tensorX = tf.tensor(x);
    console.log('tensorX.shape = ', tensorX.shape);

    const batchSize = 1;
    const timeSteps = tensorX.shape[0];
    const numFeatures = tensorX.shape[1];
    const tensorXBatched = tensorX.reshape([batchSize, timeSteps, numFeatures]);
    console.log('tensorXBatched.shape = ', tensorXBatched.shape);
  
    const predictions = model.predict(tensorXBatched).dataSync();
    tensorX.dispose();
    tensorXBatched.dispose();
  
    return predictions;
  } catch (error) {
    console.error(error);
    return { error: 'Error predicting currency values' };
  }
};


// API endpoint
export const predict = async (currencyPair, timeHorizon) => {
  try {
    await tf.ready(); // wait for TensorFlow.js to be ready
    const model = await loadModel();
    const data = await preprocessData(`../data/${currencyPair}.csv`);
    const { x, y } = data;
    const input = x.slice(-timeHorizon) || []; // add default value of an empty array if x.slice() is undefined or null

    // const reshapedInput = tf.tensor(input).reshape([-1, timeHorizon, NUM_FEATURES]);
    // const predictions = await getPredictions(model, reshapedInput);
    
    console.log('input shape:', [input.length, NUM_FEATURES]);

    const reshapedInput = tf.tensor(input).expandDims();
    const predictions = await getPredictions(model, reshapedInput);

    return { input, predictions, actual: y.slice(-timeHorizon) };
  } catch (error) {
    console.error(error);
    return { error: 'Error predicting currency values' };
  }
};

export default predict;
