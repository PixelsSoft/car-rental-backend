const express = require('express')
const PORT = 8001
const connectDb = require('./src/config/db.config')

//Endpoints:
const userRoutes = require('./src/routes/user.routes')
const registeredUsersRoutes = require('./src/routes/registered-users.routes')

const app = express()
connectDb()

app.use(express.json())

app.use(userRoutes)
app.use(registeredUsersRoutes)


app.listen(PORT, () => {
    console.log('Server started on port: ' + PORT)
})