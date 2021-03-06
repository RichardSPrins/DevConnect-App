const express = require('express')
const connectDB = require('./config/db')

const port = process.env.PORT || 5000
const app = express()

// Connect Database
connectDB()

// Init Middleware
app.use(express.json({extended: false}))

// Define Routes

app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))


app.get('/', (req, res) => res.send('API Running'))
app.listen(port, () => console.log(`Server started on port ${port}`)) 