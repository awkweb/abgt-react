import csv
from enum import Enum
import io
import json
import re
from requests.packages.urllib3.util import Retry
from requests.adapters import HTTPAdapter
from requests import Session, exceptions


class ABGTApi(object):
  url = "http://www.aboveandbeyond.nu/api/abgt/"

  def __init__(self):
    super(ABGTApi, self).__init__()

  class Endpoint(Enum):
    episodes = "episodes/"
    episode = "{}/"

  def getRequest(self, endpoint):
    s = Session()
    s.mount(self.url, HTTPAdapter(
        max_retries=Retry(total=5, status_forcelist=[429], backoff_factor=45)
        )
    )
    r = s.get(url=self.url + endpoint)
    print("GET {}".format(self.url + endpoint))
    json = r.json()
    return json

  def get_episodes(self):
    """
    Get all ABGT episodes
    """
    episodes = self.getRequest(self.Endpoint.episodes.value)
    return episodes

  def get_episode_with_id(self, episode_id):
    """
    Get a single ABGT episode with its unique id
    """
    episode = self.getRequest(self.Endpoint.episode.value.format(episode_id))
    return episode

  def save_json(self, filename, data):
    """
    Save json data to a filename
    """
    with open("{0}.json".format(filename),
      "w", encoding="utf-8") as f:
      f.write(str(json.dumps(data, ensure_ascii=False)))


api = ABGTApi()


print("======================================")
print("Getting episodes...")
print("======================================")

episodes = api.get_episodes()
episode_ids = [] 
for ep in episodes:
  identifier = ep["identifier"]
  title = ep["title"]
  date = ep["date"]
  episode_ids.append(identifier)
  print("{}: {} ({})".format(identifier, title, date))

  episode = api.get_episode_with_id(identifier)
  filename = "data/episodes/{}".format(identifier)
  api.save_json(filename, episode)


print("======================================")
print("Got {} episodes.".format(len(episode_ids)))
print("======================================")


filename = "data/episodes"
api.save_json(filename, episodes)
