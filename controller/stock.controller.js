
const Stock = require('../model/stock.model')
const WatchList  = require('../model/watchlist.model');
const stockList = require('../nifty500finalitems.json')

const getStockByID = async (req, res, next) =>
{
    try
    {
        const stockDetails = await Stock.findById({ _id:req.params.stockId });
       

        if (!stockDetails)
        {
            return res.status(404).json({
                error: true,
                info: 'Stock not found',
            });
        }

      
        return res.status(200).json({
            error:false,
            info:"Stock Found",
            data:stockDetails
        })

       
    } catch (error)
    {
        return res.status(400).json({
            error: true,
            info: 'Could not fetch stock information for some unknown reason',
        });
    }
};

const addNewStock = async (req, res) =>
{
    try
    {
        // const newStock = new Stock(req.body);
        // const savedStock = await newStock.save();

       
    
        for(let i = 0;i<stockList?.length;i++){
          
           if(typeof stockList[i]=="object"){
           
            let keyLength  = Object.keys(stockList[i]);
            
            if(keyLength.length>0){
                
                let result = await Stock.create(stockList[i]);
              
            }
           }
        }   

        let stockDetails = await Stock.find({})

        return res.status(201).json({
            error: false,
            info: 'Stock created successfully',
            data:stockDetails ,
        });
    } catch (error)
    {
        console.log(error)
        return res.status(400).json({
            error: true,
            info: 'Could not create stock for some unknown reason',
        });
    }
};

const getSearchStockByName = async (req, res) =>
{
    try
    {
      
        const { name } = req.query; // Access search term from query parameter

        const stockDetails = await Stock.find({ name: { $regex: new RegExp(name, 'i') } }); // Case-insensitive search

        if (!stockDetails?.length > 0)
        {
            return res.status(400).json({
                error: true,
                info: 'Stocks not found for search term',
                data: [],
            });
        }

        return res.status(200).json({
            error: false,
            info: 'Stocks Found',
            data: stockDetails,
        });
    } catch (error)
    {
        console.log(error)
        return res.status(400).json({
            error: true,
            info: 'Could not fetch stock information for some unknown reason hello',
        });
    }
};

const getAllStocks = async (req, res) =>
{
    try
    {
        const stockDetails = await Stock.find({});

        if (!stockDetails?.length > 0)
        {
            return res.status(400).json({
                error: true,
                info: 'Stocks Not Found',
                data: [],
            });
        }

        return res.status(200).json({
            error: false,
            info: 'Stocks Found',
            data: stockDetails,
        });
    } catch (error)
    {
        console.log(error)
        return res.status(400).json({
            error: true,
            info: 'Could not fetch stock information for some unknown reason',
        });
    }
};

const updateStockByID = async (req, res) =>
{
    try
    {
        const updatedStock = await Stock.findByIdAndUpdate({ _id: req.params.stockId }, req.body, { new: true });

        if (!updatedStock)
        {
            return res.status(404).json({
                error: true,
                info: 'Stock not found',
            });
        }

        return res.status(200).json({
            error: false,
            info: 'Stock updated',
            data: updatedStock._doc,
        });
    } catch (error)
    {
        return res.status(400).json({
            error: true,
            info: 'Could not update stock information for some unknown reason',
        });
    }
};

const deleteStockByID = async (req, res) =>
{
    try
    {
        const deletedStock = await Stock.findByIdAndDelete({ _id: req.params.stockId });

        if (!deletedStock)
        {
            return res.status(404).json({
                error: true,
                info: 'Stock not found',
            });
        }

        return res.status(200).json({
            error: false,
            info: 'Stock deleted successfully',
        });
    } catch (error)
    {
        return res.status(400).json({
            error: true,
            info: 'Could not delete stock for some unknown reason',
        });
    }
};

const getAllStocksByWatchList = async(req,res)=>{
    try {
     
        
        let watchlistDetails = await WatchList.findById({_id:req.params.watchId}).populate('stocks');

        return res.status(200).json({
            error:false,
            info:"Success",
            data:watchlistDetails
        })

    } catch (error) {
        return res.status(500).json({
            error:true,
            info:error.message
        })
    }
}


module.exports = {
addNewStock,
updateStockByID,
deleteStockByID,
getStockByID,
getAllStocks,
getSearchStockByName,
getAllStocksByWatchList
}