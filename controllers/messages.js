const { scheduleEcho } = require('../services/scheduler');

module.exports = (app) => {
    app.post(
        '/schedule',
        (req, res) => {
            res.send(scheduleEcho(req));
        }
    )
};
