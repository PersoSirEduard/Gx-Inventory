import { sendEmail } from "../helpers/email";
import { AuthKey } from "../helpers/types";
import { Response, Request, NextFunction } from "express";

// Contains all the available keys at the moment
var avaiableKeys : Array<AuthKey> = [];

/**
 * Purge expired keys. This function is called every time a new key generation is sent.
 */
function purgeKeys() {

    // Get current time
    const currentTime = new Date().getTime();

    // Loop through each key and remove it if its expired
    for (var i = 0; i < avaiableKeys.length; i++) {

        // Compare the current time to the key's timestamp
        if (currentTime - avaiableKeys[i].timestamp >= parseInt(process.env.AUTH_VALID_TIME!)) {
            avaiableKeys.splice(i, 1); // Remove key
        }

    }
}

/**
 * Generate a new authentication key. This key is valid for the amount of time specified in the environment variable AUTH_VALID_TIME.
 * After the key is generated, it is sent to the user's email address.
 */
function sendNewVerification() {

    // Purge expired keys
    purgeKeys();

    // Get current time
    const currentTime = new Date().getTime();

    // Check to see if a new key can be generated at this time
    // This is done by checking if the last key generated was less than 15 minutes ago
    // If it was, then the key cannot be generated (with a maximum of 1 request per 15 minutes)
    if (avaiableKeys.length > 0 && currentTime - avaiableKeys[avaiableKeys.length - 1].timestamp <= parseInt(process.env.AUTH_WAIT_TIME!)) throw new Error("Unable to generate a new key. Please try again later");

    // Generate a new key of 15 characters
    const newKey = generateKey(15);

    try {
        // Send the email with the key
        sendEmail(process.env.EMAIL_DESTINATION!, "Inventory Authentication", `The following key is valid for ${parseInt(process.env.AUTH_VALID_TIME!) / 3600000.0} hours: ${newKey}`);

        // Add the key to the list of available keys
        avaiableKeys.push({
            key: newKey,
            timestamp: currentTime
        });

    } catch (err) {

        // If an error occurs, throw it
        console.log("Error sending the authentication email.");
        throw new Error("Error sending the authentication email. Please try again later.");
    }

}

/**
 * Generate a random string of a specified length.
 * @param length : number - The length of the key to generate
 * @param numerical : boolean - Whether or not to only include numbers (defaults to false)
 * @returns string - The generated key
 */
function generateKey(length: number, numerical : boolean = false) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    if (numerical) characters = "0123456789"
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

/**
 * Authentication middleware. This middleware is used to check if the user is authenticated.
 * @param req - Request : The request object
 * @param res - Response : The response object
 * @param next - NextFunction : The next function to call in the middleware chain
 */
async function auth(req: Request, res: Response, next: NextFunction) {
    
    // Get the key from the request's header
    const key = req.header("Authorization");
    if (!key) return res.status(401).send({ message: "No authentication key was provided" });
    
    // Check to see if the key is valid
    const currentTime = new Date().getTime();
    var validKey = false;

    // Loop through each key and check if it matches the key provided
    for (var i = 0; i < avaiableKeys.length; i++) {
        if (avaiableKeys[i].key === key && currentTime - avaiableKeys[i].timestamp < parseInt(process.env.AUTH_VALID_TIME!)) {
            validKey = true;
            break;
        }
    }
    
    // Check to see if the key is valid
    if (!validKey) return res.status(401).send({ message: "Invalid or expired authentication key" });

    // Continue to the next middleware if the key is valid
    next();

}

module.exports = { sendNewVerification, auth, generateKey }