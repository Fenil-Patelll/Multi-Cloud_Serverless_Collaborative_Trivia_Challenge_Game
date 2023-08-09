const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openaiClient = new OpenAIApi(configuration);

const generateTeamName = async (context = "Generate a unique team name.") => {
  try {
    const res = await openaiClient.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: context }],
    });
    
    const teamName = res.data.choices[0].message.content;
    console.log("Generated team name: " + teamName);
    return teamName;
  } catch (error) {
    console.log(error);
    throw new Error("Error generating teamName");
  }
};

module.exports = {
  generateTeamName
};
