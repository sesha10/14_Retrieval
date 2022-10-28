from pickle import TRUE
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from settings import *
from search import *
import time

with open("blacklist.txt") as f:
    bad_domains_list = set(f.read().split("\n"))

#Strips HTML of page and returns the content/text
def get_page_content(row):
    soup = BeautifulSoup(row["html"], features="lxml")
    text = soup.get_text()
    return text

def tracker_urls(row):
    soup = BeautifulSoup(row["html"], features="lxml")
    scripts = soup.find_all("scripts", {"src":True})
    srcs = [s.get("src") for s in scripts]
    links = soup.find_all("a", {"href":True})
    href = [l.get("href") for l in links]
    all_domains = [urlparse(s).hostname for s in srcs + href]
    bad_domains = [a for a in all_domains if a in bad_domains_list]
    return len(bad_domains)


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

    def filter(self):
        self.content_filter()
        self.tracker_filter()
        self.filtered = self.filtered.sort_values("rank", ascending=True)
        self.filtered["rank"] = self.filtered["rank"].round()
        # print("-----START-----")
        # print(self.filtered["link"])
        # print("-----END-----")
        return self.filtered

begin = time.time()
results = search('machine')
end = time.time()

print("-----START-----")
print(results["link"])
print("-----END-----")
fi = Filter(results)
results = fi.filter()
print(f"Total runtime of the program is {end - begin}")
# print(results)
