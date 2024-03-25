const logger = require('../middleware/logger');
const DL = require('../model/modelDownloadLink');
exports.downloadLinkGet = async (req, res) => {
    try {
        const userId = req.user[0]._id;
        const currentPage = 1;
        const numberPerPage = 3;
        const startIndex = (currentPage - 1) * numberPerPage;
        const pipeline = [
            { $match: { userId: userId } },
            { $project: { link: 1, createdAt: 1 } },
            { $skip: startIndex },
            { $limit: numberPerPage }
        ];
        const result = await DL.aggregate(pipeline);

        res.status(200).json({ success: true, result });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ success: false, error: err });
    }
};

exports.downloadLinkDynamicGet = async (req, res) => {
    try {
        const userId = req.user[0]._id;
        const currentPage = req.params.curPage;
        const numberPerPage = 3;
        const startIndex = (currentPage - 1) * numberPerPage;
        const pipeline = [
            { $match: { userId: userId } },
            { $project: { link: 1, createdAt: 1 } },
            { $skip: startIndex },
            { $limit: numberPerPage }
        ];
        const result = await DL.aggregate(pipeline);
        res.status(200).json({ success: true, result });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ success: false, error: err });
    }
};