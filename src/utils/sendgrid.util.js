const sendgrid = require('@sendgrid/mail')
const fs = require('fs')
const handlebars = require('handlebars')
const path = require('path')

const sendgridApiKey = process.env.SENDGRIDKEY

sendgrid.setApiKey(sendgridApiKey)

const sendEmail = (emailDetails) => {
    const invoiceTemplate = fs.readFileSync(path.join(__dirname, 'invoice.hbs'), 'utf-8')
    const compiledInvoiceTemplate = handlebars.compile(invoiceTemplate)

    const {invoiceNumber, customerName, customerEmail, items, total, dueDate, invoiceDate} = emailDetails
    const mesg = {
        to: customerEmail,
        from: 'msaadullah04@gmail.com',
        subject: `Xpress Car Rental - INVOICE # ${invoiceNumber}`,
        html: compiledInvoiceTemplate({
            invoiceNumber,
            customerName,
            items,
            total
        })
    }
    
    console.log('sending email')
    sendgrid.send(mesg)
    .then((res) => {
        console.log('Email sent\n', res)
    })
    .catch(err => {
        console.error(err)
    })
}


module.exports = sendEmail
