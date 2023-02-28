import os
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Get the absolute path of the data directory
data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))

# Load the preprocessed test data
test_data = pd.read_csv(os.path.join(data_dir, 'eurusd_test.csv'))
print("Test data loaded successfully.")

# Load the trained model
model = tf.keras.models.load_model(os.path.join(data_dir, '..', 'models', 'eurusd_model.h5'))
print("Trained model loaded successfully.")

# Preprocess the test data in the same way as the training data
look_back = 10

def create_sequences(data):
    x = []
    y = []
    for i in range(look_back, len(data)):
        x.append(data.iloc[i-look_back:i].values)
        y.append(data.iloc[i].values)
    return np.array(x), np.array(y)

x_test, y_test = create_sequences(test_data)
print("Test data preprocessed successfully.")

# Make predictions using the trained model
predictions = model.predict(x_test)
print("Predictions made successfully.")

# Evaluate the performance of the model
# You can use appropriate metrics depending on your problem
accuracy = accuracy_score(np.argmax(y_test, axis=1), np.argmax(predictions, axis=1))
precision = precision_score(np.argmax(y_test, axis=1), np.argmax(predictions, axis=1), average='macro')
recall = recall_score(np.argmax(y_test, axis=1), np.argmax(predictions, axis=1), average='macro')
f1 = f1_score(np.argmax(y_test, axis=1), np.argmax(predictions, axis=1), average='macro')

print('Accuracy:', accuracy)
print('Precision:', precision)
print('Recall:', recall)
print('F1 score:', f1)