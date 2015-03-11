import os
from fabric.api import env, run, local, task, sudo, cd, require
from fabric.colors import green

# Vagrant for local testing
# env.hosts = ['127.0.0.1']
# env.port = '2222'

env.hosts = ['104.200.24.201']
env.port = '20005'

env.user = 'bekindred'
env.key_filename = '~/.ssh/id_rsa'


env.project_name = 'bekindred'
env.server_name = 'linode'
env.webapps_root = '/webapps/bekindred/'
env.repo_root = os.path.join(env.webapps_root, 'beKindred.com')
env.socketio = os.path.join(env.repo_root, 'socketio')
env.settings = 'bekindred.settings.production_linode'

env.project_root = os.path.join(env.repo_root, env.project_name)
env.activate_script = os.path.join(env.webapps_root, 'bin/activate')
env.wsgi_file = os.path.join(env.project_root, env.project_name, 'django.wsgi')

env.requirements_file = os.path.join(env.repo_root, 'requirements.txt')
env.manage_dir = env.project_root


@task
def production():
    env.hosts = [env.server_name]


@task
def local_uname():
    local('uname -a')


@task
def remote_uname():
    run('uname -a')
    print green("Start deploying...!")


@task
def virtualenv(command, use_sudo=False):
    if use_sudo:
        func = sudo
    else:
        func = run
    func('source "%s" && %s' % (env.activate_script, command))


@task
def update(branch='origin/master'):
    with cd(env.repo_root):
        print green(env.repo_root)    
        print green('Branch: {}'.format(branch))    
        run('git fetch --all')
        run('git checkout --force {}'.format(branch))

@task
def install_requirements():
    virtualenv('pip install -r %(requirements_file)s' % env)


@task
def manage_py(command, use_sudo=False):
    require('hosts', provided_by=[production])
    with cd(env.manage_dir):
        virtualenv('python manage.py %s --settings=%s' %
                   (command, env.settings), use_sudo)


@task
def syncdb(app=None):
    require('hosts', provided_by=[production])
    manage_py('syncdb --noinput')


@task
def migrate():
    require('hosts', provided_by=[production])
    manage_py('migrate')


@task
def migrate_list():
    require('hosts', provided_by=[production])
    manage_py('migrate')


@task
def test():
    manage_py('test')


@task
def collectstatic():
    require('hosts', provided_by=[production])
    manage_py('collectstatic -l --noinput', use_sudo=True)


@task
def restart_app():
    sudo('supervisorctl stop bekindred')
    sudo('supervisorctl start bekindred')
    sudo('supervisorctl status bekindred')


@task
def restart_nginx():
    sudo('service nginx restart')


@task
def restart_redis():
    sudo('service redis-server restart')


@task
def restart_node():
    with cd(env.socketio):
        sudo('npm install')
        sudo('pm2 kill')
        sudo('pm2 start app.js')


@task
def reload():
    restart_app()
    restart_node()
    restart_nginx()


@task
def update_stop_words():
    sudo(os.path.join(env.project_root, env.project_name, 'data',
                      'update_stop_words_ubuntu.sh'))


@task
def deploy():
    require('hosts', provided_by=[production])
    remote_uname()
    update()
    install_requirements()
    syncdb()
    migrate()
    collectstatic()
    reload()
    print green('Successful!')
