import csv
import string

with open('tv.csv', "r") as f:
    csv_r = csv.reader(f)
    for row in csv_r:
        overview = row[3]
        for w in overview.split():
            ww = ''.join(ch for ch in w if ch.isalnum())
            print ww
