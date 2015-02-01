adduser soand
passwd soand
visudo

# add this line
# soand ALL=(ALL:ALL) ALL

# relogin as soand







sudo groupadd --system webapps
sudo useradd --system --gid webapps --shell /bin/bash --home /webapps/bekindred bekindred

sudo mkdir -p /webapps/bekindred/
sudo chown bekindred /webapps/bekindred/

sudo su - bekindred

cd /webapps/bekindred/
virtualenv .


ssh localhost
ssh-keygen
git clone

pip install -r requirements.txt


sudo chown -R bekindred:users /webapps/bekindred
sudo chmod -R g+w /webapps/bekindred

# gunicorn
# count number of workers
python -c "import multiprocessing; print multiprocessing.cpu_count() * 2 + 1"

sudo vim /webapps/bekindred/bin/gunicorn_start
sudo chmod u+x /webapps/bekindred/bin/gunicorn_start

##################
### supervisor ###
##################
sudo aptitude install supervisor
sudo touch /etc/supervisor/conf.d/bekindred.conf

mkdir -p /webapps/bekindred/logs/
touch /webapps/bekindred/logs/gunicorn_supervisor.log 



# nginx

sudo ln -s /etc/nginx/sites-available/bekindred /etc/nginx/sites-enabled/bekindred
