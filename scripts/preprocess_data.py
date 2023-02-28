import os
import pandas as pd

print('Starting data preprocessing...')

# Construct the absolute path to the eurusd.csv file
data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))
eurusd_file = os.path.join(data_dir, 'eurusd.csv')

# Load the CSV file into a DataFrame
df = pd.read_csv(eurusd_file)

# Select the relevant columns
df = df[['Date', 'Time', 'BO', 'AO']]

# Remove rows with missing data
df = df.dropna()

# Convert the date and time columns to a datetime format
df['Date'] = pd.to_datetime(df['Date'] + ' ' + df['Time'])

# Remove the original date and time columns
df = df.drop(['Date', 'Time'], axis=1)

# Normalize the data using Min-Max scaling
df = (df - df.min()) / (df.max() - df.min())

# Save the preprocessed data to a new CSV file
preprocessed_file = os.path.join(data_dir, 'eurusd_preprocessed.csv')
df.to_csv(preprocessed_file, index=False)

print('Preprocessing complete.')
