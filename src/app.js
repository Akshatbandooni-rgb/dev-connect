const express = require('express');
const cookieParser = require("cookie-parser");
const connectDB = require('./config/database')
const authRouter = require('./routes/authRouter');
const profileRouter = require('./routes/profileRouter');
const connectionrequestRouter = require('./routes/connectionRequestRouter');
const userRouter = require('./routes/userRouter');

const app = express();
const PORT = process.env.PORT || 3000;

// This enables parsing of JSON data in the request body
app.use(express.json());
app.use(cookieParser());
app.use('/', authRouter); // Routes related to authentication
app.use('/profile', profileRouter); // Routes related to user profiles
app.use('/request', connectionrequestRouter); // Routes related to connection requests
app.use('/user', userRouter); // Routes related to user management


connectDB().then((res) => {
    console.log('Database connection Established !!❤️❤️')
    // Start the server and listen on the specified port
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.log('Database connection failed !! 💔💔')
})
