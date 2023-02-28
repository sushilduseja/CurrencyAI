import logging
import os
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.keras.layers import Dense, LSTM
from tensorflow.keras.models import Sequential

# Set up logging
logging.basicConfig(filename='model.log', level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')

# Construct the absolute path to the eurusd_preprocessed.csv file
data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))
eurusd_preprocessed_file = os.path.join(data_dir, 'eurusd_preprocessed.csv')

# Load the preprocessed data
df = pd.read_csv(eurusd_preprocessed_file)

# Split the data into training and validation sets
train_data, val_data = train_test_split(df, test_size=0.2, shuffle=False)

# Define the number of time steps to look back for predictions
look_back = 10

# Create training and validation sequences
def create_sequences(data):
    x = []
    y = []
    for i in range(look_back, len(data)):
        x.append(data.iloc[i-look_back:i].values)
        y.append(data.iloc[i].values)
    return np.array(x), np.array(y)

x_train, y_train = create_sequences(train_data)
x_val, y_val = create_sequences(val_data)

# Define the model architecture
model = Sequential()
model.add(LSTM(20, return_sequences=True, input_shape=(look_back, 2)))
model.add(LSTM(20))
model.add(Dense(2, activation='relu'))

# Compile the model
model.compile(optimizer='adam', loss='mse')

# Train the model
logging.info('Training model...')
history = model.fit(x_train, y_train, validation_data=(x_val, y_val), epochs=50, batch_size=64)

# Save the model in JSON format
logging.info('Saving model...')
model_json = model.to_json()
with open('eurusd_model.json', 'w') as json_file:
    json_file.write(model_json)

# Save the model weights
model.save_weights('eurusd_model_weights.h5')

logging.info('Model training complete.')
