const cron = require('node-cron');
const Stock = require('../model/stock.model')
const { generateStockData } = require('./stockExtraFunctions');



const generateRandomStockData = async ()=>{
    cron.schedule('*/10 * * * * *',async ()=>{
       let stocks = await Stock.find({});

       stocks?.forEach((stockItem)=>{
        generateStockData(stockItem)
       })
    

    })
}


module.exports = {
    generateRandomStockData
}