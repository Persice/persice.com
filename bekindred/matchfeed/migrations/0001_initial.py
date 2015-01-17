# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'MatchFeed'
        db.create_table(u'matchfeed_matchfeed', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
        ))
        db.send_create_signal(u'matchfeed', ['MatchFeed'])


    def backwards(self, orm):
        # Deleting model 'MatchFeed'
        db.delete_table(u'matchfeed_matchfeed')


    models = {
        u'matchfeed.matchfeed': {
            'Meta': {'object_name': 'MatchFeed'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        }
    }

    complete_apps = ['matchfeed']