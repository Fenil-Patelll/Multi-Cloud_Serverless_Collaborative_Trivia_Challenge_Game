const isRequestValid = (requestBody, type) => {
    console.log("Request Body and Type: ", requestBody, type);
    const allowedKeys = [
        "category",
        "difficulty",
        "question",
        "options",
        "correctAnswer",
        "explanation",
        "points"
    ];

    if (type === "edit") {
        for (const key of Object.keys(requestBody)) {
            if (!allowedKeys.includes(key)) {
                console.log("Invalid key found for 'edit' type: ", key);
                return false;
            }
        }
    } else if (type === "create") {
        for (const key of allowedKeys) {
            if (!requestBody || !requestBody.hasOwnProperty(key)) {
                console.log("Required key missing for 'create' type: ", key);
                return false;
            }
        }
    } else {
        console.log("Invalid Type provided: ", type);
        return false;
    }

    return true;
};
module.exports = { isRequestValid };