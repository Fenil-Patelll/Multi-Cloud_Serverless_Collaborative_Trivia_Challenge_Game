#!/bin/bash

workDir=`pwd`

echo "Starting to deploy microservices"

for service in `ls microservices`;
do
    echo "deploying microservice: ${service}"
    cd $service
    serverless deploy
done

echo "Completed deployment of microservices"
