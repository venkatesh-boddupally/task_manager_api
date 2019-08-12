const sgMail = require('@sendgrid/mail')

const sgMailKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sgMailKey)


const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.FROM_EMAIL,
        subject: 'Thanks for joining Task App',
        text: `Welcome to the app ${name}`
    })
}

const sendCancelMail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.FROM_EMAIL,
        subject: 'Good Bye',
        text: `Good bye ${name}`
    })
}

module.exports = {
    sendWelcomeMail,
    sendCancelMail
}
