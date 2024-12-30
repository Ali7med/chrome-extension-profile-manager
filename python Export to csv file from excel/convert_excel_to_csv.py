import subprocess
import sys

# Function to install a library
def install_library(library_name):
    subprocess.check_call([sys.executable, "-m", "pip", "install", library_name])

# Function to ensure all required libraries are installed
def ensure_libraries_installed(libraries):
    for lib in libraries:
        try:
            __import__(lib)
        except ImportError:
            print(f"{lib} not found. Installing...")
            install_library(lib)

# Check and install necessary libraries
ensure_libraries_installed(["pandas", "openpyxl"])

# Import the libraries after ensuring they are installed
import pandas as pd
import csv

# Function to convert Excel to CSV with UTF-8 encoding
def convert_excel_to_csv(excel_file, csv_file):
    # Read the Excel file into a DataFrame
    df = pd.read_excel(excel_file)

    # Open the CSV file to write the output with UTF-8 encoding
    with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        
        # Write the header
        writer.writerow(['Profile Name', 'Field Name', 'Field Value'])
        
        # Iterate through each row in the Excel file
        for index, row in df.iterrows():
            name = row['name']  # Assuming 'name' column in Excel
            number1 = row['number1']  # Assuming 'number1' column in Excel
            number2 = row['number2']  # Assuming 'number2' column in Excel
            
            # Write two rows for each Excel row
            writer.writerow([name, 'txtVoterNo', number1])
            writer.writerow([name, 'txtBadjNo', number2])

# Example usage
convert_excel_to_csv('input.xlsx', 'output.csv')
