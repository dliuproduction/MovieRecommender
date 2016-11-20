# TODO import flask
import json


with open("imdb_recommendations.json", "rt") as f:
    d = json.load(f)
l = d.keys()


def get_stuff(id_, weight, ret):
    for x in d[id_]:
        if x not in ret and x in l:
            ret[x] = weight
            get_stuff(x, weight / 2, ret)


if __name__ == '__main__':
    ret = {}
    get_stuff('tt0944947', 5.0, ret)
    print ret
