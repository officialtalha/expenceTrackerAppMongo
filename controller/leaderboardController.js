const logger = require('../middleware/logger');
const User = require('../model/modelUser');
const Expense = require('../model/modelExpense');
const sequelize = require('../util/database');
exports.leaderboardGet = async (req, res) => {
    try {
        const pipeline = [
            { $project: { name: 1, totalExpenses: 1 } },
            { $sort: { totalExpenses: -1 } }
        ];
        const allUsers = await User.aggregate(pipeline);

        res.status(200).json({ allUsers });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ success: false, error: err });
    }
};

