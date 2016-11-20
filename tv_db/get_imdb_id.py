import csv
import string
import requests
import json
import time

with open('tv.csv', "r") as f:
    csv_r = csv.reader(f)
    is_first_row = True
    for row in csv_r:
        if is_first_row:  # skip header row
            is_first_row = False
            continue
        id_ = row[-2]
        import sys; sys.stderr.write(id_ + "\n")  # TODO remove this line
        name = row[2]
        r = requests.get('http://www.omdbapi.com/?t=' + '+'.join(name.split()))
        if not r:
            time.sleep(1)
        try:
            d = json.loads(r.text)
        except ValueError:
            continue
        if 'imdbID' not in d:  # movie not found
            continue
        print "UPDATE tv SET imdbid='" + d['imdbID'] + "' WHERE id=" + id_ + ';'
