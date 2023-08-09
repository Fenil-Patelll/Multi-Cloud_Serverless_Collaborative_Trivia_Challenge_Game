const axios = require('axios');
const functions = require("@google-cloud/functions-framework");

module.exports.main = async (req, res) => {
    try {
        const question  = req.body;
        const response = await axios.post(
            'https://language.googleapis.com/v1beta2/documents:classifyText?key=AIzaSyD_DBTbYrjuBQCBnlM4EZh_vkZb0o4nJ4c', //replace with your NLP API Key
            {
                document: {
                    content: question + question + question,
                    type: 'PLAIN_TEXT',
                },
                classificationModelOptions: {
                }
            },
        );
        const category = response.data.categories[0].name;
        res.status(200).send(category);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error');
    }
};

