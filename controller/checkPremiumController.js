const logger = require('../middleware/logger');
const User = require('../model/modelUser');

exports.checkPremiumGet = async (req, res) => {
    try {
        const userId = req.user[0]._id;
        const pipeline = [
            { $match: { _id: userId } },
            { $project: { _id: 0, isPremium: 1 } }
        ];
        const result = await User.aggregate(pipeline);
        res.json({ success: true, result });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ status: false, err });
    }
};