# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant::Config.run do |config|
	# Every Vagrant virtual environment requires a box to build off of.
	config.vm.box = "ubuntu/trusty64"

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
end


Vagrant.configure("2") do |config|
config.vm.network "private_network", ip: "192.168.10.11"
  config.vm.network "forwarded_port", guest: 8000, host: 8000
end