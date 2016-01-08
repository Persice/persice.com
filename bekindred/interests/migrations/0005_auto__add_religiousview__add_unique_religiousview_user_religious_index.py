# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'ReligiousView'
        db.create_table(u'interests_religiousview', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['django_facebook.FacebookCustomUser'])),
            ('religious_index', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['interests.ReligiousIndex'])),
        ))
        db.send_create_signal(u'interests', ['ReligiousView'])

        # Adding unique constraint on 'ReligiousView', fields ['user', 'religious_index']
        db.create_unique(u'interests_religiousview', ['user_id', 'religious_index_id'])

        # Adding model 'PoliticalView'
        db.create_table(u'interests_politicalview', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['django_facebook.FacebookCustomUser'], unique=True)),
            ('political_index', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['interests.PoliticalIndex'])),
        ))
        db.send_create_signal(u'interests', ['PoliticalView'])

        # Adding unique constraint on 'PoliticalView', fields ['user', 'political_index']
        db.create_unique(u'interests_politicalview', ['user_id', 'political_index_id'])

        # Adding model 'PoliticalIndex'
        db.create_table(u'interests_politicalindex', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(default='other', max_length=300)),
        ))
        db.send_create_signal(u'interests', ['PoliticalIndex'])

        # Adding model 'ReligiousIndex'
        db.create_table(u'interests_religiousindex', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(default='other', max_length=300)),
        ))
        db.send_create_signal(u'interests', ['ReligiousIndex'])


    def backwards(self, orm):
        # Removing unique constraint on 'PoliticalView', fields ['user', 'political_index']
        db.delete_unique(u'interests_politicalview', ['user_id', 'political_index_id'])

        # Removing unique constraint on 'ReligiousView', fields ['user', 'religious_index']
        db.delete_unique(u'interests_religiousview', ['user_id', 'religious_index_id'])

        # Deleting model 'ReligiousView'
        db.delete_table(u'interests_religiousview')

        # Deleting model 'PoliticalView'
        db.delete_table(u'interests_politicalview')

        # Deleting model 'PoliticalIndex'
        db.delete_table(u'interests_politicalindex')

        # Deleting model 'ReligiousIndex'
        db.delete_table(u'interests_religiousindex')


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'django_facebook.facebookcustomuser': {
            'Meta': {'object_name': 'FacebookCustomUser'},
            'about_me': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'access_token': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'blog_url': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'date_of_birth': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'facebook_id': ('django.db.models.fields.BigIntegerField', [], {'unique': 'True', 'null': 'True', 'blank': 'True'}),
            'facebook_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'facebook_open_graph': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'facebook_profile_url': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'gender': ('django.db.models.fields.CharField', [], {'max_length': '1', 'null': 'True', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'new_token_required': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'raw_data': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'}),
            'website_url': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'})
        },
        u'interests.interest': {
            'Meta': {'unique_together': "(('user', 'interest'),)", 'object_name': 'Interest'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'interest': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['interests.InterestSubject']"}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['django_facebook.FacebookCustomUser']"})
        },
        u'interests.interestsubject': {
            'Meta': {'object_name': 'InterestSubject'},
            'description': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'search_index': ('djorm_pgfulltext.fields.VectorField', [], {'default': "''", 'null': 'True', 'db_index': 'True'})
        },
        u'interests.politicalindex': {
            'Meta': {'object_name': 'PoliticalIndex'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'default': "'other'", 'max_length': '300'})
        },
        u'interests.politicalview': {
            'Meta': {'unique_together': "(('user', 'political_index'),)", 'object_name': 'PoliticalView'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'political_index': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['interests.PoliticalIndex']"}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['django_facebook.FacebookCustomUser']", 'unique': 'True'})
        },
        u'interests.religiousindex': {
            'Meta': {'object_name': 'ReligiousIndex'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'default': "'other'", 'max_length': '300'})
        },
        u'interests.religiousview': {
            'Meta': {'unique_together': "(('user', 'religious_index'),)", 'object_name': 'ReligiousView'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'religious_index': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['interests.ReligiousIndex']"}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['django_facebook.FacebookCustomUser']"})
        }
    }

    complete_apps = ['interests']