#!/bin/bash



echo "===== Installing Node.js ====="
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install nodejs -y

echo "===== Installing MySQL ====="
sudo dnf install mysql-server -y

sudo systemctl enable mysqld
sudo systemctl start mysqld

sudo dnf install dnf-plugins-core -y

sudo dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user


