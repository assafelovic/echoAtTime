'use strict';
const messagesModel = require('../models/messages');

const scheduleMessage = async (messageObj) => {
    const result = await messagesModel.add(messageObj);
    return { message: messageObj, status: result === 1, scheduledAt: new Date(messageObj.time) };
};

module.exports = {
    scheduleMessage
};