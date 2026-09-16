// backend/utils/sendEmail.js

import sgMail from '@sendgrid/mail';

// Set the API key from your .env file
const apiKey = process.env.SENDGRID_API;

if (!apiKey) {
    console.error("SENDGRID_API_KEY is not set in the environment variables.");
} else {
    sgMail.setApiKey(apiKey);
}

const sendVerificationEmail = async (userEmail, verificationToken) => {
    // Ensure the API key was set before trying to send
    if (!apiKey) {
        console.error("Cannot send email: SendGrid API Key is missing.");
        // Optionally, throw an error to be handled by your async wrapper
        // throw new Error("Email service is not configured.");
        return; 
    }

    const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email/${verificationToken}`;

    const msg = {
        to: userEmail,
        // IMPORTANT: This 'from' email MUST be a verified sender in your SendGrid account.
        from: 'whyimade5@gmail.com', 
        subject: 'Verify Your Email for CampusHive',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                <h2>Welcome to CampusHive!</h2>
                <p>Thanks for signing up. Please verify your email address by clicking the button below.</p>
                <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px;">
                    Verify Email
                </a>
                <p style="margin-top: 20px;">If you did not sign up for this account, you can ignore this email.</p>
            </div>
        `
    };

    try {
        await sgMail.send(msg);
        console.log(`Verification email sent successfully to ${userEmail}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
};

export default sendVerificationEmail;