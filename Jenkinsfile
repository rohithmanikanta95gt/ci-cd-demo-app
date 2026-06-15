pipeline {
    agent any

    environment {
        // Define the name of your Docker Hub repository
        // Change 'your-docker-username' to your actual Docker Hub username
        DOCKER_IMAGE = 'your-docker-username/nodejs-devops-app'
    }

    stages {
        // Stage 1: Checkout source code from GitHub
        stage('Checkout Source') {
            steps {
                echo '--- STAGE 1: Checking out source code from Git ---'
                checkout scm
            }
        }

        // Stage 2: Install dependencies
        stage('Install Dependencies') {
            steps {
                echo '--- STAGE 2: Installing dependencies ---'
                // Runs npm install (if using Windows agents, change "sh" to "bat")
                sh 'npm install'
            }
        }

        // Stage 3: Run automated tests
        stage('Run Automated Tests') {
            steps {
                echo '--- STAGE 3: Running automated unit tests ---'
                sh 'npm test'
            }
        }

        // Stage 4: Build Docker image
        stage('Build Docker Image') {
            steps {
                echo '--- STAGE 4: Building Docker image ---'
                // Builds and tags image as latest and with current build number
                sh "docker build -t ${DOCKER_IMAGE}:latest -t ${DOCKER_IMAGE}:${BUILD_NUMBER} ."
            }
        }

        // Stage 5: Push Docker image to Docker Hub
        stage('Push Docker Image') {
            steps {
                echo '--- STAGE 5: Pushing Docker image to Docker Hub ---'
                // Binds Jenkins Credentials 'docker-hub-credentials' to env variables DOCKER_USERNAME and DOCKER_PASSWORD
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials', 
                    usernameVariable: 'DOCKER_USERNAME', 
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    // Log in to Docker Hub using the credentials
                    sh "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin"
                    
                    // Push the tags to Docker Hub
                    sh "docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
            }
        }

        // Stage 6: Stop existing container if running
        stage('Stop Existing Container') {
            steps {
                echo '--- STAGE 6: Stopping existing container if running ---'
                // Stop and remove the container. "|| true" ensures build does not fail if container is not running.
                sh 'docker stop nodejs-app-container || true'
                sh 'docker rm nodejs-app-container || true'
            }
        }

        // Stage 7: Run latest Docker container
        stage('Run Latest Container') {
            steps {
                echo '--- STAGE 7: Running latest Docker container ---'
                // Run container in detached mode (-d), name it, and map port 3000 on the host to 3000 in the container
                sh "docker run -d --name nodejs-app-container -p 3000:3000 ${DOCKER_IMAGE}:latest"
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete.'
            // Clean up Docker credentials credentials by logging out
            sh 'docker logout || true'
        }
        success {
            echo 'Deployment successful! Application is running at http://localhost:3000'
        }
        failure {
            echo 'Pipeline failed. Please check the logs above for details.'
        }
    }
}
