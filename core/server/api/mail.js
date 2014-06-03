var when       = require("when"),
    config     = require('../config'),
    errors     = require('../errors'),
    mail;

// ## Mail
mail = {

    // #### Send
    // **takes:** a json object representing an email.
    send: function (postData) {
        var mailer = require('../mail');

        // **returns:** a promise from the mailer with the number of successfully sent emails
        return mailer.send(postData.mail[0].message)
            .then(function (data) {
                delete postData.mail[0].options;
                // Sendmail returns extra details we don't need and that don't convert to JSON
                delete postData.mail[0].message.transport;
                postData.mail[0].status = {
                    message: data.message
                };
                return postData;
            })
            .otherwise(function (error) {
                return when.reject(new errors.EmailError(error.message));
            });
    },
    // #### SendTest
    // **takes:** nothing
    sendTest: function () {
        var html = '<p><strong>Hello there!</strong></p>' +
            '<p>Excellent!' +
            ' You\'ve successfully setup your email config for your Ghost blog over on ' + config().url + '</p>' +
            '<p>If you hadn\'t, you wouldn\'t be reading this email, but you are, so it looks like all is well :)</p>' +
            '<p>xoxo</p>' +
            '<p>Team Ghost<br>' +
            '<a href="https://ghost.org">https://ghost.org</a></p>',

            payload = {mail: [{
                message: {
                    subject: 'Test Ghost Email',
                    html: html
                }
            }]};

        return mail.send(payload);
    }
};
module.exports = mail;