// Import the necessary module
const axios = require('axios');

// Extract base URLs from environment variables
const QUESTION_API_URL = process.env.QUESTION_API_URL;
const TEAM_API_URL = process.env.TEAM_API_URL;
const USER_API_URL = process.env.USER_API_URL;

// Function to get questions for a given game
module.exports.getQuestions = async (gameId) => {
    try {
        const response = await axios.get(`${QUESTION_API_URL}/games/${gameId}`);
        return response.data.questions;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error
    }
}

// Function to get all teams
module.exports.getTeams = async () => {
    try {
        const response = await axios.get(`${TEAM_API_URL}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error
    }
}

// Function to get user by ID
module.exports.getUserById = async (id) => {
    try {
        const response = await axios.get(`${USER_API_URL}/getGamedataByUserId/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error
    }
};

// Function to get team by ID
module.exports.getTeamById = async (id) => {
    try {
        const response = await axios.get(`${TEAM_API_URL}/get/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error
    }
};

// Function to get question by ID
module.exports.getQuestionById = async (id) => {
    try {
        const response = await axios.get(`${QUESTION_API_URL}/questions/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error
    }
};

// Function to update user score
module.exports.updateUserScore = async (id, data) => {
    try {
        const response = await axios.post(`${USER_API_URL}/updateGameDataById/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error
    }
};

// Function to update team score
module.exports.updateTeamScore = async (id, data) => {
    try {
        const response = await axios.post(`${TEAM_API_URL}/updatestats/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error
    }
};
