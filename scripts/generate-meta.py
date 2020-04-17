import json
import os

if __name__ == '__main__':
    metadata = set()
    basedir = 'public/data'
    def walk(_dir, prefix):
        for filename in os.listdir(_dir):
            path = os.path.join(_dir, filename)
            name = prefix+'/'+filename
            if os.path.isfile(path):
                metadata.add(name)
            elif os.path.isdir(path):
                walk(path, name)
    walk(basedir, '/data')
    json.dump(list(sorted(metadata)), open('public/data-meta-list.json', 'w'), ensure_ascii=False)

