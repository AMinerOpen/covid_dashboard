import json

if __name__ == '__main__':
    locs = set([(item.split('.')[-1], item) for item in json.load(open('ids.json')) if len(item.split('.')[-1]) > 1])
    locs.add(('全球', '全球'))
    news = json.load(open('events.json'))
    for item in news:
        matched = []
        for loc, full in locs:
            pos = str(item['title'] + item['content']).find(loc)
            if pos >= 0:
                matched.append((pos, full))
        item['locs'] = [full for pos, full in sorted(matched, key=lambda x: x[0])]
    json.dump(news, open('events-w-place.json', 'w'), ensure_ascii=False)
    json.dump(news, open('events-w-place.pretty.json', 'w'), ensure_ascii=False, indent=2)
