pipeline {

    agent any

    environment {

        APP_NAME = "voting-system"

    }


    stages {

        stage('Checkout Code') {

            steps {

                echo "Pulling latest code"

                git branch: 'main',
                url: 'https://github.com/challatoora/Voting-system.git'

            }

        }

        stage('Stop Old Containers') {

            steps {

                echo "Stopping old containers"

                sh '''
                docker compose down || true
                '''

            }

        }


        stage('Build Docker Image') {

            steps {

                echo "Building Docker image"

                sh '''

                docker build -t voting-app:v1 .

                '''

            }

        }

        stage('Deploy Application') {

            steps {

                echo "Starting containers"

                sh '''

                docker compose up -d

                '''

            }

        }

        stage('Verify Deployment') {

            steps {

                echo "Checking containers"

                sh '''

                docker ps

                docker logs voting-app

                '''

            }

        }


    }

    post {

        success {

            echo "Deployment Successful"

        }


        failure {

            echo "Deployment Failed"

        }


    }

}