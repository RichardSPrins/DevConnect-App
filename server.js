const express = require('express')
const port = process.env.PORT || 5000
const app = express()


app.get('/', (req, res) => res.send('API Running'))
app.listen(port, () => console.log(`Server started on port ${port}`))