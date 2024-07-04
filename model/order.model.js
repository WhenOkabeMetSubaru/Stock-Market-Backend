const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    order_type: {
        type: String,
        enum: ['buy', 'sell']
    },
    order_status_in_holdings:{
        type:String,
        enum:['bought','sold'],
        default:'bought'
    },
    order_status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled', 'rejected'],
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
        type: String,
        enum:["mis","nrml"],
        default:"mis"
    },
    order_placed_type_info: {    //Market,ilimit,sl,sl-m
        type: String,
        enum:["market","limit","sl","sl-m"]
    },
    order_primary_type:{   //regular,co,amo,iceberg
        type:String,
        enum:["regular","co","amo","iceberg"]
    },
    item: {
        type: mongoose.Schema.ObjectId,
        ref: "Stock"
    },
    total_amount:{
        type:Number
    },
    quantity: {
        type: Number
    },
    order_placed_at_price_initial: {
        type: Number
    },
    order_placed_at_price_final: {
        type: Number
    },
    order_sold_at_price_initial: {
        type: Number
    },
    order_sold_at_price_final: {
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
        type:String,
        enum:['day','ioc','minutes']
    },
    stop_loss_trigger:{
        type:Number
    },
    num_of_legs:{
        type:Number
    }


})


module.exports = mongoose.model('Order',OrderSchema);