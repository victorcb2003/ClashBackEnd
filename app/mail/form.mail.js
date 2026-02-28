const nodemailer = require("nodemailer");
const Handlebars = require("handlebars");
const Token = require("../class/token.class");

module.exports = class Mail {
  static async sendMail(req, res, mailOptions) {
    let transporter = nodemailer.createTransport({
      sendmail: true,
      newline: "unix",
      path: "/usr/sbin/sendmail",
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({ message: error.message });
      }
      return res
        .status(200)
        .send({ message: "L'email a bien été envoyé. " + info.messageId });
    });
  }

  static async sendResetPassword(req, res,user) {
    const templateSource = `
      <!DOCTYPE html>
<html>
  <body>
    <h1>Bonjour {{prenom}} {{nom}} !</h1>

    <p>Ce lien est valide pendant 30 minutes.</p>

    <p>
      Pour réinitialiser votre mot de passe, cliquez ici :

      <a href="{{confirmUrl}}" title="">Réinitialisation du mot de passe</a>
    </p>

    <p>À bientôt,<br>L'équipe Clash of Leagues</p>
  </body>
</html>
    `;

    const template = Handlebars.compile(templateSource);

    const html = template({
      prenom: user.prenom,
      nom: user.nom,
      confirmUrl: `https://clashofleagues.fr/resetPassword?token=${Token.generateToken({ id: user.id }, "30m")}`,
    });

    const mailOptions = {
      from: '"Clash of Leagues" <no-reply@clashofleagues.fr>',
      to: req.body.email,
      subject: "Clash of Leagues - Réinitialisation du mot de passe",
      html,
    };

    Mail.sendMail(req, res, mailOptions);
  }

  static async sendConfirmationEmail(req, res) {
    const templateSource = `
      <!DOCTYPE html>
<html>
  <body>
    <h1>Bienvenue {{prenom}} !</h1>

    <p>Merci pour votre inscription sur Clash of Leagues.</p>

    <p>
      Pour confirmer votre compte, cliquez ici :

      <a href="{{confirmUrl}}" title="">Confirmer mon compte</a>
    </p>

    <p>À bientôt,<br>L'équipe Clash of Leagues</p>
  </body>
</html>
    `;

    const template = Handlebars.compile(templateSource);

    const html = template({
      prenom: req.body.prenom,
      confirmUrl: `https://clashofleagues.fr/confirmation?token=${Token.generateToken({ email: req.body.email, prenom: req.body.prenom, nom: req.body.nom, type: req.body.type }, "30m")}`,
    });

    const mailOptions = {
      from: '"Clash of Leagues" <no-reply@clashofleagues.fr>',
      to: req.body.email,
      subject: "Bienvenue sur Clash of Leagues !",
      html,
    };
    Mail.sendMail(req, res, mailOptions);
  }
};
