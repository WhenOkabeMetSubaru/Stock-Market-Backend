const Stock = require('../model/stock.model');

const generateStockData = async (stock)=>{

    let stockDetails = await Stock.findById({_id:stock?._id});

    if(!stockDetails){
        throw new Error("Stock not found")
    }
  
    let currentPrice = stockDetails.current_price;

    let replacedPrice = parseFloat(currentPrice?.replace(/₹|,/g, ''));



    const percentageChanges = [-0.003, -0.0025, -0.002, -0.001, 0.001, 0.002, 0.0025, 0.003];

    
    let getRandom = parseFloat(percentageChanges[Math.floor(Math.random() * percentageChanges.length)]);

    let changedValue = parseFloat((replacedPrice * getRandom).toFixed(2));

    // console.log(replacedPrice,"->",getRandom,'->',changedValue,"->",(replacedPrice + changedValue),"->",handleConvertNumberToIndianSystem(replacedPrice+changedValue).substring(1))

    let finalValue = handleConvertNumberToIndianSystem(replacedPrice + changedValue)?.substring(1);
   

    

    try {
       
        let updateStock = await Stock.updateOne({_id:stock._id},{
            current_price:finalValue
        })

        
    } catch (error) {
        console.log(error)
    }
  

}


const handleConvertNumberToIndianSystem =(digit)=>
{

    const formatter = Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    });

    let result = formatter.format(digit);

    return result?.toString();



}

module.exports = {
    generateStockData
}