# Leaderboard App

This is a leaderboard application that allows users to view global and category-specific leaderboards for teams and individual players. Users can also filter leaderboards by time frame (e.g., daily, weekly, monthly, or all-time) and view detailed statistics for top-performing teams and players.

## Features

The leaderboard app offers the following features:

1. **Global and Category-Specific Leaderboards**: Users can view both global leaderboards that include all teams and players, as well as category-specific leaderboards that focus on specific criteria or categories.

2. **Filter by Time Frame**: Users can filter leaderboards based on different time frames such as daily, weekly, monthly, or all-time. This allows users to see how teams and players are performing within specific periods.

3. **Detailed Statistics**: The app provides detailed statistics for the top-performing teams and players. Users can gain insights into their performance, including metrics like win rate, average score, or any other relevant statistics.

## Deployment

Update Environment Variables:

> Note: Before deploying the application, make sure to update the provider variables in the serverless.yml file. Set the values for project to your Google project identifier. This variables are required for the proper functioning of the Leaderboard feature.

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
Deploying google-node-express-api-project to stage dev (us-east-1)

✔ Service deployed to stack google-node-express-api-project-dev (196s)

endpoint: ANY - https://us-central1-xxxxxxxxxx.cloudfunctions.net/leaderboards-dev-service
functions:
  api: google-node-express-api-project-dev-api (766 kB)
```

## APIs

The following APIs are available for interacting with the Leaderboard feature. Please use the provided Postman collection file to access these APIs.

> Note: To make API requests, import the provided Postman collection file `serverless-trivia-game.postman_collection.json` into Postman. The collection includes pre-configured requests for each API endpoint, making it easy to test and interact with the Leaderboard feature.

### `POST /update`

Update the leaderboard.

- Requires authentication: Yes (API User)
- Controller: `LeaderboardController.updateLeaderboard`

### `GET /getAll`

Get the global leaderboard.

- Requires authentication: Yes (API User)
- Controller: `LeaderboardController.getGlobalLeaderboard`

### `GET /filter/:timeFrame`

Filter the leaderboard by a specific time frame.

- Requires authentication: Yes (API User)
- Parameters:
  - `timeFrame`: The time frame to filter the leaderboard by.
- Controller: `LeaderboardController.filterLeaderboardByTimeFrame`

### `GET /statistics/:entityId/:category`

Get statistics for a specific entity and category.

- Requires authentication: Yes (API User)
- Parameters:
  - `entityId`: The ID of the entity.
  - `category`: The category to get statistics for.
- Controller: `LeaderboardController.getEntityStatistics`

### `GET /entity/:entityId`

Get the leaderboard for a specific entity.

- Requires authentication: Yes (API User)
- Parameters:
  - `entityId`: The ID of the entity.
- Controller: `LeaderboardController.getLeaderboardByEntityId`

## Local development

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
