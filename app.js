const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Port
const port = process.env.PORT || 5000;

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
const google = require('./routes/api/google');

//Use Routes
app.use('/api/google', google);


app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})