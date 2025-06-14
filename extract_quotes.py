#!/usr/bin/env python3
import csv

def extract_second_column():
    """Extract the second column from quotes.csv and save to quotes_1.txt"""
    try:
        with open('quotes.csv', 'r', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            
            # Skip the header row
            next(reader)
            
            # Extract second column (index 1) from each row
            insights = []
            for row in reader:
                if len(row) >= 2:  # Make sure row has at least 2 columns
                    insights.append(row[1])
            
        # Write to quotes_1.txt
        with open('quotes_1.txt', 'w', encoding='utf-8') as outfile:
            for insight in insights:
                outfile.write(insight + '\n')
        
        print(f"Successfully extracted {len(insights)} quotes to quotes_1.txt")
        
    except FileNotFoundError:
        print("Error: quotes.csv file not found")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_second_column() 