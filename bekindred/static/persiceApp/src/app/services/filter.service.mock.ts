import {FilterModel, InterfaceFilter} from '../models/filter.model';

export const filters: Object = {
  "meta": {
    "limit": 20,
    "next": null,
    "offset": 0,
    "previous": null,
    "total_count": 1
  },
  "objects": [
    {
      "cumulative_match_score": 0,
      "distance": 2353,
      "distance_unit": "miles",
      "gender": "f",
      "id": 2,
      "keyword": "",
      "max_age": "95",
      "min_age": "47",
      "order_criteria": "match_score",
      "resource_uri": "/api/v1/filter/state2/2/",
      "user": "/api/v1/auth/user/2/"
    }
  ]
};

export const filter: InterfaceFilter = {
  "cumulative_match_score": 0,
  "distance": 2353,
  "distance_unit": "miles",
  "gender": "f",
  "id": 2,
  "keyword": "",
  "max_age": "95",
  "min_age": "47",
  "order_criteria": "match_score",
  "resource_uri": "/api/v1/filter/state2/2/"
};


export const defaultFilters: InterfaceFilter = {
  cumulative_match_score: 0,
  distance: 10000,
  distance_unit: 'miles',
  keyword: '',
  gender: 'm,f',
  min_age: '25',
  max_age: '60',
  order_criteria: 'match_score'
};



