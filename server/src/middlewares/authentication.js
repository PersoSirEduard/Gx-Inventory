"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = require("../helpers/email");
var avaiableKeys = [];
function purgeKeys() {
    var currentTime = new Date().getTime();
    if (!process.env.AUTH_VALID_TIME)
        throw new Error("AUTH_VALID_TIME is not set");
    for (var i = 0; i < avaiableKeys.length; i++) {
        if (currentTime - avaiableKeys[i].timestamp >= parseInt(process.env.AUTH_VALID_TIME)) {
            avaiableKeys.splice(i, 1);
        }
    }
}
function sendNewVerification() {
    purgeKeys();
    if (!process.env.AUTH_WAIT_TIME)
        throw new Error("AUTH_WAIT_TIME is not set");
    var currentTime = new Date().getTime();
    if (avaiableKeys.length > 0 && currentTime - avaiableKeys[avaiableKeys.length - 1].timestamp <= parseInt(process.env.AUTH_WAIT_TIME))
        throw new Error("Unable to generate a new key. Please try again later");
    var newKey = generateKey(15);
    if (!process.env.AUTH_VALID_TIME)
        throw new Error("AUTH_VALID_TIME is not set");
    if (!process.env.EMAIL_DESTINATION)
        throw new Error("EMAIL_DESTINATION is not set");
    try {
        (0, email_1.sendEmail)(process.env.EMAIL_DESTINATION, "Inventory Authentication", `The following key is valid for ${parseInt(process.env.AUTH_VALID_TIME) / 3600000.0} hours: ${newKey}`);
        avaiableKeys.push({
            key: newKey,
            timestamp: currentTime
        });
    }
    catch (err) {
        console.log(err);
        throw new Error("Error sending the email");
    }
}
function generateKey(length, numerical = false) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    if (numerical)
        characters = "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}
function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        2;
        if (!process.env.AUTH_VALID_TIME)
            return res.status(500).send("AUTH_VALID_TIME is not set");
        var key = req.header("Authorization");
        if (!key)
            return res.status(401).send("No authentication key was provided");
        var currentTime = new Date().getTime();
        var validKey = false;
        for (var i = 0; i < avaiableKeys.length; i++) {
            if (avaiableKeys[i].key === key && currentTime - avaiableKeys[i].timestamp < parseInt(process.env.AUTH_VALID_TIME)) {
                validKey = true;
                break;
            }
        }
        if (!validKey)
            return res.status(401).send("Invalid or expired authentication key");
        next();
    });
}
module.exports = { sendNewVerification, auth, generateKey };
//# sourceMappingURL=authentication.js.map