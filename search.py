import imp
from unittest import result
from urllib import response
from settings import *
import requests
from requests.exceptions import RequestException
import pandas as pd
from urllib.parse import quote_plus
from datetime import datetime
import time

def search_api(query, pages=int(RESULT_COUNT/10)):
    results = []
    imglinks = []
    finalres = []
    for i in range(0, pages):
        start = i*10 + i #defines rank of first record on a page
        url = SEARCH_URL.format(
            key=SEARCH_KEY,
            cx=SEARCH_ID,
            query=quote_plus(query),
            start=start
        )
        #print("Here:")
        # begin = time.time()
        response = requests.get(url) #gives the result of our search query in json format
        # end = time.time()
        # print(f"Total runtime of the API fetch is {end - begin}")
        data = response.json()
        results += data["items"]
        for j in range(0, len(results)):
            if 'pagemap' in results[j]:
                if 'cse_thumbnail' in results[j]['pagemap']:
                    imglinks.append(results[j]['pagemap']['cse_thumbnail'][0]['src'])
                else:
                    imglinks.append('')
            else:
                imglinks.append('')
        finalres += results
        results = []
    # print(imglinks)
    res_df = pd.DataFrame.from_dict(finalres)
    res_df["rank"] = list(range(1, res_df.shape[0]+1))
    res_df["imglinks"] = imglinks
    res_df = res_df[["link", "rank", "snippet", "title", "imglinks"]]
    return res_df


def scrape_page(links):
    html = []
    for link in links:
        try:
            data = requests.get(link, timeout=5)
            html.append(data.text)
        except:
            html.append("")
    return html


def search(query):
    columns = ["query", "rank", "link", "title", "snippet", "html", "created", "imglinks"]
    results = search_api(query)
    results["html"] = scrape_page(results["link"])
    results = results[results["html"].str.len() > 0].copy()
    results["query"] = query
    results["created"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    results = results[columns]
    return results



# print(search_api("danish"))

# print(damerauLevenshtein('Henry C. Harper v. The Law Offices of Huey & Luey, LLP', 'Harper v. The Law Offices of Huey & Luey, LLP', similarity=True))