# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'MatchEngine'
        db.create_table(u'match_engine_matchengine', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
        ))
        db.send_create_signal(u'match_engine', ['MatchEngine'])


    def backwards(self, orm):
        # Deleting model 'MatchEngine'
        db.delete_table(u'match_engine_matchengine')


    models = {
        u'match_engine.matchengine': {
            'Meta': {'object_name': 'MatchEngine'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        }
    }

    complete_apps = ['match_engine']