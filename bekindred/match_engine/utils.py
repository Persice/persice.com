from collections import Counter

from nltk.stem.porter import PorterStemmer

from match_engine.models import CollocationDict, StopWords


def find_collocations(keywords):
    collocations = CollocationDict.objects. \
        all().values_list('phrase', flat=True)
    s = PorterStemmer()
    keywords_ = keywords
    c = Counter()
    for phrase in collocations:
        single_phrase = phrase.split()
        for keyword in keywords_:
            if s.stem(single_phrase[0]) == s.stem(keyword) or \
               s.stem(single_phrase[1]) == s.stem(keyword):
                    c[phrase] += 1
    d = dict(c)
    result = []

    temp = []
    for k in d.keys():
        for i in k.split():
            temp.append(s.stem(i))

    for keyword in keywords:
        if s.stem(keyword) not in temp:
            result.append(keyword)

    result.extend(d.keys())
    return result

