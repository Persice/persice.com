# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'TwitterListFollowers'
        db.create_table(u'friends_twitterlistfollowers', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('twitter_id1', self.gf('django.db.models.fields.BigIntegerField')()),
            ('twitter_id2', self.gf('django.db.models.fields.BigIntegerField')()),
            ('name1', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('name2', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('profile_image_url1', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('profile_image_url2', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'friends', ['TwitterListFollowers'])

        # Adding unique constraint on 'TwitterListFollowers', fields ['twitter_id1', 'twitter_id2']
        db.create_unique(u'friends_twitterlistfollowers', ['twitter_id1', 'twitter_id2'])

        # Adding model 'TwitterListFriends'
        db.create_table(u'friends_twitterlistfriends', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('twitter_id1', self.gf('django.db.models.fields.BigIntegerField')()),
            ('twitter_id2', self.gf('django.db.models.fields.BigIntegerField')()),
            ('name1', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('name2', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('profile_image_url1', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('profile_image_url2', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'friends', ['TwitterListFriends'])

        # Adding unique constraint on 'TwitterListFriends', fields ['twitter_id1', 'twitter_id2']
        db.create_unique(u'friends_twitterlistfriends', ['twitter_id1', 'twitter_id2'])


    def backwards(self, orm):
        # Removing unique constraint on 'TwitterListFriends', fields ['twitter_id1', 'twitter_id2']
        db.delete_unique(u'friends_twitterlistfriends', ['twitter_id1', 'twitter_id2'])

        # Removing unique constraint on 'TwitterListFollowers', fields ['twitter_id1', 'twitter_id2']
        db.delete_unique(u'friends_twitterlistfollowers', ['twitter_id1', 'twitter_id2'])

        # Deleting model 'TwitterListFollowers'
        db.delete_table(u'friends_twitterlistfollowers')

        # Deleting model 'TwitterListFriends'
        db.delete_table(u'friends_twitterlistfriends')


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
        u'friends.friend': {
            'Meta': {'unique_together': "(('friend1', 'friend2'),)", 'object_name': 'Friend'},
            'friend1': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['django_facebook.FacebookCustomUser']"}),
            'friend2': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'friend2'", 'to': u"orm['django_facebook.FacebookCustomUser']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'status': ('django.db.models.fields.IntegerField', [], {'default': '0', 'max_length': '1'})
        },
        u'friends.twitterlistfollowers': {
            'Meta': {'unique_together': "(('twitter_id1', 'twitter_id2'),)", 'object_name': 'TwitterListFollowers'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name1': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'name2': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'profile_image_url1': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'profile_image_url2': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'twitter_id1': ('django.db.models.fields.BigIntegerField', [], {}),
            'twitter_id2': ('django.db.models.fields.BigIntegerField', [], {})
        },
        u'friends.twitterlistfriends': {
            'Meta': {'unique_together': "(('twitter_id1', 'twitter_id2'),)", 'object_name': 'TwitterListFriends'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name1': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'name2': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'profile_image_url1': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'profile_image_url2': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'twitter_id1': ('django.db.models.fields.BigIntegerField', [], {}),
            'twitter_id2': ('django.db.models.fields.BigIntegerField', [], {})
        }
    }

    complete_apps = ['friends']