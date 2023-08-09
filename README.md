# CSCI5410-SUMMER-23-SDP33
# Multi-Cloud Trivia Game

This project is a trivia game built on a multi-cloud architecture, utilizing the services offered by AWS and GCP. The game will employ various services such as AWS Lambda, GCP Firestore, Chat GPT, DynamoDB, SQS, SNS, Pub/Sub, QuickSight, GCP DataStudio, Looker Studio, and more.

## Installation

To run this project locally, you will need to have the following installed:

- Node.js
- AWS CLI


Once you have installed the necessary dependencies, you can clone this repository and run the following command to install the required packages:

```
npm install
```

## Configuration

Before running the project, you will need to configure your AWS and GCP credentials by running the following commands:

```
aws configure
gcloud auth login
```

You will also need to create the necessary resources in both AWS and GCP, such as the DynamoDB table, S3 bucket, and Firestore database. The necessary configuration files can be found in the `config` directory.

## Usage

To start the trivia game, run the following command:

```
npm start
```

This will start the server and allow users to connect and play the game.

## Architecture

This trivia game is built on a multi-cloud architecture, utilizing the services offered by both AWS and GCP. The game is designed to be scalable and fault-tolerant, with the ability to handle a large number of concurrent users.

The AWS services used in this project include:

- AWS Lambda: used to run serverless functions
- DynamoDB: used as the primary database for storing game data
- SQS and SNS: used for messaging and event-driven communication between services
- QuickSight: used for data visualization and analytics

The GCP services used in this project include:

- Firestore: used as a secondary database for storing user data and game logs
- Chat GPT: used for natural language processing and chatbot functionality
- Pub/Sub: used for messaging and event-driven communication between services
- DataStudio and Looker Studio: used for data visualization and analytics

## Contributing

If you are interested in contributing to this project, please fork the repository and submit a pull request. We welcome any and all contributions, including bug fixes, feature requests, and documentation updates.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.


### Deployment

Update Environment Variables:

> Note: Before deploying the application, make sure to update the environment variables in the serverless.yml file. Set the values for SNS_TOPIC_ARN, OPENAI_API_KEY, and REGION according to your AWS SNS topic ARN, OpenAI API key, and AWS region, respectively. These environment variables are required for the proper functioning of the Team Management feature.

Install dependencies with:

```
npm install
```

and then deploy with:

```
serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-express-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-express-api-project-dev (196s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
functions:
  api: aws-node-express-api-project-dev-api (766 kB)


  ## APIs

The following APIs are available for interacting with the Team Management feature. Please use the provided Postman collection file to access these APIs.

> Note: To make API requests, import the provided Postman collection file `serverless-trivia-game.postman_collection.json` into Postman. The collection includes pre-configured requests for each API endpoint, making it easy to test and interact with the Team Management feature.

### Team APIs

- **Create a team**
  - `POST /teams/`: Create a new team.
  - Request Body: `{ "name": "Team Name" }`
  - Authentication: User authentication required.



### Team Name Generator API

- **Generate a team name using AI**
  - `GET /teams/generate/teamName`: Generate a team name using AI.
  - Authentication: User authentication required.



### Team Member APIs


- **Update team member**
  - `POST /teams/:teamId/members/:memberId`: Update details of a team member.
  - Request Body: `{ "role": "admin" }`
  - Authentication: User authentication required.




### Local development

It is also possible to emulate API Gateway and Lambda locally by using `serverless-offline` plugin. In order to do that, execute the following command:

```bash
serverless plugin install -n serverless-offline
```

It will add the `serverless-offline` plugin to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`.

After installation, you can start local emulation with:

```
serverless offline
```

To learn more about the capabilities of `serverless-offline`, please refer to its [GitHub repository](https://github.com/dherault/serverless-offline).