// Import the AWS SDK
const AWS = require("aws-sdk");

// Initialize a new SNS instance from the AWS SDK with the region provided as an environment variable
const sns = new AWS.SNS({ region: process.env.region });

// Function to send messages using SNS
const sendMessages = async (chatId, teamId, senderId, senderName, message, timestamp,) => {
  try { 
    // Prepare a chat object with provided parameters
    const chat = {
        chatId,
        teamId,
        senderId,
        senderName,
        message,
        timestamp,
    };

    // Prepare SNS parameters, including the message (the stringified chat object) and the topic ARN (Amazon Resource Name)
    const snsParams = {
      Message: JSON.stringify(chat),
      TopicArn: process.env.SNS_TOPIC_ARN,
    };

    // Publish the message to the SNS topic using the defined parameters, and wait for the promise to resolve
    await sns.publish(snsParams).promise();
  } catch (error) {
    // Log any errors that occur during the message publishing process
    console.log("Error publishing message");

    // Rethrow the error after logging it, so it can be handled by the calling function
    throw error;
  }
};

// Export the sendMessages function, so it can be used in other parts of the application
module.exports = {
    sendMessages,
};
