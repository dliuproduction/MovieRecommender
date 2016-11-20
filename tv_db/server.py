import json
from flask import Flask, request, jsonify

from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper


def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Credentials'] = 'true'
            h['Access-Control-Allow-Headers'] = \
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

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


def do_this(ids, weight, cache={}):
    if ids[0] in cache:
        return cache[ids[0]]
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
    cache[ids[0]] = ret
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


@app.route('/', methods=['POST', 'OPTIONS'])
@crossdomain(origin='*')
def jam():
    if request.method == 'POST':
        form = request.form
        l = []
        for (id_, stars) in form.items():
            l.append(do_this([id_], float(stars)))
        ret = combine_scores(l)
        rett = sort_stuff(ret)
        rettt = get_top_10(rett, [id_ for (id_, stars) in form.items()])
        retttt = jsonify({'data': rettt})
        print retttt
        return retttt


@app.route('/name', methods=['POST', 'OPTIONS'])
@crossdomain(origin='*')
def translate_name_to_id():
    if request.method == 'POST':
        form = request.form
        print form
        name = form.items()[0][0]
        name = name.lower().strip()
        ret = tv2id[name]
        ret = jsonify({'id': ret})
        print ret
        return ret


if __name__ == '__main__':
    app.run(debug=False)
    # ret1 = do_this([u'tt0795176'], 5.0)
    # ret2 = do_this([u'tt0903747'], 3.0)
    # ret = combine_scores([ret1, ret2])
    # rett = sort_stuff(ret)
    # print get_top_10(rett, [u'tt0795176', u'tt0903747'])
