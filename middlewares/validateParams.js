const validateParams = requireParams => (req, res, next) => {
    requireParams.forEach(param => {
        if (!req.body[param]) {
            return res.status(400).send({message: `Missing required body parameters: ${requireParams}`});
        }
    });
    next();
};

module.exports = {
    validateParams
};