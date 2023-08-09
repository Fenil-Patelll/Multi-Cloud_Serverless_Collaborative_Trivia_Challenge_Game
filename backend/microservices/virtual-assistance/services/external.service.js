// Import necessary module
const axios = require('axios');

// Extract base URL from environment variables
const TEAM_API_URL = process.env.TEAM_API_URL;

// Function to get all teams
module.exports.getTeams = async () => {
    try {
        
        // const response = await axios.get(`${TEAM_API_URL}`);
        const response = await axios.get(`https://mjvsjlx9pa.execute-api.us-east-1.amazonaws.com/dev/api/teams/`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error
    }
}
