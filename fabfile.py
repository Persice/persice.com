from fabric.api import env, run, local, task
from fabric.colors import green


env.hosts = ['104.200.24.201']
env.port = '20005'
env.user = 'root'
env.key_filename = '~/.ssh/id_rsa'


@task
def local_uname():
    local('uname -a')


@task
def remote_uname():
    run('uname -a')
    print green("Start deploying...!")


@task
def pull():
    run('git pull origin master')


@task
def migrate():
    run('./manage.py migrate --all')
    run('./manage.py migrate --list')


@task
def test():
    local('./manage.py test')


@task
def build_static():
    pass


@task
def restart_app():
    run('supervisorctl stop bekindred')
    run('supervisorctl start bekindred')
    run('supervisorctl status bekindred')


@task
def restart_nginx():
    run('service nginx restart')


@task
def deploy():
    test()
    remote_uname()
    pull()
    migrate()
    restart_app()
