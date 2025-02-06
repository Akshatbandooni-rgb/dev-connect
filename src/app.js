const express = require('express');
const connectDB = require('./config/database')

const app = express();
const PORT = process.env.PORT || 3000;



app.get('/', (req, res) => {
    res.send('Hello from server')
})

connectDB().then((res) => {
    console.log('Database connection Established !!❤️❤️')
    // Start the server and listen on the specified port
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.log('Database connection failed !! 💔💔')
})
