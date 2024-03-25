const logger = require('../middleware/logger');
const db = require('mongoose');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const Order = require('../model/modelOrder');
const User = require('../model/modelUser');
const instance = new Razorpay({
    key_id: process.env.RZP_key_id,
    key_secret: process.env.RZP_key_secret
});


exports.premiumGet = async (req, res) => {
    try {
        const amount = 1000;
        instance.orders.create({ amount, currency: "INR" }, async (err, order) => {
            try {
                if (err) {
                    logger.error(err);
                    return res.json({ message: 'somthing error: ' + err });
                }
                const newOrder = new Order({
                    paymentid: "nil",
                    orderid: order.id,
                    status: "pending",
                    userId: req.user[0]._id
                });
                await newOrder.save();
                return res.status(200).json({ order, key_id: process.env.RZP_key_id });
            } catch (err) {
                logger.error(err);
            }
        });
    } catch (err) {
        logger.error(err);
    }
};

exports.premiumPost = async (req, res) => {
    try {
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, process.env.JWT_SecretKey);
        const userId = new db.Types.ObjectId(decoded.userId);
        const payment_id = req.body.payment_id;
        const { id, status } = req.body.order_id;

        await Order.updateOne({ userId: userId }, { status: status, paymentid: payment_id });
        await User.updateOne({ _id: userId }, { isPremium: true });
        res.end();
    } catch (err) {
        logger.error(err);
    }
};