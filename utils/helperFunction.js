const User = require('../model/user.model');
const Stock = require('../model/stock.model');


/**
 * 
 * @param {string} userId 
 * @param {number} amount 
 * @returns {{boolean,string}}
 */
const deductAmountFromUserAccountEquity = async (userId,amount)=>{
    try {
        
        let userDetails = await User.findById({_id:userId});

        if(userDetails.equity_amount<amount){
            return {
                error:true,
                info:"Account Balance insufficient"
            }
        }

        let remainingAmount = parseFloat(userDetails?.equity_amount - amount).toFixed(2);
        let usedMargin = 0;
        if(userDetails?.equity_used_margin>0){
            usedMargin = parseFloat(userDetails.equity_used_margin + +amount).toFixed(2)
        }else{
            usedMargin = +amount;
        }

        let updatedUser = await User.findByIdAndUpdate({_id:userId},{
            $set:{
                equity_amount:remainingAmount,
                equity_used_margin:usedMargin
            }
        },{new:true})

        return {
            error:false,
            info:"Account updated",
            data:updatedUser
        }



    } catch (error) {
        return {
            error:true,
            info:error.message
        }
    }
}



/**
 * This function takes userId and amount and finally updates the user account info with calculated values.
 * @param {string} userId 
 * @param {number} amount 
 * @returns {{boolean,string}}
 */
const addAmountToUserEquity = async (userId, amount) =>
{
    try
    {

        let userDetails = await User.findById({ _id: userId });

        if (!userDetails)
        {
            return {
                error: true,
                info: "No user found"
            }
        }

        let updatedAmount = parseFloat(+userDetails?.equity_amount + +amount).toFixed(2);
        let usedMargin = parseFloat((userDetails?.equity_used_margin || 0) - amount).toFixed(2);

        console.log(updatedAmount,usedMargin)
        let updatedUser = await User.findByIdAndUpdate({ _id: userId }, {
            $set: {
                equity_amount: updatedAmount,
                equity_used_margin: usedMargin
            }
        }, { new: true })

        return {
            error: false,
            info: "Account updated",
            data: updatedUser
        }



    } catch (error)
    {
        return {
            error: true,
            info: error.message
        }
    }
}

/**
 * 
 * @param  {string} digit 
 * @returns {number}
 */
const handleCurrencyIndianToInteger=(digit) =>{

    let formattedNumber = parseFloat(digit?.toString().replace(/,/g, ''));


    return formattedNumber.toFixed(2);

}

module.exports = {
    handleCurrencyIndianToInteger,
    deductAmountFromUserAccountEquity,
    addAmountToUserEquity
}