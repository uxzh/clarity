const {OAuth2Client} = require("google-auth-library");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
        });
        return {payload: ticket.getPayload()};
    } catch (error) {
        console.error(`Error verifying Google token: ${error}`);
        return {error: "Invalid user detected. Please try again"};
    }
}

module.exports = verifyGoogleToken;
