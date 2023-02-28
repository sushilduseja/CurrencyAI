import os
import pandas as pd
from sklearn.model_selection import train_test_split

data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))

# Load the preprocessed data
df = pd.read_csv(os.path.join(data_dir, 'eurusd_preprocessed.csv'))

# Split the data into training and validation sets
train_data, val_data = train_test_split(df, test_size=0.2, shuffle=False)

# Take a subset of the validation set to use as the test set
test_data = val_data[-int(0.2 * len(val_data)):]

# Save the test set to a new CSV file
test_data.to_csv(os.path.join(data_dir, 'eurusd_test.csv'), index=False)

print('Test data created and saved to data/eurusd_test.csv')
