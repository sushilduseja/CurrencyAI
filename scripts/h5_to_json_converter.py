import logging
import tensorflow as tf
import os

# Set up logging
logging.basicConfig(filename='model_conversion.log', level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')

# Define the name of the model
model_name = 'eurusd_model'

# Load the saved Keras model
model_path = os.path.join(os.getcwd(), f'{model_name}.h5')
logging.info(f'Loading model from {model_path}...')
model = tf.keras.models.load_model(model_path)

# Convert the model to JSON format
logging.info('Converting model to JSON format...')
model_json = model.to_json()

# Save the JSON format model
json_path = os.path.join(os.getcwd(), f'{model_name}.json')
logging.info(f'Saving model in JSON format to {json_path}...')
with open(json_path, 'w') as json_file:
    json_file.write(model_json)

logging.info('Model conversion complete.')
