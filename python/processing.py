import json


def save_json(filename, data):
    with open("{0}.json".format(filename),
      "w", encoding="utf-8") as f:
      f.write(str(json.dumps(data, ensure_ascii=False)))

def load_json(filename):
    with open("{0}.json".format(filename)) as f:
        return json.load(f)


filename = "data/episodes"
episodes = load_json(filename)
episode_ids = [ ep["identifier"] for ep in episodes ] 

print("======================================")
print("Getting tracks...")
print("======================================")

tracks = []
for ep_id in episode_ids:
    filename = "data/episodes/{}".format(ep_id)
    episode = load_json(filename)
    print("\n======================================")
    print("Loading data from {0}.json...".format(filename))
    
    date = episode["date"]
    show = episode["title"].replace(" with Above & Beyond and", " with")

    print("{} ({})".format(show, date))
    print("======================================")

    sets = episode["sets"]
    for s in sets:
        tracklist = s["tracklist"]
        for (index, track) in enumerate(tracklist):
            label = track["label"]
            track_type = track["type"]
            artist = track["artist"]
            name = track["trackname"]
            print("{}: {} - {}".format(index, name, artist))

            track_dict = {
                "date": date,
                "show": show,
                "label": label,
                "type": track_type,
                "artist": artist,
                "name": name
            }
            tracks.append(track_dict)

print("======================================")
print("Got {} tracks.".format(len(tracks)))
print("======================================")

filename = "data/tracks"
save_json(filename, tracks)
