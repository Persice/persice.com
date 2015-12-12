from collections import Counter

from nltk.stem.porter import PorterStemmer

from match_engine.models import CollocationDict


def find_collocations(keywords):
    collocations = CollocationDict.objects.all(). \
        values_list('phrase', flat=True)
    s = PorterStemmer()
    phrases = Counter()

    new_keywords = []
    for collocation in collocations:
        collocation_ = collocation.split()
        if len(collocation_) < 2:
            continue
        for keyword in keywords:
            if s.stem(keyword) == s.stem(collocation_[0]) or \
                            s.stem(keyword) == s.stem(collocation_[1]):
                phrases[collocation] += 1

    d = dict(phrases)
    match_phrases = dict((key, value) for key, value in d.iteritems()
                         if value == 2)

    for phrase in match_phrases.iterkeys():
        splitted = phrase.split()
        for keyword in keywords:
            if not (s.stem(keyword) == s.stem(splitted[0]) or
                    s.stem(keyword) == s.stem(splitted[1])):
                new_keywords.append(keyword)
    new_keywords.extend(phrases.keys())
    return new_keywords
