import nodemailer from 'nodemailer';

/**
 * Send an email to the specified email address.
 * @param email : string - The email address to send the email to
 * @param subject : string - The subject of the email
 * @param message : string - The message to send in the email
 */
export async function sendEmail(email: string, subject: string, message: string) {

    return new Promise((resolve, reject) => {

        // Create the transporter to connect to the SMTP server (Outlook)
        const transporter = nodemailer.createTransport({
            service: 'Outlook365',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Data to send in the email
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: message
        };

        // Send the email
        transporter.sendMail(mailOptions, (err : any, info : any) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(info);
            }
            
        });

    });
    


}