import json
from time import sleep


class scraper(object):
    def __init__(self, crawler):
        self.indexes = []
        self.crawler = crawler
        self.collector = []


    def set_indexes(self, indexes):
        self.indexes = indexes


    def run(self):
        for i in self.indexes:
            data = self.crawler(self, i)
            if not data:
                self.log("no data")
                continue
            self.collector.append(json.loads(data))
            sleep(0.25)  # this is the rule for the website
        return self.collector


    def log(self, m):
        print(m)


    def to_file(self, fd):
        json.dump(self.collector, fd)
