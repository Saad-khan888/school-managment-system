const mongoose = require("mongoose");

const feePaymentSchema = new mongoose.Schema({
    // Reference to the student
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true,
    },
    // Reference to the class
    sclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    // Reference to the fee structure
    fee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fee',
        required: true,
    },
    // Month and year of payment (e.g., "January 2025", "Q1 2025", "2025")
    paymentPeriod: {
        type: String,
        required: true,
    },
    // Amount paid
    amountPaid: {
        type: Number,
        required: true,
    },
    // Payment status
    status: {
        type: String,
        enum: ['Paid', 'Pending'],
        default: 'Pending',
    },
    // Payment date
    paidDate: {
        type: Date,
    },
    // Reference to the school/admin
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("feePayment", feePaymentSchema);
