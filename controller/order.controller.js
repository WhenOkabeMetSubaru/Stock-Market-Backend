const Order = require('../model/order.model'); // Update path if needed
const Stock = require('../model/stock.model');
const Holding = require('../model/holding.model')
const mongoose = require('mongoose')


const ObjectId = mongoose.Types.ObjectId

const { deductAmountFromUserAccountEquity, handleCurrencyIndianToInteger, addAmountToUserEquity } = require('../utils/helperFunction');
// **Helper function to retrieve orders by user ID**
const getAllOrdersByUser = async (req, res) =>
{
    try
    {
        const orders = await Order.find({ created_by: req.params.userId }); // Adjust field name if needed
        return res.json({
            error: false,
            info: "Success",
            data: orders
        });
    } catch (error)
    {
        return res.status(500).json({
            error: true,
            info: error.message
        })
    }
};

const getAllHoldingOrdersByUser = async (req, res) =>
{
    try
    {
        const orders = await Order.find({ created_by: req.params.userId, }); // Adjust field name if needed
        return res.json({
            error: false,
            info: "Success",
            data: orders
        });
    } catch (error)
    {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
};

const getAllPositionOrdersByUser = async (req, res) =>
{
    try
    {

        let currentDate = new Date();
        let one_day_frame = new Date(currentDate - 24 * 60 * 60 * 1000);


        // const orders = await Order.aggregate([
        //     {
        //         $match:{
        //             'created_by':req.user._id,
        //             'executed_At':{
        //                 $gte:one_day_frame
        //             }
        //         }
        //     },
        //     {
        //         $lookup:{
        //             from:"stocks",
        //             localField:"item",
        //             foreignField:"_id",
        //             as:"item",
        //             pipeline:[
        //                 {
        //                     $project:{
        //                         "_id":1,
        //                         "name":1,
        //                         "current_price":1

        //                     }
        //                 }
        //             ]

        //         }
        //     },
        //     {
        //         $unwind:"$item"
        //     }
        // ]) 

        const orders = await Order.aggregate([
            {
                $match: {

                    'executed_At': {
                        $gte: one_day_frame
                    },
                    'order_status': "completed"
                }
            },
            {
                $group: {
                    "_id": "$item",
                    "quantity": {
                        $sum: "$quantity"
                    },
                    "average": {
                        $avg: {
                            $cond: {
                                if: { $eq: ["$quantity", 0] },
                                then: 0,
                                else: { $divide: ["$total_amount", "$quantity"] }
                            }
                        }
                    },



                }
            },
            {
                $lookup: {
                    from: "stocks",
                    localField: "_id",
                    foreignField: "_id",
                    as: 'item'
                }
            },
            {
                $unwind: "$item"
            }
        ])




        return res.json({
            error: false,
            info: "Success",
            data: orders
        })
    } catch (error)
    {
        console.log(error)
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
};

const getAllPendingOrdersByUser = async (req, res) =>
{
    try
    {

        let currentDate = new Date();
        let one_day_frame = new Date(currentDate - 24 * 60 * 60 * 1000);


        const orders = await Order.aggregate([
            {
                $match: {

                    'order_status': "pending",
                    "created_by":req.user._id
                }
            },
            {
                $lookup: {
                    from: "stocks",
                    localField: "item",
                    foreignField: "_id",
                    as: 'item'
                }
            },
            {
                $unwind: "$item"
            }
        ])




        return res.json({
            error: false,
            info: "Success",
            data: orders
        })
    } catch (error)
    {
        console.log(error)
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
};

const getAllExecutedOrdersByUser = async (req, res) =>
{
    try
    {

        let currentDate = new Date();
        let one_day_frame = new Date(currentDate - 24 * 60 * 60 * 1000);


        const orders = await Order.aggregate([
            {
                $match: {

                    'order_status': {
                        $in:["completed","cancelled","rejected"]
                    },
                    "created_by": req.user._id
                }
            },
            {
                $lookup: {
                    from: "stocks",
                    localField: "item",
                    foreignField: "_id",
                    as: 'item'
                }
            },
            {
                $unwind: "$item"
            },
            {
                $sort:{
                    'executed_At':-1
                }
            }
        ])


        

        return res.json({
            error: false,
            info: "Success",
            data: orders
        })
    } catch (error)
    {
        console.log(error)
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
};



const getOrderByID = async (req, res, next, id) =>
{
    try
    {
        const orderDetails = await Order.findById({ _id: id });

        if (!orderDetails)
        {
            return res.status(404).json({
                error: true,
                message: 'Order not found',
            });
        }

        req.order = orderDetails;
        return res.json({
            error: false,
            info: "Succes",
            data: orderDetails
        })
    } catch (error)
    {
        return res.status(400).json({
            error: true,
            message: 'Could not fetch order information for some unknown reason',
        });
    }
};

const placeBuyOrder = async (req, res) =>
{
    let session = await mongoose.startSession();
    try
    {
        session.startTransaction();

        
        let orderDetails = req.body;
        let user = req.user;
        let equity_amount = user.equity_amount;
        let commodity_amount = user.commodity_amount;


        let finalOrderObj = {};

        if (orderDetails.commodity_type == "equity")
        {

            switch (orderDetails?.order_placed_type_info)
            {

                case 'market': {

                    let stockDetails = await Stock.findById({ _id: orderDetails.item });

                    let totalOrderValue = parseFloat(handleCurrencyIndianToInteger(stockDetails.current_price) * orderDetails?.quantity).toFixed(2);

                    if (totalOrderValue <= equity_amount)
                    {

                        let accountUpdate = await deductAmountFromUserAccountEquity(user._id, totalOrderValue);

                        if (accountUpdate.error == true)
                        {
                            return res.status(400).json(accountUpdate)
                        }



                        finalOrderObj = {
                            ...orderDetails,
                            ...finalOrderObj,
                            placed_price: stockDetails.current_price,
                            order_placed_at_price_initial: handleCurrencyIndianToInteger(orderDetails.order_placed_at_price_initial),
                            order_placed_at_price_final: handleCurrencyIndianToInteger(stockDetails.current_price),
                            executed_At: new Date(),
                            order_status: 'completed',
                            order_type: 'buy',
                            order_status_in_holdings: 'bought',
                            created_by: req.user._id,
                            total_amount: totalOrderValue




                        }

                    }

                }
                case 'limit': {

                }
                case 'sl': {

                }
                case 'sl-m': [

                ]

            }

        } else if (orderDetails?.commodity_type == 'f&o')
        {

        }

        let holdingDetails = await Holding.findOne({ item: finalOrderObj?.item, status: "bought", created_by: req.user._id });



        const newOrder = new Order(finalOrderObj);
        const savedOrder = await newOrder.save();

        if (!holdingDetails)
        {
            let averagePrice = parseFloat(+savedOrder.total_amount / +savedOrder.quantity).toFixed(2)

            let holdingObj = {
                quantity: savedOrder.quantity,
                item: savedOrder.item,
                average_price: +averagePrice,
                total_amount: +savedOrder.total_amount,
                created_by: req.user._id
            }


            let createHolding = new Holding(holdingObj);
            await createHolding.save();
        } else
        {

            let averagePrice = parseFloat((holdingDetails.total_amount + savedOrder.total_amount) / (holdingDetails.quantity + savedOrder.quantity)).toFixed(2)

            let holdingUpdated = await Holding.findByIdAndUpdate({ _id: holdingDetails._id }, {
                $set: {
                    quantity: holdingDetails.quantity + savedOrder.quantity,
                    total_amount: +holdingDetails.total_amount + +savedOrder.total_amount,
                    average_price: +averagePrice

                }
            }, { new: true })


        }

        await session.commitTransaction();

        return res.status(201).json({
            error: false,
            message: 'Sell Order created successfully',
            data: savedOrder,
        });
    } catch (error)
    {
        console.log(error)
        await session.abortTransaction();
        
        return res.status(400).json({
            error: true,
            message: 'Could not create order for some unknown reason',
        });
    } finally
    {
        session.endSession();
    }
};

const placeSellOrder = async (req, res) =>
{
    let session = await mongoose.startSession();
    try
    {
     session.startTransaction()

        let orderDetails = req.body;
        let user = req.user;
        let equity_amount = user.equity_amount;
        let commodity_amount = user.commodity_amount;
      


        let finalOrderObj = {};
        let holdingDetails = await Holding.findOne({ item: orderDetails.item, status: "bought", created_by: req.user._id });

        if(!holdingDetails){
            return res.status(400).json({
                error:true,
                info:"Cannot sell order without buying it first"
            })
        }

        if(holdingDetails?.quantity < orderDetails.quantity){
            return res.status(400).json({
                error: true,
                info: "Quantity exceeded"
            })
        }

        if (orderDetails.commodity_type == "equity")
        {

            switch (orderDetails?.order_placed_type_info)
            {

                case 'market': {

                    let stockDetails = await Stock.findById({ _id: orderDetails.item });

                    let totalOrderValue = parseFloat(handleCurrencyIndianToInteger(stockDetails.current_price) * orderDetails?.quantity).toFixed(2);



                    let accountUpdate = await addAmountToUserEquity(user._id, totalOrderValue);

                    if (accountUpdate.error == true)
                    {
                        return res.status(400).json(accountUpdate)
                    }



                    finalOrderObj = {
                        ...orderDetails,
                        ...finalOrderObj,
                        placed_price: stockDetails.current_price,
                        order_sold_at_price_initial: handleCurrencyIndianToInteger(orderDetails.order_sold_at_price_initial),
                        order_sold_at_price_final: handleCurrencyIndianToInteger(stockDetails.current_price),
                        executed_At: new Date(),
                        order_status: 'completed',
                        order_type: 'sell',
                        order_status_in_holdings: 'sold',
                        created_by: req.user._id,
                        total_amount: totalOrderValue




                    }
                    


                }
                case 'limit': {

                }
                case 'sl': {

                }
                case 'sl-m': [

                ]

            }

        } else if (orderDetails?.commodity_type == 'f&o')
        {

        }

        if (holdingDetails)
        {
            if (holdingDetails.quantity - finalOrderObj.quantity== 0)
            {
                let holdings_final = {
                    quantity: finalOrderObj.quantity,
                    price: finalOrderObj.order_sold_at_price_final
                };
                let updatedHoldingObj = {
                    quantity: 0,
                    total_amount: 0,
                    average_price: 0,
                    is_sold: true,
                    status: 'sold',

                }

                let updateHolding = await Holding.findByIdAndUpdate({ _id: holdingDetails._id }, {
                    ...updatedHoldingObj,
                    $push: {
                        holding_sold_at_price_final: holdings_final
                    }
                });
            } else if (holdingDetails.quantity > finalOrderObj.quantity)
            {
                let holdings_final = {
                    quantity: finalOrderObj.quantity,
                    price: finalOrderObj.order_sold_at_price_final
                };
                let updatedHoldingObj = {
                    quantity: holdingDetails.quantity - finalOrderObj.quantity,
                    total_amount: holdingDetails.total_amount - finalOrderObj.total_amount,
                    average_price: ((holdingDetails.total_amount - finalOrderObj.total_amount) / (holdingDetails.quantity - finalOrderObj.quantity)).toFixed(2),
                   
                }

                let updateHolding = await Holding.findByIdAndUpdate({ _id: holdingDetails._id }, {
                    ...updatedHoldingObj
                    ,
                    $push: {
                        holding_sold_at_price_final: holdings_final
                    }
                });
            }
        }



        const newOrder = new Order(finalOrderObj);
        const savedOrder = await newOrder.save();

        

        session.commitTransaction();

        return res.status(201).json({
            error: false,
            message: 'Order created successfully',
            data: savedOrder,
        });
    } catch (error)
    {
        console.log(error)
        session.abortTransaction();
        return res.status(500).json({
            error: true,
            message: 'Could not create order for some unknown reason',
        });
    } finally
    {

        session.endSession();
    }
};

// You can adjust search criteria based on your Order model
const searchOrders = async (req, res) =>
{
    try
    {
        const { criteria } = req.query; // Replace 'criteria' with your search field(s)

        const orderDetails = await Order.find({ criteria }); // Adjust search logic

        if (!orderDetails?.length > 0)
        {
            return res.status(400).json({
                error: true,
                message: 'Orders not found for search criteria',
                data: [],
            });
        }

        return res.status(200).json({
            error: false,
            message: 'Orders Found',
            data: orderDetails,
        });
    } catch (error)
    {
        return res.status(400).json({
            error: true,
            message: 'Could not fetch order information for some unknown reason',
        });
    }
};

const getAllOrders = async (req, res) =>
{
    try
    {
        const orderDetails = await Order.find({});

        if (!orderDetails?.length > 0)
        {
            return res.status(400).json({
                error: true,
                message: 'Orders Not Found',
                data: [],
            });
        }

        return res.status(200).json({
            error: false,
            message: 'Orders Found',
            data: orderDetails,
        });
    } catch (error)
    {
        return res.status(400).json({
            error: true,
            message: 'Could not fetch order information for some unknown reason',
        });
    }
};

const updateOrderByID = async (req, res, id) =>
{
    try
    {
        const updatedOrder = await Order.findByIdAndUpdate({ _id: id }, req.body, { new: true });

        if (!updatedOrder)
        {
            return res.status(404).json({
                error: true,
                message: 'Order not found',
            });
        }

        return res.status(200).json({
            error: false,
            message: 'Order updated successfully',
            data: updatedOrder._doc,
        });
    } catch (error)
    {
        return res.status(400).json({
            error: true,
            message: 'Could not update order information for some unknown reason',
        });
    }
};

const deleteOrderByID = async (req, res, id) =>
{
    try
    {
        const deletedOrder = await Order.findByIdAndDelete({ _id: id });

        if (!deletedOrder)
        {
            return res.status(404).json({
                error: true,
                message: "Not Found"
            });


        }

        return res.json({
            error: false,
            message: "Deleted Successfully"
        })

    } catch (error)
    {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}


module.exports = {
    placeBuyOrder,
    placeSellOrder,
    getAllHoldingOrdersByUser,
    getAllOrders,
    getAllOrdersByUser,
    getAllPositionOrdersByUser,
    updateOrderByID,
    deleteOrderByID,
    searchOrders,
    getOrderByID,
    getAllPendingOrdersByUser,
    getAllExecutedOrdersByUser
}