const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({

    quantity:{
        type:Number,
        required:true
    },
    item:{
        type:mongoose.Schema.ObjectId,
        ref:"Stock"
    },
    holding_sold_at_price_final:[
        {
            _id:false,
            quantity:Number,
            price:Number
        }
    ],

    total_amount: {
        type: Number,
    },

    average_price: {
        type: Number
    },
    is_sold:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:['bought','sold'],
        default:'bought'
    },
    created_by:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    created_At:{
        type:Date,
        default:Date.now()
    }

})

module.exports = mongoose.model('Holding',HoldingSchema);