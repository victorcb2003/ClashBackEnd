const nodemailer = require("nodemailer");
const fs = require("fs").promises;
const Handlebars = require("handlebars");
const Token = require("./token.class.js");

module.exports = class Mail {
  static async sendMail(req, res) {
    let transporter = nodemailer.createTransport({
      sendmail: true,
      newline: "unix",
      path: "/usr/sbin/sendmail",
    });

    // 1. Lire le template
    const templateSource = await fs.readFile("./emails/welcome.hbs", "utf8");

    // 2. Compiler le template
    const template = Handlebars.compile(templateSource);

    // 3. Générer le HTML final avec variables
    const html = template({
      prenom: req.body.prenom,
      confirmUrl: `https://clashofleagues.fr/confirm/${Token.generateToken({id: body.req.email})}`,
    });

    // 4. Préparer l’email
    const mailOptions = {
      from: '"Clash of Leagues" <no-reply@clashofleagues.fr>',
      to: req.body.email,
      subject: "Bienvenue sur Clash of Leagues !",
      html,
    };

    // Envoi du mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(400).send({message : error.message});
      }
      return res.status(200).send({message : "L'email a bien été envoyé. "+info.messageId})
    });
  }
};
