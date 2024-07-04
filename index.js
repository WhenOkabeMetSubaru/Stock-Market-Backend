const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const dotenv = require("dotenv").config();
const http = require('http');
const connectToMongo = require('./utils/db');
const Stock = require('./model/stock.model')

const { socketAuth, authenticateSocketUserHandshake } = require('./middlewares/socketAuth');


const { generateRandomStockData } = require('./utils/cronjobs')

// generateRandomStockData();

const app = express();
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

connectToMongo();
const PORT = process.env.PORT || 4100;

// const socketServer = http.createServer();
// const io = require('socket.io')(socketServer,
//     {
//         cors: "http://192.168.29.241:8081",

//     }
// );

// // io.use(authenticateSocketUserHandshake);

// io.on("connection", (socket) =>
// {

//     console.log('A client connected');


//     let stockUpdatesIntervalMultiple;
//     let stockUpdatesIntervalSingle;


//     socket.on('subscribeClientToSingleStock', async (stockInfo) =>
//     {

//         console.log("Client Subscribed to " + stockInfo);


//         async function sendStockUpdates ()
//         {
//             try
//             {

//                 let stockDetails = await Stock.findById({ _id: stockInfo });

//                 if (!stockDetails)
//                 {
//                     console.log("not found")
//                 } else
//                 {
//                     socket.emit(`${stockInfo}`, stockDetails.current_price);
//                 }


//             } catch (error)
//             {
//                 console.log(error)
//             }
//         }

//         sendStockUpdates();

//         stockUpdatesIntervalSingle = setInterval(sendStockUpdates, 60000);


//     })

//     socket.on('subscribeClientToMultipleStock', async (stocksInfo) =>
//     {

//         console.log("Client Subscribed to Multiple Stocks");


//         const sendStockUpdates = async () =>
//         {



           
//             let stockDetails = await Stock.find({ _id: { $in: stocksInfo } })
           

//             let stockUpdateData = stockDetails?.map((item) =>
//             {
//                 return {
//                     _id: item._id,
//                     current_price: item?.current_price
//                 }
//             })

//             socket.emit("multiplestockdata",stockUpdateData)





//         }

//         sendStockUpdates();

//         stockUpdatesIntervalMultiple = setInterval(sendStockUpdates, 30000);


//     })

//     socket.on('ping', () =>
//     {
//         console.log('Received ping from client:', socket.id);
//         socket.emit('pong'); // Send back a pong event to confirm connection
//     });

//     socket.on("disconnect", () =>
//     {
//         clearTimeout(stockUpdatesIntervalSingle);
//         clearTimeout(stockUpdatesIntervalMultiple);
//         console.log("client disconnected")
//     })

// })

// socketServer.listen(process.env.SOCKET_PORT, () =>
// {
//     console.log('Web socket started at port ' + process.env.SOCKET_PORT);
// })




const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const stockRoutes = require('./routes/stock.routes');
const orderRoutes = require('./routes/order.routes');
const holdingRoutes = require('./routes/holding.routes')

app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", stockRoutes);
app.use('/api',orderRoutes);
app.use('/api',holdingRoutes);


const server = http.createServer(app);

server.listen(PORT, () =>
{
    console.log("Server Running at http://localhost:" + PORT + "/");
})