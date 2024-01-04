const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require("morgan");
const helmet = require('helmet');
const app = express();
const userRoutes = require("./src/Routes/userRoutes")
const travelRoutes = require("./src/Routes/travelRoutes")
const pool = require("./Config/dbConnect")

// database connection'
async function queryExample() {
    try {
        const result = await pool.query('SELECT $1::text as message', ['Hello, PostgreSQL!']);
        console.log(result.rows[0].message);
    } catch (error) {
        console.error('Error executing query:', error);
    }
}
queryExample();

// congiguation env
dotenv.config()


// -----------------Middleware--------------//
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(express.json())
app.use(morgan('dev'))


// ----------------------------ROUTES----------------------//
app.use('/api/v1/auth', userRoutes);
app.use("/api/v1/travel", travelRoutes)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`server is running mode is ${process.env.DEV_MODE} and port running is on ${PORT}`);

});
