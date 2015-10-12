# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'ElasticSearchMatchEngine'
        db.create_table(u'match_engine_elasticsearchmatchengine', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
        ))
        db.send_create_signal(u'match_engine', ['ElasticSearchMatchEngine'])

        # Adding model 'StopWords'
        db.create_table(u'match_engine_stopwords', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('word', self.gf('django.db.models.fields.CharField')(unique=True, max_length=100)),
        ))
        db.send_create_signal(u'match_engine', ['StopWords'])


    def backwards(self, orm):
        # Deleting model 'ElasticSearchMatchEngine'
        db.delete_table(u'match_engine_elasticsearchmatchengine')

        # Deleting model 'StopWords'
        db.delete_table(u'match_engine_stopwords')


    models = {
        u'match_engine.elasticsearchmatchengine': {
            'Meta': {'object_name': 'ElasticSearchMatchEngine'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'match_engine.matchengine': {
            'Meta': {'object_name': 'MatchEngine'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'match_engine.stopwords': {
            'Meta': {'object_name': 'StopWords'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'word': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'})
        }
    }

    complete_apps = ['match_engine']