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
from fastDamerauLevenshtein import damerauLevenshtein



def search_api_image(query, pages=int(RESULT_COUNT/10)):
    results = []
    for i in range(0, pages):
        start = i*10 + i #defines rank of first record on a page
        url = SEARCH_URL_IMAGE.format(
            key=SEARCH_KEY,
            cx=SEARCH_ID,
            query=quote_plus(query),
            searchType='image',
            imgType='photo',
            imgSize='xxlarge',
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
    res_df = res_df[["link", "rank", "snippet", "title", "displayLink"]]
    return res_df


def search(query):
    columns = ["query", "rank", "link", "title", "displayLink", "snippet", "distance", "created"]
    results = search_api_image(query)
    # results["html"] = scrape_page(results["link"])
    # results = results[results["html"].str.len() > 0].copy()
    results["query"] = query
    results["created"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    results["distance"] = 0
    results = results[columns]
    return results


# print(search("baby strollers"))

# print(damerauLevenshtein('India turns 75: Fast facts about the unusual constitution guiding ...', 'India', similarity=True))