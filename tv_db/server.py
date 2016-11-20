import json
from flask import Flask, request, jsonify


app = Flask(__name__)


with open("imdb_recommendations.json", "rt") as f:
    d = json.load(f)
with open("tv2id.json", "rt") as f:
    tv2id = json.load(f)
l = d.keys()


def get_neighbours(ret, id_):
    '''
    return: list
    '''
    return [i for i in d[id_] if i in l and i not in ret]


def get_not_visited_neighbours(ret, ids):
    '''
    return: list
    '''
    neighbours = set()
    for id_ in ids:
        if id_ in ret or id_ not in l:
            continue
        next_neighbours = get_neighbours(ret, id_)
        neighbours.update(next_neighbours)
    neighbours = list(neighbours)
    return neighbours


def assign_weight(id_, weight, ret):
    if id_ not in ret and id_ in l:
        ret[id_] = weight


def do_this(ids, weight):
    weight = float(weight)
    ret = {}
    next_level = ids
    while next_level:
        next_level_ = set()
        for id_ in next_level:
            if not id_ in l:
                continue
            neighbours = get_not_visited_neighbours(ret, next_level)
            next_level_.update(neighbours)
            assign_weight(id_, weight, ret)
        weight = weight / 2
        next_level = list(next_level_)
    return ret


def sort_stuff(d):
    l = sorted(d, key=d.get, reverse=True)
    l = [i for i in l]
    # l = [(i, d[i]) for i in l]
    return l


def combine_scores(ds):
    ret = {}
    for k in l:
        v = sum([d.get(k, 0.0) for d in ds])
        ret[k] = v
    return ret


def get_top_10(l, remove_list):
    ret = []
    for i in l:
        if not i in remove_list:
            ret.append(i)
        if len(ret) == 10:
            break
    return ret


@app.route('/', methods=['POST'])
def jam():
    if request.method == 'POST':
        js = request.json
        # if js:
        #     return get_stuff_list(js)
    return "HELLO WORLD"


@app.route('/name', methods=['POST'])
def translate_name_to_id():
    if request.method == 'POST':
        js = request.json
        form = request.form
        print js, form
        import ipdb; ipdb.set_trace()  # TODO: remove this line
        name = js['name']
        ret = tv2id[name]
        return jsonify(ret)


if __name__ == '__main__':
    app.run(debug=True)
    # ret1 = do_this([u'tt0795176'], 5.0)
    # ret2 = do_this([u'tt0903747'], 3.0)
    # ret = combine_scores([ret1, ret2])
    # rett = sort_stuff(ret)
    # print get_top_10(rett, [u'tt0795176', u'tt0903747'])
