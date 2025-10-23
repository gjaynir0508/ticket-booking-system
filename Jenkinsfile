pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = 'dockerhub-cred-id' // Jenkins credential id with Docker Hub username/password
    DOCKER_IMAGE = "your-dockerhub-username/ticket-booking-app"
    KUBECONFIG_CREDENTIALS = 'kubeconfig-cred-id' // Jenkins credential id with kubeconfig (file)
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build & Test') {
      steps {
        dir('app') {
          sh 'npm ci'
          // run tests if present
          sh 'node test.js || true'
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          sh "docker --version || true"
          // login to Docker Hub using stored credentials
          withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS, usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
            sh "echo ${DH_PASS} | docker login -u ${DH_USER} --password-stdin"
            sh "docker build -t ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ."
            sh "docker tag ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
            sh "docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
            sh "docker push ${DOCKER_IMAGE}:latest"
            sh "docker logout"
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        // use kubeconfig credentials stored in Jenkins as a file credential
        withCredentials([file(credentialsId: KUBECONFIG_CREDENTIALS, variable: 'KUBECONFIG_FILE')]) {
          sh 'mkdir -p $HOME/.kube'
          sh 'cp $KUBECONFIG_FILE $HOME/.kube/config'
          sh "kubectl apply -f k8s/deployment.yaml"
          sh "kubectl apply -f k8s/service.yaml"
          sh "kubectl apply -f k8s/hpa.yaml || true"
          // optionally run rollout status
          sh "kubectl rollout status deployment/ticket-booking-deployment --timeout=120s || true"
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline completed successfully."
    }
    failure {
      echo "Pipeline failed."
    }
  }
}
