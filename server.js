const express = require('express')
const app = express()

// to use Environment variables 
const dotenv = require('dotenv')
dotenv.config()

// connect to DB 
require('./db/conn')

const PORT = process.env.PORT || 4000
const httpServer = require('http').createServer(app);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: '50mb', parameterLimit: 500000, extended: true }));
app.use(bodyParser.json());

const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const admin = require('./admin/adminRoutes')
app.use('/admin', admin);

app.get('/', (req, res) => {
    res.send("welcome to Lecture Scheduling Server")
})