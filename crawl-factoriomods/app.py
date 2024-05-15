#!/usr/bin/env python3
import argparse
import os, sys
import json
from typing import Final
import requests
from bs4 import BeautifulSoup
from queue import PriorityQueue
import tools

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

parser = argparse.ArgumentParser()
parser.add_argument('modlist', help='')
parser.add_argument('dest', help='Result')
parser.add_argument('-s', '--sort', action='store_true', help='Sorts DEST in the order of the MODLIST. Elements not in MODLIST will remain in place')
parser.add_argument('--thumnail', default='./thumbnails', help='directory path to download thumnails')
parser.add_argument('--update-format', action='store_true')
parser.add_argument('--verbose', action='store_true')

# https://gall.dcinside.com/mgallery/board/view/?id=factorio&no=57941

if __name__ == "__main__":
    args = parser.parse_args()
    
    data = []
    existed = set()
    try:
        with open(args.dest, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data:
                existed.add(item['mod'])
    except FileNotFoundError:
        pass
    
    mods = []
    try:
        with open(args.modlist, 'r', encoding='utf-8') as f:
            mods = [mod.strip() for mod in f.readlines()]
    except FileNotFoundError:
        sys.stderr.write(f"[ERROR] could not open modlist {args.modlist}\n")
        sys.stderr.write(f"exit\n")
        exit(1)

    if args.sort:
        data = tools.sort.sort_by_list(data, mods)

    added = []
    failed = []
    skipped = []
    for mod in mods:
        if mod == '':
            continue
        elif mod in existed:
            skipped.append(mod)
            continue
        
        try:
            modinfo = tools.crawling.get_modinfo(mod)
            added.append(modinfo)

            thumbnail = modinfo['thumbnail']
            if thumbnail:
                if not tools.crawling.download_thumnail(f'./thumbnails/{thumbnail}', mod=mod):
                    sys.stderr.write(f'[WARNING] {mod} : couldn\'t download thumbnail\n')
            else:
                sys.stderr.write(f'[INFO] {mod} : no thumnail\n')
        except tools.exceptions.ResponseFail as e:
            sys.stderr.write(f"[ERROR] '{mod}' response failed\n")
            failed.append(mod)
        except Exception as e:
            sys.stderr.write(f'[ERROR] {mod} : unhandle exception occured\n')
            sys.stderr.write(f'- {type(e)} : {e}')
            failed.append(mod)
    
    data.extend(added)
    output = json.dumps(data, indent=4)
    with open(args.dest, 'w', encoding='utf-8', ensure_ascii=False) as f:
        f.write(output)
    
    count_added = len(added)
    count_failed = len(failed)
    count_skipped = len(skipped)
    sys.stdout.write(f'Add: {count_added}\n')
    sys.stdout.write(f'Fail: {count_failed}\n')
    sys.stdout.write(f'Skip: {count_skipped}\n')