const _ = require('lodash');

const validateParams = requiredParams => (req, res, next) => {
    try {
        _.forEach(requiredParams, param => {
            if (!req.body[param]) {
                throw new Error(`Missing required body parameters: ${requiredParams}`);
            }
        });
        next();
    } catch ({ message }) {
        res.status(400).send({ message });
    }
};

module.exports = {
    validateParams
};