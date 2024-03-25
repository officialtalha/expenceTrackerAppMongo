const logger = require('../middleware/logger');
const Expense = require('../model/modelExpense');
const User = require('../model/modelUser');
const jwt = require('jsonwebtoken');
const db = require('mongoose');

exports.addExpensePost = async (req, res) => {
    try {
        const { amount, description, catogary, token } = req.body;

        const decode = jwt.verify(token, process.env.JWT_SecretKey);
        const userId = new db.Types.ObjectId(decode.userId);
        //1
        const newExpense = new Expense(
            {
                amount,
                description,
                catogary,
                userId: userId
            }
        );

        const result = await newExpense.save();

        //2
        const pipeline = [
            { $match: { userId: userId } },
            { $group: { _id: null, totalExpenses: { $sum: "$amount" } } }
        ];

        const totalExpenses = await Expense.aggregate(pipeline);
        await User.updateOne({ _id: userId }, { totalExpenses: totalExpenses[0].totalExpenses });
        res.json({ success: true, result });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};

exports.addExpenseDelete = async (req, res) => {
    try {
        const expenseId = new db.Types.ObjectId(req.params.id);

        const token = req.header('Authorization');
        const decode = jwt.verify(token, process.env.JWT_SecretKey);
        const userId = new db.Types.ObjectId(decode.userId);;

        const pipelineForAmount = [
            { $match: { _id: expenseId } },
            { $project: { _id: 0, amount: 1 } },
        ];
        const amount = await Expense.aggregate(pipelineForAmount);

        await Expense.deleteOne({ _id: expenseId });

        const pipelineFortotalExpenses = [
            { $match: { _id: userId } },
            { $project: { _id: 0, totalExpenses: 1 } }
        ];
        const totalExpenses = await User.aggregate(pipelineFortotalExpenses);

        const finalAmount = totalExpenses[0].totalExpenses - amount[0].amount;

        await User.updateOne({ _id: userId }, { totalExpenses: finalAmount });

        res.end();
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};

exports.addExpenseGet = async (req, res) => {
    try {
        const id = req.user[0]._id;
        const curPage = 1;
        const itemsPerPage = req.params.getItemPerPage;

        const pipeline = [
            { $match: { userId: id } },
            { $skip: (curPage - 1) * itemsPerPage },
            { $limit: Number(itemsPerPage) }
        ];
        const result = await Expense.aggregate(pipeline);
        res.status(200).json({ result });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};

exports.addExpenseDynamicGet = async (req, res) => {
    try {

        const userId = req.user[0]._id;
        const curPage = req.params.curPage;
        const itemsPerPage = Number(req.params.itemPerPage);

        const pipeline = [
            { $match: { userId: userId } },
            { $skip: (curPage - 1) * itemsPerPage },
            { $limit: itemsPerPage }
        ];
        const result = await Expense.aggregate(pipeline);
        res.status(200).json({ success: true, result });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};

exports.sumExpensesGet = async (req, res) => {
    try {
        const pipeline = [
            { $match: { _id: req.user[0]._id } },
            { $project: { _id: 0, totalExpenses: 1 } }
        ];

        const result = await User.aggregate(pipeline);
        res.status(200).json({ result });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ success: false, error: err });
    }
};