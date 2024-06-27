const Order = require('../model/order.model'); // Update path if needed

// **Helper function to retrieve orders by user ID**
const getAllOrdersByUser= async (userId) =>
{
    try
    {
        const orders = await Order.find({ created_by: req.params.userId }); // Adjust field name if needed
        return orders;
    } catch (error)
    {
        throw new Error('Could not fetch orders for user');
    }
};

const getAllHoldingOrdersByUser = async (userId) =>
{
    try
    {
        const orders = await Order.find({ created_by: req.params.userId, }); // Adjust field name if needed
        return orders;
    } catch (error)
    {
        return res.status(500).json({
            error:true,
            message:error.message
        })
    }
};

const getAllPositionOrdersByUser = async (userId) =>
{
    try
    {
        const orders = await Order.find({ created_by: req.params.userId, }); // Adjust field name if needed
        return orders;
    } catch (error)
    {
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
        next();
    } catch (error)
    {
        return res.status(400).json({
            error: true,
            message: 'Could not fetch order information for some unknown reason',
        });
    }
};

const addNewOrder = async (req, res) =>
{
    try
    {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();

        return res.status(201).json({
            error: false,
            message: 'Order created successfully',
            data: savedOrder,
        });
    } catch (error)
    {
        return res.status(400).json({
            error: true,
            message: 'Could not create order for some unknown reason',
        });
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
                message:"Not Found"
        });
            
            
        }

        return res.json({
            error:false,
            message:"Deleted Successfully"
        })

    }catch(error){
        return res.status(500).json({
            error:true,
            message:error.message
        })
    }
}


 module.exports = {
    addNewOrder,
    getAllHoldingOrdersByUser,
    getAllOrders,
    getAllOrdersByUser,
    getAllPositionOrdersByUser,
    updateOrderByID,
    deleteOrderByID,
    searchOrders
 }