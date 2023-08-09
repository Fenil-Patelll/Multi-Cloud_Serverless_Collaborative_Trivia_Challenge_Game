// Import necessary dependencies
const axios = require('axios');
const { getQuestionById } = require("../utils/external.service");

// Export the submitAnswer function
exports.submitAnswer = async (event, context) => {
    let question = null;
    try {
        // Extract questionId from the event object
        const { questionId } = event.pathParameters;

        // Fetch the question by Id
        question=await getQuestionById(questionId);
        
        // If the question doesn't exist, return a 404 response
        if (!question) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Question not found' })
            };
        }

        // Parse the request body to get the user's answer
        const requestBody = JSON.parse(event.body);
        console.log(requestBody.answer);

        // If no answer is provided, return a response notifying the user
        if (requestBody.answer === null) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'No answer selected',
                    isCorrect: false,
                    correctAnswer: question.correctAnswer,
                    explanation: question.explanation
                })
            };
        }

        // Check if the provided answer matches the correct answer
        const isCorrect = requestBody.answer === question.correctAnswer;

        // Return a response based on whether the answer was correct or not
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: isCorrect ? 'Correct answer' : 'Incorrect answer',
                isCorrect: isCorrect,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation
            })
        };

    } catch (error) {
        // In case of any errors, log them and return a 500 response
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error. Failed to submit Answer !!',
                error: error
            })
        };
    }
};
