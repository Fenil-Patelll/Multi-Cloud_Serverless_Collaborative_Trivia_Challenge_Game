// Importing a method to fetch teams from an external service
const { getTeams } = require("./services/external.service");

// Define the main function for AWS Lambda
exports.lexFulfillment = async (event) => {
    // Log the event object for debugging purposes

    // Check if necessary data is provided
    if (!event.sessionState || !event.sessionState.intent) {
        console.error('Error: event.sessionState.intent is undefined');
        return;
    }

    // Initialize a response object with basic structure
    let response = {
        "sessionState": {
            "intent": {
                "name": event.sessionState.intent.name,
                "slots": event.sessionState.intent.slots,
                "confirmationState": "None"
            },
            "dialogAction": {
                "type": "Close"
            },
            "sessionAttributes": {}
        },
        "messages": [],
        "requestAttributes": {}
    };

    // If the intent is to get the score for a team
    if (event.sessionState.intent.name === 'GetTeamScore') {
        // Extract team name from the intent slots
        let teamName = event.sessionState.intent.slots.teamName.value.originalValue;
        // Fetch the list of teams
        let teams = await getTeams();

        // Find the team with the provided name
        const team = teams.find(t => t.name === teamName);

        // If the team doesn't exist, set response intent to "Failed"
        // and provide an appropriate message
        if (!team) {
            console.log(`Team not found: ${teamName}`);
            response.sessionState.intent.state = "Failed";
            response.messages.push({
                "contentType": "PlainText",
                "content": `The team name you entered does not exist. Please enter a valid team name.`
            });
        } else {
            // If the team exists, set response intent to "Fulfilled"
            // and provide the team score
            console.log(`Team: ${JSON.stringify(team)}`);
            response.sessionState.intent.state = "Fulfilled";
            response.messages.push({
                "contentType": "PlainText",
                "content": `The score for team ${team.name} is ${team.pointsEarned}.`
            });
        }
    // If the intent is to get the navigation path for a particular section
    } else if (event.sessionState.intent.name === 'GetNavigation') {
        // Extract the section name from the intent slots
        let navigationFor = event.sessionState.intent.slots.navigationFor.value.originalValue;

        let navigationPath = '';

        // Determine the navigation path based on the section name
        switch(navigationFor.toLowerCase()) {
            case "game lobby":
            case "gamelobby":
                navigationPath = "Step 1: login first. Step 2: Click on 'Go to profile page'. Step 3: Search for lobby based on your choice or create your own. Step 4: Enter the lobby.";
                break;
            case "game leaderboard":
                navigationPath = "Step 1: login first. Step 2: Click on 'Go to profile page'. Step 3: View game stats.";
                break;
            case "user signup":
            case "signup options":
            case "signup":
            case "user signup options":
                navigationPath = "Step 1: Open the App. Step 2: The First Display Signup options like google, facebook and normal signup. Step 3: Choose any of them complete the signup. Step 4: Come on the home page again complete the login"  ;
                break;
            case "user profile":
            case "userprofile":
            case  "User Profile":
                navigationPath = "Step 1: login first. Step 2: Select the side view bar. Step 3: Click on 'User Profile'.";
                break;
            default:
                navigationPath = null;
        }

        // If the navigation path doesn't exist, set response intent to "Failed"
        // and provide an appropriate message
        if (!navigationPath) {
            console.log(`Invalid navigation: ${navigationFor}`);
            response.sessionState.intent.state = "Failed";
            response.messages.push({
                "contentType": "PlainText",
                "content": `Navigation does not exist for this.`
            });
        } else {
            // If the navigation path exists, set response intent to "Fulfilled"
            // and provide the navigation path
            console.log(`Navigation for: ${navigationFor}`);
            response.sessionState.intent.state = "Fulfilled";
            response.messages.push({
                "contentType": "PlainText",
                "content": navigationPath
            });
        }
    }

    // Return the final response object
    return response;
};
