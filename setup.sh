# #!/bin/bash



# echo "===== Installing Node.js ====="
# curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
# sudo dnf install nodejs -y

# echo "===== Installing MySQL ====="
# sudo dnf install mysql-server -y

# sudo systemctl enable mysqld
# sudo systemctl start mysqld

# sudo dnf install dnf-plugins-core -y

# sudo dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
# sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
# sudo systemctl start docker
# sudo systemctl enable docker
# sudo usermod -aG docker ec2-user


#!/bin/bash

set -e

echo "====================================="
echo " Voting System Automated Setup"
echo "====================================="

# -------------------------------
# 1. Install Node.js
# -------------------------------

echo "Installing Node.js..."

curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

echo "Node.js version:"
node -v

echo "NPM version:"
npm -v


# -------------------------------
# 2. Install MySQL
# -------------------------------

echo "Installing MySQL..."

sudo dnf install -y mysql-server

sudo systemctl enable mysqld
sudo systemctl start mysqld

echo "MySQL status:"
sudo systemctl is-active mysqld


# -------------------------------
# 3. Create Database
# -------------------------------

echo "Creating database..."

sudo mysql <<EOF

CREATE DATABASE IF NOT EXISTS votingdb;

CREATE USER IF NOT EXISTS 'votinguser'@'localhost'
IDENTIFIED BY 'Voting@123';

GRANT ALL PRIVILEGES ON votingdb.*
TO 'votinguser'@'localhost';

FLUSH PRIVILEGES;

EOF

echo "Database created successfully."


# -------------------------------
# 4. Import Database SQL
# -------------------------------

if [ -f DB/voting.sql ]; then

    echo "Importing database..."

    mysql -u votinguser -pVoting@123 votingdb < DB/voting.sql

    echo "Database imported."

else

    echo "No SQL file found."
    echo "Skipping database import."

fi


# -------------------------------
# 5. Install Node Dependencies
# -------------------------------

echo "Installing Node.js dependencies..."

npm install



# Install required packages
echo "Installing required packages..."
sudo dnf install -y wget git curl ca-certificates

# Install Java 21
echo "Installing Java 21..."
sudo dnf install -y java-21-amazon-corretto

# Verify Java
echo "Checking Java version..."
java -version


# Add Jenkins repository
echo "Adding Jenkins repository..."
sudo wget -O /etc/yum.repos.d/jenkins.repo \
https://pkg.jenkins.io/redhat-stable/jenkins.repo

# Import Jenkins key
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2026.key

# Install Jenkins
echo "Installing Jenkins..."
sudo dnf install -y jenkins

# Start Jenkins
echo "Starting Jenkins..."
sudo systemctl enable --now jenkins

# Add Jenkins to Docker group
echo "Adding Jenkins to Docker group..."
sudo usermod -aG docker jenkins

# Restart Jenkins
sudo systemctl restart jenkins



# -------------------------------
# 6. Start Application
# -------------------------------

echo "Starting Voting System..."

nohup node server.js > app.log 2>&1 &

echo $! > app.pid

sleep 5


# -------------------------------
# 7. Health Check
# -------------------------------

echo "Checking application..."

if curl -f http://localhost:3000; then

    echo ""
    echo "====================================="
    echo " Voting System Started Successfully"
    echo "====================================="

else

    echo ""
    echo "Application health check failed."
    echo "Check logs using:"
    echo "tail -f app.log"

fi
