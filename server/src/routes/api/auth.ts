import { Inventory } from "../../helpers/types";
import { Response, Request } from "express";

const { sendNewVerification } = require('../../middlewares/authentication.js');

module.exports = (inv: Inventory) => {

    // Upon request, send a new verification email that contains a login code
    // By default, the email is sent to the user's email address
    // and the code is valid for 2 hours (with a maximum of 1 request per 15 minutes)
    inv.app.get('/api/auth/new', async (_: Request, res: Response) => {

        try {
            sendNewVerification();
            return res.status(200).send('Verification email sent.');
        } catch (err) {
            return res.status(500).send(String(err));
        }

    });
}