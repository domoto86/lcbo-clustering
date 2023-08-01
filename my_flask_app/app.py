# app.py
import csv
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

def read_csv_data(column_name):
    data = []
    unique_values = set()

    with open('category_cluster.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)
            unique_values.add(row[column_name])

    return data, sorted(list(unique_values))

# Logo Page
@app.route('/')
def index():
    return render_template('index.html')

# Filtering Page
@app.route('/filter', methods=['GET', 'POST'])
def filter_page():
    filter_column = request.form.get('filter_column')
    filter_value = request.form.get('filter_value')

    filtered_data = []

    if filter_column:
        data, unique_values = read_csv_data(filter_column)
        filtered_data = [row for row in data if row[filter_column] == filter_value] if filter_value else data
    else:
        data, unique_values = read_csv_data('Varietal')

    # Sort the filtered data by Sugar Content (g/L)
    filtered_data = sorted(filtered_data, key=lambda x: float(x['Sugar Content (g/L)']))

    return render_template('filter.html', data=filtered_data, unique_values=unique_values, filter_column=filter_column, filter_value=filter_value)

# Wine Details Page
@app.route('/wine_details/<int:wine_id>', methods=['GET'])
def wine_details(wine_id):
    filtered_data = request.args.get('filtered_data')
    if filtered_data:
        # Convert the filtered_data string back to a list using eval()
        filtered_data = eval(filtered_data)
        if 0 <= wine_id < len(filtered_data):
            wine = filtered_data[wine_id]
            return render_template('wine_details.html', wine=wine)
    
    # Handle the case where the wine_id is out of range or invalid
    return "Wine details not found."

if __name__ == '__main__':
    app.run(debug=True)
