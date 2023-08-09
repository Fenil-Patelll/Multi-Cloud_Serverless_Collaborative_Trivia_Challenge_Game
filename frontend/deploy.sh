#!/bin/bash

# Authenticate Docker with Google Cloud Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev

# Create the Artifact Registry repository
gcloud artifacts repositories create sdp33-trivia-app --repository-format=docker --location=us-central1 --description="sdp33 trivia application"

# Build and tag the Docker image
docker build -t trivia-ui .

# Tag the Docker image with the Artifact Registry URL
docker tag trivia-ui us-central1-docker.pkg.dev/b009040970-serverless-393804/sdp33-trivia-app/trivia-ui

# Push the Docker image to Google Cloud Artifact Registry
docker push us-central1-docker.pkg.dev/b009040970-serverless-393804/sdp33-trivia-app/trivia-ui
