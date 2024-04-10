const express = require('express')
const cors = require('cors')
const connectToMongo = require('./config/mongo')
const blogRoutes = require('./routes/blogRoutes')
const userRoutes = require('./routes/userRoutes')
const loginRoutes = require('./routes/loginRoutes')
const middleware = require('./utils/middleware')
require('dotenv').config()

const app = express()

connectToMongo()

app.use(cors())
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/blogs', middleware.tokenExtractor, blogRoutes)
app.use('/api/login', loginRoutes)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app