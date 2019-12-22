'use strict';
const messagesModel = require('../models/messages');

const scheduleMessage = async (messageObj) => {
    const result = await messagesModel.add(messageObj);
    return { message: messageObj, success: !!result, scheduledAt: new Date(messageObj.time) };
};

module.exports = {
    scheduleMessage
};