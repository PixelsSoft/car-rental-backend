const sendgrid = require('@sendgrid/mail')
const fs = require('fs')
const handlebars = require('handlebars')
const path = require('path')

const sendgridApiKey = process.env.SENDGRIDKEY
sendgrid.setApiKey(sendgridApiKey)

handlebars.registerHelper('multiply', function (a, b) {
  return a * b
})

const sendEmail = (emailDetails) => {
  console.log('send email')
  const invoiceTemplate = fs.readFileSync(
    path.join(__dirname, 'invoice.hbs'),
    'utf-8'
  )
  const compiledInvoiceTemplate = handlebars.compile(invoiceTemplate)

  const {
    invoiceNumber,
    customerName,
    customerEmail,
    items,
    total,
    dueDate,
    invoiceDate,
    notes,
  } = emailDetails

  console.log(items[0])

  const mesg = {
    to: customerEmail,
    from: 'msaadullah04@gmail.com',
    subject: `Xpress Car Rental - INVOICE # ${invoiceNumber}`,
    html: compiledInvoiceTemplate({
      invoiceNumber,
      customerName,
      invoiceDate,
      dueDate,
      items,
      total,
      notes,
    }),
  }

  console.log('sending email')
  sendgrid
    .send(mesg)
    .then((res) => {
      console.log('Email sent\n', res)
    })
    .catch((err) => {
      console.error(err)
    })
}

module.exports = sendEmail
