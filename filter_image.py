from pickle import TRUE
from bs4 import BeautifulSoup, SoupStrainer
from urllib.parse import urlparse
from settings import *
from search_image import *
import time
import sys

imgquery = str(sys.argv[1])
# imgquery = str("India")

with open("/home/siddhant/Documents/Acads/SSD/SearchEngine/blacklist.txt") as f:
    bad_domains_list = set(f.read().split("\n"))

#Strips HTML of page and returns the content/text
def get_image_distance(row):
    return damerauLevenshtein(imgquery, row["title"], similarity=True)

def tracker_urls(row):
    # soup = BeautifulSoup(row["html"], features="lxml")
    # scripts = soup.find_all("scripts", {"src":True})
    only_scripts = SoupStrainer(["scripts","a"])
    soup = BeautifulSoup(row["html"], 'html.parser', parse_only=only_scripts)
    scripts = list(soup)
    srcs = [s.get("src") for s in scripts]
    
    # only_links = SoupStrainer("a", {"href":True})
    # soup = BeautifulSoup(row["html"], 'html.parser', parse_only=only_links)
    # links = list(soup)
    href = [l.get("href") for l in scripts]
    all_domains = [urlparse(s).hostname for s in srcs + href]
    bad_domains = [a for a in all_domains if a in bad_domains_list]
    return len(bad_domains)


class Filter():
    def __init__(self, results):
        self.filtered = results.copy()
    
    def distance_filter(self):
        img_distance = self.filtered.apply(get_image_distance, axis=1)
        self.filtered["distance"] = img_distance

    def tracker_filter(self):
        tracker_count = self.filtered.apply(tracker_urls, axis = 1)
        tracker_count[tracker_count > tracker_count.median()] = RESULT_COUNT * 2
        self.filtered["rank"] += tracker_count

    def filter(self):
        self.distance_filter()
        # self.tracker_filter()
        self.filtered = self.filtered.sort_values("distance", ascending=False)
        # self.filtered["rank"] = self.filtered["rank"].round()
        # print("-----START-----")
        # print(self.filtered["link"])
        # print("-----END-----")
        return self.filtered


begin = time.time()
results = search(str(sys.argv[1]))
# results = search("Manchester United")
# print("Returned")
fi = Filter(results)
results = fi.filter()
# print(results)
end = time.time()
# print(f"Total runtime of the API fetch is {end - begin}")
# print("Json format is:")
# results.drop(['html'], axis=1, inplace=True)
print(results.to_json(orient='records'))
# print(f"Total runtime of the API fetch is {end - begin}")