const express = require('express')
const config = require('config')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

app.use(cors({ origin: 'http://localhost:3000' }))

app.use(express.json())

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUrl'), { useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => console.log('Connected to MongoDB'))
            .catch((err) => console.log(`DB connection error: ${err}`))
        
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
    } catch (e) {
        console.log('Server error:', e.message)
        process.exit(1)
    }
}

start()

