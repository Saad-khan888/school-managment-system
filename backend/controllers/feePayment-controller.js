const FeePayment = require('../models/feePaymentSchema.js');
const Fee = require('../models/feeSchema.js');
const Student = require('../models/studentSchema.js');

// Get payment history for a class
const getClassPayments = async (req, res) => {
    try {
        const { classId, period } = req.params;
        
        let query = { sclass: classId };
        if (period) {
            query.paymentPeriod = period;
        }

        const payments = await FeePayment.find(query)
            .populate('student', 'name rollNum')
            .populate('fee', 'amount period')
            .sort({ createdAt: -1 });
        
        if (payments.length > 0) {
            res.send(payments);
        } else {
            res.send({ message: "No payment records found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get payment history for a student
const getStudentPayments = async (req, res) => {
    try {
        const payments = await FeePayment.find({ student: req.params.id })
            .populate('fee', 'amount period')
            .sort({ createdAt: -1 });
        
        if (payments.length > 0) {
            res.send(payments);
        } else {
            res.send({ message: "No payment history" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Mark fee as paid for a student
const markFeePaid = async (req, res) => {
    try {
        const { studentId, classId, feeId, paymentPeriod, amountPaid, adminID } = req.body;

        // Check if payment already exists for this period
        const existingPayment = await FeePayment.findOne({
            student: studentId,
            sclass: classId,
            fee: feeId,
            paymentPeriod: paymentPeriod
        });

        if (existingPayment) {
            // Update existing payment
            existingPayment.status = 'Paid';
            existingPayment.paidDate = new Date();
            existingPayment.amountPaid = amountPaid;
            const updated = await existingPayment.save();
            return res.send(updated);
        } else {
            // Create new payment record
            const newPayment = new FeePayment({
                student: studentId,
                sclass: classId,
                fee: feeId,
                paymentPeriod,
                amountPaid,
                status: 'Paid',
                paidDate: new Date(),
                school: adminID
            });
            const saved = await newPayment.save();
            return res.send(saved);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get current period payment status for all students in a class
const getCurrentPeriodStatus = async (req, res) => {
    try {
        const { classId, period } = req.params;

        // Get all students in the class
        const students = await Student.find({ sclassName: classId })
            .select('name rollNum');

        // Get fee for the class
        const fee = await Fee.findOne({ sclass: classId });

        if (!fee) {
            return res.send({ message: "No fee set for this class" });
        }

        // Get payments for current period
        const payments = await FeePayment.find({
            sclass: classId,
            paymentPeriod: period,
            status: 'Paid'
        });

        // Create a map of student payment status
        const paymentMap = {};
        payments.forEach(payment => {
            paymentMap[payment.student.toString()] = payment;
        });

        // Build response with student payment status
        const result = students.map(student => ({
            studentId: student._id,
            studentName: student.name,
            rollNum: student.rollNum,
            feeAmount: fee.amount,
            feePeriod: fee.period,
            isPaid: !!paymentMap[student._id.toString()],
            paidDate: paymentMap[student._id.toString()]?.paidDate || null
        }));

        res.send({
            fee: fee,
            students: result,
            period: period
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    getClassPayments,
    getStudentPayments,
    markFeePaid,
    getCurrentPeriodStatus
};
