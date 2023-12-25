const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const userRoutes = require("./src/Routes/userRoutes")
const port = process.env.PORT || 3000;


// -----------------Middleware--------------//
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// -----------------Middleware--------------//
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// ----------------------------ROUTES----------------------//
app.use('/api/users', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
