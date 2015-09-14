cp stopwords


curl -X POST 'http://localhost:9200/haystack/_close?pretty'


curl -XPUT 'localhost:9200/haystack/_settings' -d '
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_english": {
          "type": "english",
          "stopwords_path": "stopwords/stop.words"
        }
      }
    }
  }
}'

curl -X POST 'http://localhost:9200/haystack/_open?'


curl 'localhost:9200/haystack/_settings?pretty'


curl -XPUT 'localhost:9200/haystack/_mapping/modelresult' -d '
{
    "properties": {
       "first_name": {
          "type": "string",
          "analyzer": "my_english"
       },
       "goals": {
          "type": "string",
          "analyzer": "my_english"
       },
       "interests": {
          "type": "string",
          "analyzer": "my_english"
       },
       "last_name": {
          "type": "string",
          "analyzer": "my_english"
       },
       "name": {
          "type": "string",
          "analyzer": "my_english"
       },
       "offers": {
          "type": "string",
          "analyzer": "my_english"
       }
    }
}'


{
  "haystack" : {
    "mappings" : {
      "modelresult" : {
        "_boost" : {
          "name" : "boost",
          "null_value" : 1.0
        },
        "properties" : {
          "description" : {
            "type" : "string",
            "analyzer" : "snowball"
          },
          "django_ct" : {
            "type" : "string",
            "index" : "not_analyzed",
            "include_in_all" : false
          },
          "django_id" : {
            "type" : "string",
            "index" : "not_analyzed",
            "include_in_all" : false
          },
          "first_name" : {
            "type" : "string",
            "analyzer" : "snowball"
          },
          "goals" : {
            "type" : "string",
            "analyzer" : "snowball"
          },
          "id" : {
            "type" : "string"
          },
          "interests" : {
            "type" : "string",
            "analyzer" : "snowball"
          },
          "last_name" : {
            "type" : "string",
            "analyzer" : "snowball"
          },
          "name" : {
            "type" : "string",
            "analyzer" : "snowball"
          },
          "offers" : {
            "type" : "string",
            "analyzer" : "snowball"
          },
          "text" : {
            "type" : "string",
            "analyzer" : "snowball"
          }
        }
      }
    }
  }
}


# Testting
# Test out the new analyzer
GET /haystack/_analyze?analyzer=my_english&text=The quick %26 brown fox girl the reason

