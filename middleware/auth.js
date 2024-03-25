const Expense = require('../model/modelExpense');
const jwt = require('jsonwebtoken');
const User = require('../model/modelUser');
const mongoose = require('mongoose');

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const decode = jwt.verify(token, process.env.JWT_SecretKey);
        const ObjectId = new mongoose.Types.ObjectId(decode.userId);


        const pipeline = [
            { $match: { _id: ObjectId } },
            { $project: { _id: 1 } }
        ];
        const user = await User.aggregate(pipeline);
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
    }
}