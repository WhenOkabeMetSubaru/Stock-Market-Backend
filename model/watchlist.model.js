const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
    title:{
        type:String
    },
    stocks:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Stock"
        }
    ],
    stocks_count:Number,
    created_by:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
})

module.exports = mongoose.model("Watchlist",WatchlistSchema);