# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant::Config.run do |config|
	# Every Vagrant virtual environment requires a box to build off of.
	config.vm.box = "ubuntu/trusty64"

  config.ssh.forward_agent = true

	# The url from where the 'config.vm.box' box will be fetched if it
	# doesn't already exist on the user's system.

	# Boot with a GUI so you can see the screen. (Default is headless)
	# config.vm.boot_mode = :gui

	# Assign this VM to a host only network IP, allowing you to access it
	# via the IP.
	# config.vm.network "33.33.33.10"


	# Forward a port from the guest to the host, which allows for outside
	# computers to access the VM, whereas host only networking does not.
	# config.vm.forward_port "http", 80, 8080



	# Share an additional folder to the guest VM. The first argument is
	# an identifier, the second is the path on the guest to mount the
	# folder, and the third is the path on the host to the actual folder.
	config.vm.share_folder "v-data", "/vagrant_data", "./data", :nfs => true
	config.vm.share_folder "project", "/home/vagrant/bekindred/", ".", :nfs => true

	# Enable provisioning with a shell script.
	config.vm.provision :shell, :path => "install.sh", :args => "bekindred"
  config.vm.provision :shell, :path => "provision-configure.sh", :privileged => false
end


Vagrant.configure("2") do |config|
config.vm.provider "virtualbox" do |v|
  v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
  v.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
  v.customize ["modifyvm", :id, "--memory", 1024*4]
end
config.vm.network "private_network", ip: "10.0.1.11"
  config.vm.network "forwarded_port", guest: 22, host: 2201, id: "ssh"
  config.vm.network "forwarded_port", guest: 8000, host: 8000
  config.vm.network "forwarded_port", guest: 8888, host: 8888
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 80, host: 80
  config.vm.network "forwarded_port", guest: 9200, host: 9200
  config.vm.network "forwarded_port", guest: 9999, host: 9999
  config.vm.network "forwarded_port", guest: 5432, host: 5433
  config.vm.network "forwarded_port", guest: 7474, host: 7475
  config.vm.network "forwarded_port", guest: 7687, host: 7687
end


