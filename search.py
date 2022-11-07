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
        # print(data)
        results += data["items"]
    # print("-----------------Hello---------------------")
    # print(results)
    res_df = pd.DataFrame.from_dict(results)
    res_df["rank"] = list(range(1, res_df.shape[0]+1))
    res_df = res_df[["link", "rank", "snippet", "title"]]
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
    columns = ["query", "rank", "link", "title", "snippet", "html", "created"]
    results = search_api(query)
    results["html"] = scrape_page(results["link"])
    results = results[results["html"].str.len() > 0].copy()
    results["query"] = query
    results["created"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    results = results[columns]
    return results



# print(search_api_image("baby strollers"))

# print(damerauLevenshtein('Henry C. Harper v. The Law Offices of Huey & Luey, LLP', 'Harper v. The Law Offices of Huey & Luey, LLP', similarity=True))