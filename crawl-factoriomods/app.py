#!/usr/bin/env python3
import os, sys
import json
from typing import Final
import requests
from bs4 import BeautifulSoup

URL:Final = 'https://mods.factorio.com/mod/'
SELECTOR_TITLE:Final = 'body > div.container > div > div.panel.pt0.pb0.mb32 > div.panel-inset-lighter.flex-column.p0 > div.flex.z1 > div.panel-inset-lighter.m0.w100p.mr2 > div > div.w100p > h2 > a'
SELECTOR_AUTHOR:Final = 'body > div.container > div > div.panel.pt0.pb0.mb32 > div.panel-inset-lighter.flex-column.p0 > div.flex.z1 > div.panel-inset-lighter.m0.w100p.mr2 > div > div.w100p > div > a'
SELECTOR_DESC:Final = 'body > div.container > div > div.panel.pt0.pb0.mb32 > div.panel-inset-lighter.flex-column.p0 > div.flex.z1 > div.panel-inset-lighter.m0.w100p.mr2 > div > div.w100p > p'
SELECTOR_THUMBNAIL:Final = 'body > div.container > div > div.panel.pt0.pb0.mb32 > div.panel-inset-lighter.flex-column.p0 > div.flex.z1 > div.panel-inset-lighter.m0.w100p.mr2 > div > div.mt0.mb0.mr12.fs0 > a > div > img'

def download_image(filename:str, url:str):
    res = requests.get(url)
    with open(filename, 'wb') as f:
        f.write(res.content)

os.makedirs('thumbnails', exist_ok=True)

if __name__ == "__main__":
    existed = set()
    result = []
    failed = []
    if len(sys.argv) <= 2:
        sys.stderr.write(f'Using: {sys.argv[0]} <modlist> <result>\n')
        exit(1)
    
    try:
        with open(sys.argv[2], 'r', encoding='utf-8') as f:
            result = json.load(f)
            for item in result:
                existed.add(item['mod'])
    except FileNotFoundError:
        pass
    
    with open(sys.argv[1], 'r', encoding='utf-8') as f:
        lines = f.readlines()

    for line in lines:
        mod = line.strip()
        if mod == '':
            continue
        elif mod in existed:
            print(f'skip: {mod} (exists)')
            continue

        siteurl = URL + mod
        response = requests.get(siteurl)

        if response.status_code != 200:
            sys.stderr.write(f"Parse Failed: '{mod}' ({response.status_code})\n")
            failed.append(mod)
        else :
            html = response.text
            soup = BeautifulSoup(html, 'html.parser')
            name = soup.select_one(SELECTOR_TITLE).get_text()
            author = soup.select_one(SELECTOR_AUTHOR).get_text()
            description = soup.select_one(SELECTOR_DESC).get_text()
            img = soup.select_one(SELECTOR_THUMBNAIL)
            
            thumbnail = f'{mod}.png'
            download_image(f'./thumbnails/{thumbnail}', img['src'])
            
            result.append({
                'name' : name,
                'mod' : mod,
                'site' : siteurl,
                'author' : author,
                'descriptions' : [description],
                'version' : '',
                'thumbnail' : thumbnail,
            })

    output = json.dumps(result, indent=4)
    with open('data.json', 'w', encoding='utf-8') as f:
        f.write(output)
    with open('failed.txt', 'w', encoding='utf-8') as f:
        f.writelines(failed)