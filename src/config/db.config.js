const mongoose = require('mongoose')

const connectionString = process.env.MONGO_CONNECTION_STRING

const connectDb = async () => {
    try {
        let connection = await mongoose.connect(connectionString, { dbName: process.env.DB_NAME })
        if (connection) {
            console.log('DB connected')
        } else {
            console.log('Unable to connect')
        }
    } catch (err) {
        console.log(err)
    }
}


module.exports = connectDb