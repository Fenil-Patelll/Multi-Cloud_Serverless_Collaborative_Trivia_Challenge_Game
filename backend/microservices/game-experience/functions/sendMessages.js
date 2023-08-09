// Import dependencies and services
const AWS = require("aws-sdk");
const SnsService = require("../utils/sns.service");
const Chat = require("../models/chat.model");
const { v4: uuidv4 } = require("uuid");
const { getTeamById } = require("../utils/external.service");

// Export the sendMessages function
exports.sendMessages = async (event, context) => {
    let team = null;
    let response;
    try {
      // Extract message details from the event body
      const { teamId, senderId, senderName, message } = JSON.parse(event.body);
  
      // Generate a unique chatId and current timestamp
      const chatId = uuidv4();
      const timestamp = Date.now();
  
      // Prepare the chat message object
      const chatMessage = new Chat({ chatId, teamId, senderId, senderName, message, timestamp });
  
      // Fetch the team data using the teamId
      team = await getTeamById(teamId);
  
      // If the team doesn't exist, throw an error
      if (!team) {
        throw new Error("Team not found");
      }
  
      // Validate if the sender is a member of the team
      const senderIsMember = team.members.some(member => member.userId === senderId);
      // If sender is not a member of the team, throw an error
      if (!senderIsMember) {
        throw new Error("Sender is not a member of the team");
      }
  
      // Use the SNS Service to publish the chat message to the corresponding SNS topic
      await SnsService.sendMessages(chatId, teamId, senderId, senderName, message, timestamp);
  
      // If everything went well, return a successful response
      response = {
        statusCode: 200,
        body: JSON.stringify({ chatMessage }),
      };
      return response;
    } catch (error) {
      // If there are any errors during the process, log them and return an error response
      console.error('Error: ', error);
      response = {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error. Failed to send message!', error: error }),
      };
      return response;
    }
};

