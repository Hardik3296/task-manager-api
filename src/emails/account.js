const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "hardikgaur3296@gmail.com",
    subject: "Congratulations on joining!",
    text: `Welcome ${name}. Let us know what you expect from this app`,
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "hardikgaur3296@gmail.com",
    subject: "Sorry to see you go!",
    text: `Goodbye ${name}. Wonder what we could have done to keep you!`,
  });
};

module.exports = { sendWelcomeEmail, sendCancellationEmail };
