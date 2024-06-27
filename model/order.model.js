const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    order_type: {
        type: String,
        enum: ['buy', 'sell']
    },
    order_status: {
        type: String,
        enum: ['pending', 'complete', 'cancelled', 'rejected'],
        default: 'pending'
    },
    created_by: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    commodity_type:{
        type:String,
        enum:['equity','f&o','mutual_funds','ipo','bonds'],
        default:'equity'
    },
    trade_type: {    //MIS,NRML
        type: String
    },
    order_placed_type_info: {    //Market,ilimit,sl,sl-m
        type: String
    },
    order_primary_type:{   //regular,co,amo,iceberg
        type:String
    },
    item: {
        type: mongoose.Schema.ObjectId,
        ref: "Stock"
    },
    quantity: {
        type: Number
    },
    placed_price: {
        type: Number
    },
    order_placed_at_price: {
        type: Number
    },
    trigger: {
        flag: Boolean,
        price: Number
    },
    tags: [
        {
            _id: false,
            type: String
        }
    ],
    created_At: {
        type: Date,
        deafult: Date.now()
    },
    executed_At: {
        type: Date,
        default: Date.now()
    },
    disc_quantity:{
        qty:Number,
        time:String
    },
    validity:{
        type:String
    },
    stop_loss_trigger:{
        type:Number
    },
    num_of_legs:{
        type:Number
    }


})


module.exports = mongoose.model('Order',OrderSchema);