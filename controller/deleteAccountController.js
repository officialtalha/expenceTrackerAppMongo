const logger = require('../middleware/logger');
const jwt = require('jsonwebtoken');
const User = require('../model/modelUser');
const Expense = require('../model/modelExpense');
const Order = require('../model/modelOrder');
const db = require('mongoose');
exports.deleteAccountDelete = async (req, res) => {
    try {
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, process.env.JWT_SecretKey);
        const userId = new db.Types.ObjectId(decoded.userId);

        await Expense.deleteMany({ userId: userId });
        await Order.deleteOne({ userId: userId });
        await User.deleteOne({ _id: userId });
        res.end();
    } catch (err) {
        logger.error(err);
        res.status(500).json({ status: false, err });
    }
};