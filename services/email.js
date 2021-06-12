const Mailgen = require("mailgen");
const config = require("../config/config");

class EmailService {
  constructor(env, sender) {
    this.sender = sender;

    switch (env) {
      case "development":
        this.link = config.link.localhost;
        break;
      case "production":
        this.link = config.link.production;
        break;
      default:
        this.link = config.link.localhost;
        break;
    }
  }

  #createTemplateVerifyEmail(verificationToken) {
    const mailGenerator = new Mailgen({
      theme: "cerberus",
      product: {
        name: "System Contacts",
        link: this.link,
      },
    });

    const email = {
      body: {
        intro:
          "Welcome to System Contacts! We're very excited to have you on board.",
        action: {
          instructions:
            "To get started with System Contacts, please click here:",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${verificationToken}`,
          },
        },
      },
    };

    // Generate an HTML email with the provided contents
    return mailGenerator.generate(email);
  }

  async sendVerifyEmail(verificationToken, email) {
    const emailBody = this.#createTemplateVerifyEmail(verificationToken);

    const result = await this.sender.send({
      to: email,
      subject: "Verify your account",
      html: emailBody,
    });

    return result;
  }
}

module.exports = EmailService;
