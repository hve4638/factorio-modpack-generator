import requests
import sys
from bs4 import BeautifulSoup
from typing import Final
from .exceptions import ResponseFail

URL:Final = 'https://mods.factorio.com/mod/'
SELECTOR_TITLE:Final = 'body > div.container > div > div.panel.pt0.pb0.mb32 > div.panel-inset-lighter.flex-column.p0 > div.flex.z1 > div.panel-inset-lighter.m0.w100p.mr2 > div > div.w100p > h2 > a'
SELECTOR_AUTHOR:Final = 'body > div.container > div > div.panel.pt0.pb0.mb32 > div.panel-inset-lighter.flex-column.p0 > div.flex.z1 > div.panel-inset-lighter.m0.w100p.mr2 > div > div.w100p > div > a'
SELECTOR_DESC:Final = 'body > div.container > div > div.panel.pt0.pb0.mb32 > div.panel-inset-lighter.flex-column.p0 > div.flex.z1 > div.panel-inset-lighter.m0.w100p.mr2 > div > div.w100p > p'
SELECTOR_THUMBNAIL:Final = 'body > div.container > div > div.panel.pt0.pb0.mb32 > div.panel-inset-lighter.flex-column.p0 > div.flex.z1 > div.panel-inset-lighter.m0.w100p.mr2 > div > div.mt0.mb0.mr12.fs0 > a > div > img'

htmlcache = {}

def flush():
    htmlcache.clear()

def download_thumnail(filename:str, mod:str)->bool:
    siteurl = URL + mod
    html = __requesturl(url=siteurl)
    soup = BeautifulSoup(html, 'html.parser')
    img = soup.select_one(SELECTOR_THUMBNAIL)
    if img:
        res = requests.get(img['src'])
        with open(filename, 'wb') as f:
            f.write(res.content)
        return True
    else:
        return False

def get_modinfo(mod:str, *, verbose:bool = False):
    siteurl = URL + mod
    html = __requesturl(url=siteurl)

    try:
        return __parse_modsite(html, mod=mod, siteurl=siteurl)
    except Exception as e:
        raise e

def __requesturl(url, *, ignore_cache:bool=False):
    if not ignore_cache and url in htmlcache:
        return htmlcache[url]
    else:
        response = requests.get(url)
        if response.status_code != 200:
            raise ResponseFail((url, response.status_code))
        else:
            return response.text

def __parse_modsite(html:str, *, mod:str, siteurl:str):
    soup = BeautifulSoup(html, 'html.parser')
    name = soup.select_one(SELECTOR_TITLE).get_text()
    author = soup.select_one(SELECTOR_AUTHOR).get_text()
    description = soup.select_one(SELECTOR_DESC).get_text()
    img = soup.select_one(SELECTOR_THUMBNAIL)
    if img:
        thumbnail = f'{mod}.png'
    else:
        thumbnail = ''
    
    return {
        'name' : name,
        'mod' : mod,
        'site' : siteurl,
        'author' : author,
        'descriptions' : [ description ],
        'version' : '',
        'thumbnail' : thumbnail,
        'tags' : [],
        'short_description' : ''
    }