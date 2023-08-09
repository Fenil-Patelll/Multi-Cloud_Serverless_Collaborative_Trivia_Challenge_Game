@echo off
setlocal

set "workDir=%cd%"

echo Starting to deploy microservices

for /d %%i in ("%workDir%\microservices\*") do (
    echo Deploying microservice: %%~nxi
    if exist "%%i\serverless.yml" (
        cd "%%i"
        serverless deploy
    ) else (
        echo serverless.yml not found in %%~nxi. Skipping deployment.
    )
)

echo Completed deployment of microservices
