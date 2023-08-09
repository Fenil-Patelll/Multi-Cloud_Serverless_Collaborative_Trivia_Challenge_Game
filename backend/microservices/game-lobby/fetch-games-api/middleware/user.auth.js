const verifyAPIUser = (request, response, next) => {
    const reqToken = request.headers.authorization;
    if (!reqToken) {
        return response.status(401).send('Unauthorized');
    }
    // TODO: add logic to verify user/Token
    next();
}

const Auth = {
    verifyAPIUser
};

module.exports = Auth;
