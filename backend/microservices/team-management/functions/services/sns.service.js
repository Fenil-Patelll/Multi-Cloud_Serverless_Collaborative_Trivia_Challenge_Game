const AWS = require("aws-sdk");

const sns = new AWS.SNS({ region: process.env.REGION });

const publishTeamInvitation = async(message) => {
  try {
    const snsParams = {
      Message: JSON.stringify(message),
      TopicArn: process.env.TEAM_INVITATION_TOPIC_ARN,
    };
    await sns.publish(snsParams).promise();
  } catch (error) {
    console.log(error);
    console.log("Error publishing team invitation message");
    throw error;
  }
}

const publishAcceptRejectInvitation = async(message) => {
  try {
    const snsParams = {
      Message: JSON.stringify(message),
      TopicArn: process.env.TEAM_ACCEPT_REJECT_TOPIC_ARN,
    };
    await sns.publish(snsParams).promise();
  } catch (error) {
    console.log(error);
    console.log("Error publishing team accept/reject message");
    throw error;
  }
}

const sendInvitationNotification = async (template, params) => {
  try {
    const message = {
      templateName: template,
      params: params
    };
    const snsParams = {
      Message: JSON.stringify(message),
      TopicArn: process.env.SNS_TOPIC_ARN,
    };
    await sns.publish(snsParams).promise();
  } catch (error) {
    console.log("Error publishing message");
    throw error;
  }
};

const sendInGameNotification = async (message) => {
  try {
    const snsParams = {
      Message: JSON.stringify(message),
      TopicArn: process.env.NotificationTopicARN
    };
    await sns.publish(snsParams).promise();
  } catch (error) {
    console.log("Error publishing notification message");
    throw error;
  }
};

const subscribeEmailNotification = async (email) => {
  try {
    const params = {
      Protocol: "email",
      TopicArn: process.env.SNS_TOPIC_ARN,
      Endpoint: email,
    };

    await sns.subscribe(params).promise();
  } catch (error) {
    console.log("Error subscribing email endpoint to SNS:", error);
    throw error;
  }
};

const unsubscribeEmailNotification = async (email) => {
  try {
    const subscriptionsResponse = await sns.listSubscriptionsByTopic({
      TopicArn: process.env.SNS_TOPIC_ARN,
    }).promise();
    
    const subscriptions = subscriptionsResponse.Subscriptions;
    
    const subscription = subscriptions.find(sub => sub.Protocol === "email" && sub.Endpoint === email);
    
    if (subscription) {
      await sns.unsubscribe({ SubscriptionArn: subscription.SubscriptionArn }).promise();
      console.log("Email endpoint unsubscribed successfully.");
    } else {
      console.log("Email endpoint not found in subscriptions.");
    }
  } catch (error) {
    console.log("Error unsubscribing email endpoint from SNS:", error);
    throw error;
  }
};

module.exports = {
  publishTeamInvitation,
  publishAcceptRejectInvitation,
  sendInvitationNotification,
  subscribeEmailNotification,
  unsubscribeEmailNotification,
  sendInGameNotification
};
