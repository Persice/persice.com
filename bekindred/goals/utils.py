from datetime import date
import oauth2 as oauth
import json
import pprint


def calculate_age(born):
    today = date.today()
    if born is None:
        return 0
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))


def calculate_date_of_birth(age):
    today = date.today()
    return today.replace(year=today.year - age)


def linkedin_connections(uid, oauth_token, oauth_token_secret):
    from bekindred.settings.local import LINKEDIN_CONSUMER_KEY, LINKEDIN_CONSUMER_SECRET
    url = u = "https://api.linkedin.com/v1/people/%s" \
              ":(relation-to-viewer:(related-connections:(id,first-name,last-name,picture-url)))" \
              "?format=json" % uid
    consumer = oauth.Consumer(key=LINKEDIN_CONSUMER_KEY, secret=LINKEDIN_CONSUMER_SECRET)
    token = oauth.Token(key=oauth_token, secret=oauth_token_secret)
    client = oauth.Client(consumer, token)
    resp, content = client.request(url)
    rels = json.loads(content)
    pprint.pprint(rels)
    if rels['relationToViewer']['relatedConnections']['_total'] > 0:
        return rels['relationToViewer']['relatedConnections']['values']
    return {}