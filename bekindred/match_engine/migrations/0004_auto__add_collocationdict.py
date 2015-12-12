# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'CollocationDict'
        db.create_table(u'match_engine_collocationdict', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('phrase', self.gf('django.db.models.fields.CharField')(unique=True, max_length=100, db_index=True)),
        ))
        db.send_create_signal(u'match_engine', ['CollocationDict'])


    def backwards(self, orm):
        # Deleting model 'CollocationDict'
        db.delete_table(u'match_engine_collocationdict')


    models = {
        u'match_engine.collocationdict': {
            'Meta': {'object_name': 'CollocationDict'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'phrase': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100', 'db_index': 'True'})
        },
        u'match_engine.elasticsearchmatchengine': {
            'Meta': {'object_name': 'ElasticSearchMatchEngine'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'match_engine.gerundwords': {
            'Meta': {'object_name': 'GerundWords'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'word': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100', 'db_index': 'True'})
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