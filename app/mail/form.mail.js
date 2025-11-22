const nodemailer = require("nodemailer");
const Handlebars = require("handlebars");
const Token = require("../class/token.class");

module.exports = class Mail {
  static async sendMail(req, res) {
    let transporter = nodemailer.createTransport({
      sendmail: true,
      newline: "unix",
      path: "/usr/sbin/sendmail",
    });

    // 2. Compiler le template
    const template = Handlebars.compile(templateSource);

    // 3. Générer le HTML final avec variables
    const html = template({
      prenom: req.body.prenom,
      confirmUrl: `https://clashofleagues.fr/confirm/${Token.generateToken({id: req.body.email})}`,
    });

    // 4. Préparer l’email
    const mailOptions = {
      from: '"Clash of Leagues" <no-reply@clashofleagues.fr>',
      to: req.body.email,
      subject: "Bienvenue sur Clash of Leagues !",
      html : "<!DOCTYPE html><html><body><h1>Bienvenue {{prenom}} !</h1> <p>Merci pour votre inscription sur Clash of Leagues.</p> <p>Pour confirmer votre compte, cliquez ici :<br><a href=\"{{confirmUrl}}\">Confirmer mon compte</a></p> <p>À bientôt,<br>L'équipe Clash of Leagues</p> </body></html>"
,
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
