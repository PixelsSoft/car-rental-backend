const mongoose = require('mongoose')
const RecurringInvoice = require('../models/recurring-invoice.model')

const getCurrentDate = () => Date.now()

const connectionString = process.env.MONGO_CONNECTION_STRING
const calculateRecurringDates = async () => {
    try {
        let connection = await mongoose.connect(connectionString, {dbName: process.env.DB_NAME})
        if (connection) {
            console.log('DB connected')
        } else {
            console.log('Unable to connect')
        }

        setInterval(async () => {
            const invoices = await RecurringInvoice.find({status: 'active'})

            invoices.forEach(async invoice => {
                let invoice_date_milliseconds = Date.parse(invoice._createdAt)
                let next_date_milliseconds = Date.parse(invoice.nextInvoice)

                let difference = getCurrentDate() - invoice_date_milliseconds

                let remaining_time = next_date_milliseconds - difference

                if (remaining_time <= 0) {
                    const millisecondsPerDay = 24 * 60 * 60 * 1000;
                    let recurring_date = parseInt(invoice.schedule.split(' ')[1])
                    const future_date = getCurrentDate() + (recurring_date * millisecondsPerDay)

                    invoice.nextInvoice = future_date
                    await invoice.save()
                }
            })

        }, 24 * 60 * 60 * 100)
    } catch (err) {
        console.log(err)
    }
}

calculateRecurringDates()