// Import functions from external service
const { getQuestionById, getTeamById, getUserById, updateUserScore, updateTeamScore } = require("../utils/external.service");

// Export realTimeScore function
module.exports.realTimeScore = async (event) => {
    let question = null;
    let team = null;
    try {
        // Fetch the question based on the ID provided in path parameters
        question = await getQuestionById(event.pathParameters.questionId);

        // If question is not found, throw an error
        if (!question) throw new Error('Question not found');

        // Parse the body of the event
        let body = JSON.parse(event.body);

        // Fetch the team data by teamId provided in body
        team = await getTeamById(body.teamId);

        // Convert the question points and team's current points to a number
        let pointsToAdd = Number(question.points);
        let newScore = Number(team.pointsEarned);

        // Check if the answer submitted is correct and pointsToAdd is a number
        if (body.answer === question.correctAnswer && !isNaN(pointsToAdd)) {
            // If the answer is correct, increase the team's score

            console.log('answer is correct',body.answer );
            console.log('answer is correct',question.correctAnswer );
            newScore += pointsToAdd;

            // Loop through all members of the team
            for (let member of team.members) {
                // Fetch the user data for each team member
                let user = await getUserById(member.userId);

                // If the user doesn't have totalPoints yet or totalPoints is not a number, set it to 0
                if (!user.totalPoints || isNaN(user.totalPoints)) {
                    user.totalPoints = 0;
                }

                // Increase the user's totalPoints
                user.totalPoints += pointsToAdd;
                let newUserScore=Number(user.totalPoints)

                // Prepare the data to update the user's score
                let data = {
                    totalGamePlayed: 0,
                    win: 0,
                    loss: 0,
                    totalPoints: newUserScore,
                    achievements: ""
                };

                // Update the user's score
                const userUpdatedData = await updateUserScore(member.userId, data);
            }

            // Prepare the data to update the team's score
            let data = { pointsEarned: newScore }

            // Update the team's score
            const teamUpdatedData = await updateTeamScore(team.id, data);
        }

        // Return a success response with the updated score details
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Answer processed',
                teamName: team.name,
                newTeamScore: team.pointsEarned,
                members: team.members.map(member => ({
                    userId: member.userId,
                }))
            })
        };
    } catch (error) {
        // If an error occurred, return a server error response
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error. Not Able to fetch Real Time Score !!',
                error: error.message
            })
        };
    }
};
