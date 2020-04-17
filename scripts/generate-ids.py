import json
import os

def walk(path):
    ids = set()
    for filename in os.listdir(path):
        fullpath = os.path.join(path, filename)
        if os.path.isfile(fullpath) and fullpath.endswith('.json'):
            geodata = json.load(open(fullpath))
            if geodata['type'] == 'Topology':
                for feature in geodata['objects']['countries']['geometries']:
                    ids.add(feature['properties']['_id'])
            else:
                for feature in geodata['features']:
                    ids.add(feature['properties']['_id'])
        else:
            ids.update(walk(fullpath))
    return ids


if __name__ == '__main__':
    json.dump(list(sorted(walk('public/data/map'))), open('public/data/aux/ids.json', 'w'), ensure_ascii=False)
