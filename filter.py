import re
import sys
import math
import time
from search import *
from settings import *
from pickle import TRUE
from datetime import datetime
from collections import Counter
from urllib.parse import urlparse
from requests_html import HTMLSession
from bs4 import BeautifulSoup, SoupStrainer

with open("/home/siddhant/Documents/Acads/SSD/SearchEngine/blacklist.txt") as f:
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

    # print(tago["content"][:10] if tago else "Now")
    return tago["content"][:10] if tago else datetime.today().strftime('%Y-%m-%d')

def get_mod_time_content(row):
    soup = BeautifulSoup(row["html"], 'html.parser')
    mtago = soup.find("meta", property="article:modified_time")

    # print(tago["content"] if tago else "NO content")
    return mtago["content"][:10] if mtago else datetime.today().strftime('%Y-%m-%d')

def get_link_num(weblk):
    # print(weblk)
    # print("")
    session = HTMLSession()
    r = session.get(weblk)
    unique_netlocs = len(Counter(urlparse(link).netloc for link in r.html.absolute_links))
    # for link in unique_netlocs:
    #     print(link, unique_netlocs[link])
    return unique_netlocs



WORD = re.compile(r'\w+')

def get_cosine(vec1, vec2):
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[x] * vec2[x] for x in intersection])

    sum1 = sum([vec1[x]**2 for x in vec1.keys()])
    sum2 = sum([vec2[x]**2 for x in vec2.keys()])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)

    if not denominator:
        return 0.0
    else:
        return float(numerator) / denominator

def text_to_vector(text):
    words = WORD.findall(text)
    return Counter(words)

def get_sim(row, seo):
    vector1 = text_to_vector(row.casefold())
    vector2 = text_to_vector(seo)

    cosine11 = get_cosine(vector1, vector2)
    return cosine11


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
        mod_time_cnt = self.filtered.apply(get_mod_time_content, axis=1)
        self.filtered["time"] = time_cnt
        self.filtered["lattime"] = mod_time_cnt

    def link_filter(self):
        link_cnt = self.filtered["link"].apply(get_link_num)
        print(link_cnt)
        # print("")
        self.filtered["linkcnt"] = link_cnt

    def cos_filter(self, seo):
        siml = self.filtered["title"].apply(get_sim, args=(seo,))
        # print(siml)
        # print("")
        siml /= siml.max()
        self.filtered["similar"] = siml
        siml[siml <= 0.4] = RESULT_COUNT
        siml[siml != RESULT_COUNT] = 0
        self.filtered["rank"] += siml

    def filter(self, seo):
        self.content_filter()
        self.tracker_filter()
        self.time_filter()
        self.link_filter()
        self.cos_filter(seo)
        # self.time_filter()
        self.filtered = self.filtered.sort_values("rank", ascending=True)
        self.filtered["rank"] = self.filtered["rank"].round()
        # print("-----START-----")
        # print(self.filtered["link"])
        # print("-----END-----")
        return self.filtered

begin = time.time()
seo = str(sys.argv[1])
results = search(seo)
#----
# results = search("krishna")
#----
fi = Filter(results)
results = fi.filter(seo)
# print(results)
end = time.time()
# print(f"Total runtime of the API fetch is {end - begin}")
# print("Json format is:")
results.drop(['html'], axis=1, inplace=True)
print(results.to_json(orient='records'))
# print(f"Total runtime of the API fetch is {end - begin}")