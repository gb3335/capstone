const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path')
const app = express();

// Port
const port = process.env.PORT || 5000;

// Routes
const google = require('./routes/api/google');
const users = require('./routes/api/users')

//DB Config
const db = require('./config/keys').mongoURI;

//connect to mongoDB
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))


// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport.js')(passport);

//Use Routes
app.use('/api/google', google);
app.use('/api/users', users);

// Server static assests if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });

}

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})