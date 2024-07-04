const Holding = require('../model/holding.model') // Assuming your model is in a 'models' directory

const addNewHolding = async (req, res) =>
{
    try
    {
        const newHolding = new Holding(req.body);
        const savedHolding = await newHolding.save();
        return res.json({ error: false, info: 'Holding created successfully!', data: savedHolding });
    } catch (error)
    {
        console.error(error);
        return res.status(500).json({ error: true, info: 'Error creating holding!', data: null });
    }
};

const getAllHoldings = async (req, res) =>
{
    try
    {
        const holdings = await Holding.find();
        return res.json({ error: false, info: 'Holdings retrieved successfully!', data: holdings });
    } catch (error)
    {
        console.error(error);
        return res.status(500).json({ error: true, info: 'Error retrieving holdings!', data: null });
    }
};

const getUserHoldingData = async (req, res) =>
{
    try
    {
        let holdingDetails = await Holding.aggregate([
            {
                $match:{
                    created_by:req.user._id,
                    quantity:{
                        $gt:0
                    },
                    status:"bought"
                }
            },
            {
                $lookup:{
                    from:"stocks",
                    localField:"item",
                    foreignField:"_id",
                    as:"item"
                }
            },
            {
                $unwind:"$item"
            },
           
        ])

        // console.log(holdingDetails)

        if(!holdingDetails?.length>0){
            return res.status(404).json({
                error:true,
                info:"Not Found"
            })
        }

        return res.json({
            error:false,
            info:"Data Found",
            data:holdingDetails
        })
        
    } catch (error)
    {
        console.error(error);
        return res.status(500).json({ error: true, info: 'Error retrieving holdings!', data: null });
    }
};

const getHoldingById = async (req, res) =>
{
    try
    {
        const holdingId = req.params.id; // Access ID from URL parameter
        const holding = await Holding.findById(holdingId);
        if (!holding)
        {
            return res.status(404).json({ error: true, info: 'Holding not found!', data: null });
        }
        return res.json({ error: false, info: 'Holding retrieved successfully!', data: holding });
    } catch (error)
    {
        console.error(error);
        return res.status(500).json({ error: true, info: 'Error retrieving holding!', data: null });
    }
};

const updateHolding = async (req, res) =>
{
    try
    {
        const holdingId = req.params.id;
        const updateData = req.body;
        const updatedHolding = await Holding.findByIdAndUpdate(holdingId, updateData, { new: true });
        if (!updatedHolding)
        {
            return res.status(404).json({ error: true, info: 'Holding not found!', data: null });
        }
        return res.json({ error: false, info: 'Holding updated successfully!', data: updatedHolding });
    } catch (error)
    {
        console.error(error);
        return res.status(500).json({ error: true, info: 'Error updating holding!', data: null });
    }
};

const deleteHolding = async (req, res) =>
{
    try
    {
        const holdingId = req.params.id;
        await Holding.findByIdAndDelete(holdingId);
        return res.json({ error: false, info: 'Holding deleted successfully!', data: null }); // No data returned on delete
    } catch (error)
    {
        console.error(error);
        return res.status(500).json({ error: true, info: 'Error deleting holding!', data: null });
    }
};

module.exports = {
    addNewHolding,
    getAllHoldings,
    getHoldingById,
    updateHolding,
    deleteHolding,
    getUserHoldingData
};