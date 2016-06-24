import logging
from collections import Counter

import time
from nltk.stem.porter import PorterStemmer

from match_engine.models import CollocationDict, StopWords


logger = logging.getLogger(__name__)


def find_collocations(keywords):
    now = time.time()
    collocations = CollocationDict.objects. \
        all().values_list('phrase', flat=True)
    stop_words = StopWords.objects.all().values_list('word', flat=True)
    s = PorterStemmer()
    st_stop_words = [s.stem(w) for w in stop_words]
    keywords_ = keywords
    c = Counter()
    for phrase in collocations:
        single_phrase = phrase.split()
        for keyword in keywords_:
            if s.stem(single_phrase[0]) == s.stem(keyword) or \
               s.stem(single_phrase[1]) == s.stem(keyword):
                    c[phrase] += 1
    new_d = dict(c)
    d = dict()
    for key, value in new_d.iteritems():
        if value == 2:
            d[key] = value
        elif value == 1:
            ph = key.split()
            if s.stem(ph[0]) in st_stop_words or \
               s.stem(ph[1]) in st_stop_words:
                d[key] = value

    result = []

    temp = []
    for k in d.keys():
        for i in k.split():
            temp.append(s.stem(i))

    for keyword in keywords:
        if s.stem(keyword) not in temp:
            result.append(keyword)

    result.extend(d.keys())
    logger.debug("Time find_collocations: {} {}".format(now - time.time(),
                                                   keywords))
    return result
