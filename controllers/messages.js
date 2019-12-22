const { scheduleMessage } = require('../services/scheduler');
const { validateParams } = require('../middlewares/validateParams');
const shortid = require('shortid');

module.exports = (app) => {
    app.post(
        '/api/echo',
        validateParams(['time', 'message']),
        async (req, res) => {
            const { time, message } = req.body;
            // consistent hashing can be applied here
            const id = shortid.generate();
            const response = await scheduleMessage({ time, message, id });
            res.send(response);
        }
    )
};
