const mongoose = require('mongoose');
const crypto = require('crypto');
const UserSchema = new mongoose.Schema({

    firstName: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    lastName:{
        type:String,
        trim:true
    },

    username:{
        type:String,
        trim:true
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    mobile: {
        type: String,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },

    updated: Date,
    hashed_password: {
        type: String,
        required: "password is easy"
    },
    salt: String,
    
    profile_status:{
        type:String,
        enum:['pending','verified','rejected','banned'],
        default:'verified'
    },
    equity_amount:{
        type:Number,
        default:100000
    },
    equity_used_margin:{
        type:Number,
        default:0
    },
    equity_opening_balance:{
        type:Number
    },
    equity_pay_in:Number,
    equity_pay_out:Number,
    equity_span:Number,
    equity_delivery_margin:Number,
    equity_exposure:Number,
    equity_option_premium:Number,
    equity_collateral_liquid:Number,
    equity_collateral_equity:Number,
    commodity_amount: {
        type: Number,
        default: 100000
    },
    commodity_used_margin: {
        type: Number,
        default: 0
    },
    commodity_opening_balance: {
        type: Number
    },
    commodity_pay_in: Number,
    commodity_pay_out: Number,
    commodity_span: Number,
    commodity_delivery_margin: Number,
    commodity_exposure: Number,
    commodity_option_premium: Number,

})

UserSchema
    .virtual('password')
    .set(function (password)
    {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function ()
    {
        return this._password
    })

UserSchema.methods = {
    authenticate: function (plainText)
    {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function (password)
    {
        if (!password) return '';
        try
        {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err)
        {
            return ''
        }
    },
    makeSalt: function ()
    {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}

UserSchema.path('hashed_password').validate(function (v)
{
    if (this._password && this._password.length < 6)
    {
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password)
    {
        this.invalidate('password', 'Password is required')
    }
}, null)


module.exports = mongoose.model('User', UserSchema)