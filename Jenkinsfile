pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = 'node'
        CURRENT_TAG = 'latest'
        PREVIOUS_TAG = 'previous'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }
          
        stage('Clone Repository') {
            steps {
                git 'https://github.com/Subashankaveri/nodeproject.git'
            }
        }

        stage('Stop and Remove Existing Container') {
            steps {
                script {
                    sh 'docker stop nj || true'
                    sh 'docker rm nj || true'
                }
            }
        }

        stage('Tag Previous Image') {
            steps {
                script {
                    sh '''
                        if docker images --format "{{.Repository}}:{{.Tag}}" | grep -q "^$DOCKER_IMAGE_NAME:$CURRENT_TAG$"; then
                            echo "Tagging current image as previous..."
                            docker tag $DOCKER_IMAGE_NAME:$CURRENT_TAG $DOCKER_IMAGE_NAME:$PREVIOUS_TAG
                        else
                            echo "No current image found to tag as previous."
                        fi
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $DOCKER_IMAGE_NAME:$CURRENT_TAG .'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    sh 'docker run -d -p 3000:3000 --name nj $DOCKER_IMAGE_NAME:$CURRENT_TAG'
                }
            }
        }
    }
    post {
        always {
            script {
                echo "Cleaning up dangling Docker images..."
                sh 'docker image prune -f'
            }
        }

        failure {
            script {
                sh '''
                    echo "Build failed, rolling back to previous image..."
                    if docker images --format "{{.Repository}}:{{.Tag}}" | grep -q "^$DOCKER_IMAGE_NAME:$PREVIOUS_TAG$"; then

                        echo "Previous image found. Rolling back to $DOCKER_IMAGE_NAME:$PREVIOUS_TAG..."
                        docker stop nj || true
                        docker rm nj || true
                        docker run -d -p 3000:3000 --name nj $DOCKER_IMAGE_NAME:$PREVIOUS_TAG
                    else
                        echo "No previous image found. Unable to roll back."
                    fi
                '''
            }
        }
    }
}
