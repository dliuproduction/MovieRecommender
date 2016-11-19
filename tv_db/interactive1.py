# coding: utf-8
import requests
from scraper import scraper
import csv


def video_crawler(scraper, index, vtype):
    url='https://api.themoviedb.org/3/{}/{}?api_key=ebb73940fb64b06e2f95049c77f85826{}'.format(vtype, "popular", "&page={}".format(index))
    r = requests.get(url)
    # scraper.log(str(r.status_code) + " " + url)  # TEST
    import sys; sys.stderr.write(str(r.status_code) + " " + url + "\n")  # TEST
    return r.text


def movie_crawler(scraper, index):
    return video_crawler(scraper, index, vtype='movie')


def tv_crawler(scraper, index):
    return video_crawler(scraper, index, vtype='tv')


if __name__ == '__main__':
    scrap = scraper(tv_crawler)
    scrap.set_indexes(range(1,50))
    # scrap.set_indexes(range(1,2))
    l1 = scrap.run()
    l2 = [tv_ for d in l1 for tv_ in d['results']]
    tv_keys = [k.encode('utf-8') for k in l2[0].keys()]
    l3 = [[tv_[k] for k in tv_keys] for tv_ in l2]
    # l3 = ['"' + '", "'.join([unicode(tv_[k]) for k in tv_keys]) + '"' for tv_ in l2]
    # keys_s = '"' + '", "'.join([unicode(k) for k in tv_keys]) + '"'
    # l4 = [keys_s] + l3
    with open("tv.csv", "w") as f:
        csv_w = csv.writer(f)
        csv_w.writerow(tv_keys)
        for x in l3:
            w = []
            for xx in x:
                if isinstance(xx, unicode):
                    w.append(xx.encode('utf-8'))
                else:
                    w.append(str(xx))
            csv_w.writerow(w)
