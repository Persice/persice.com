Set up PostgerSQL

Preparation:
```
pip install -r requirements.txt
export DJANGO_SETTINGS_MODULE=bekindred.settings.local
./manage.py syncdb
./manage.py migrate --all
```

Configure SSH keys
```
vim ~/.ssh/config
Host heroku.com
 Hostname heroku.com
 Port 22
 IdentitiesOnly yes
 IdentityFile ~/.ssh/id_rsa
 User example.com@gmail.com

```

Deploy to heroku
```
git push heroku master
heroku run python bekindred/manage.py syncdb --settings=bekindred.settings.production
heroku run python bekindred/manage.py migrate goals --settings=bekindred.settings.production
```

