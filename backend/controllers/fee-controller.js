const Fee = require('../models/feeSchema.js');
const Sclass = require('../models/sclassSchema.js');

// Create or update fee for a class
const setClassFee = async (req, res) => {
    try {
        const { sclassId, amount, period, adminID } = req.body;

        // Check if fee already exists for this class
        const existingFee = await Fee.findOne({ sclass: sclassId, school: adminID });

        if (existingFee) {
            // Update existing fee
            existingFee.amount = amount;
            existingFee.period = period;
            const updatedFee = await existingFee.save();
            return res.send(updatedFee);
        } else {
            // Create new fee
            const newFee = new Fee({
                sclass: sclassId,
                amount,
                period,
                school: adminID
            });
            const savedFee = await newFee.save();
            return res.send(savedFee);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get all fees for a school
const getAllFees = async (req, res) => {
    try {
        const fees = await Fee.find({ school: req.params.id })
            .populate('sclass', 'sclassName');
        
        if (fees.length > 0) {
            res.send(fees);
        } else {
            res.send({ message: "No fees found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get fee for a specific class
const getClassFee = async (req, res) => {
    try {
        const fee = await Fee.findOne({ sclass: req.params.id })
            .populate('sclass', 'sclassName');
        
        if (fee) {
            res.send(fee);
        } else {
            res.send({ message: "No fee found for this class" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Delete fee
const deleteFee = async (req, res) => {
    try {
        const result = await Fee.findByIdAndDelete(req.params.id);
        if (result) {
            res.send({ message: "Fee deleted successfully" });
        } else {
            res.send({ message: "Fee not found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    setClassFee,
    getAllFees,
    getClassFee,
    deleteFee
};
