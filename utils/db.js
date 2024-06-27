const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI

const connectToMongo = () =>
{
    mongoose.connect(process.env.MONGO_URI).then(() =>
    {
        console.log('connected to Mongo')
    })
}

module.exports = connectToMongo;