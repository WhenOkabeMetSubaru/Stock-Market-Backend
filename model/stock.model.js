const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    stock_link:{
        type:String,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    open:{
        type:String
    },
    previous_close:{
        type:String
    },
    volume:{
        type:String
    },
    value:{
        type:String
    },
    vwap:{
        type:String
    },
    beta:{
        type:String
    },
    market_cap:{
        type:String
    },
    high:{
        type:String
    },
    low:{
        type:String
    },
    uc_limit:{
        type:String
    },
    lc_limit:{
        type:String
    },
    week_high_52:{
        type:String
    },
    week_low_52:{
        type:String
    },
    face_value:{
        type:String
    },
    all_time_high:{
        type:String
    },
    all_time_low:{
        type:String
    },
    avg_volume_20days:{
        type:String
    },
    avg_delivery_20days:{
        type:String
    },
    book_value_per_share:{
        type:String
    },
    dividend_yield:{
        type:String
    },
    ttm_eps:{
        type:String
    },
    ttm_pe:{
        type:String
    },
    pb:{
        type:String
    },
    sector_pe:{
        type:String
    }

})


module.exports = mongoose.model('Stock',StockSchema)