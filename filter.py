from pickle import TRUE
from bs4 import BeautifulSoup, SoupStrainer
from urllib.parse import urlparse
from settings import *
from search import *
import time
import sys
import dateparser
import datetime

with open("/home/sesh/Desktop/SSD_Proj/Web-Info-Retrieval/blacklist.txt") as f:
    bad_domains_list = set(f.read().split("\n"))

#Strips HTML of page and returns the content/text
def get_page_content(row):
    soup = BeautifulSoup(row["html"], features="lxml")
    text = soup.get_text()
    return text

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

def get_time_content(row):
    soup = BeautifulSoup(row["html"], 'html.parser')
    tago = soup.find("meta", property="article:published_time")

    # print(tago["content"] if tago else "NO content")
    return tago["content"][:10] if tago else "Now"


class Filter():
    def __init__(self, results):
        self.filtered = results.copy()
    
    def content_filter(self):
        page_content = self.filtered.apply(get_page_content, axis=1)
        word_count = page_content.apply(lambda x: len(x.split()))
        word_count /= word_count.median()

        word_count[word_count <= .5] = RESULT_COUNT
        word_count[word_count != RESULT_COUNT] = 0
        self.filtered["rank"] += word_count

    def tracker_filter(self):
        tracker_count = self.filtered.apply(tracker_urls, axis = 1)
        tracker_count[tracker_count > tracker_count.median()] = RESULT_COUNT * 2
        self.filtered["rank"] += tracker_count

    def time_filter(self):
        time_cnt = self.filtered.apply(get_time_content, axis=1)
        self.filtered["time"] = time_cnt


    def filter(self):
        self.content_filter()
        self.tracker_filter()
        self.time_filter()
        # self.time_filter()
        self.filtered = self.filtered.sort_values("rank", ascending=True)
        self.filtered["rank"] = self.filtered["rank"].round()
        # print("-----START-----")
        # print(self.filtered["time"])
        # print("-----END-----")
        return self.filtered

begin = time.time()
results = search(str(sys.argv[1]))
fi = Filter(results)
results = fi.filter()
# print(results)
end = time.time()
# print(f"Total runtime of the API fetch is {end - begin}")
# print("Json format is:")
results.drop(['html'], axis=1, inplace=True)
print(results.to_json(orient='records'))
# print(f"Total runtime of the API fetch is {end - begin}")