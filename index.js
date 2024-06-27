const express = require('express');
const helmet = require('helmet');
const cors  = require('cors');
const compression = require('cors');
const cookieParser  = require('cookie-parser');
const bodyParser = require('body-parser')
const dotenv = require("dotenv").config();
const http  = require('http');
const connectToMongo = require('./utils/db')

const app = express();
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

connectToMongo();
const PORT = process.env.PORT || 4100;



const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const stockRoutes = require('./routes/stock.routes');

app.use("/auth",authRoutes);
app.use("/api",userRoutes);
app.use("/api",stockRoutes);


const server  = http.createServer(app);

server.listen(PORT, () =>
{
    console.log("Server Running at http://localhost:" + PORT + "/");
})