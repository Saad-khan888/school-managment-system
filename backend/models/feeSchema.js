const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
    // Reference to the class
    sclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    // Fee amount for the class
    amount: {
        type: Number,
        required: true,
    },
    // Fee period (e.g., "Monthly", "Quarterly", "Yearly", "One-time")
    period: {
        type: String,
        required: true,
        default: "Monthly"
    },
    // Reference to the school/admin
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("fee", feeSchema);
